/**
 * Cost-effective audit logging: who did what, when, and the outcome.
 *
 * Primary: append-only JSON lines to a daily log file (no DB cost).
 * Optional: also write to DB for recent-activity UI (set AUDIT_USE_DB=true).
 *
 * Log files: logs/audit/audit-YYYY-MM-DD.log (one JSON object per line).
 * Retention: on startup, compress each completed month's daily logs into audit-YYYY-MM.log.gz, then delete files older than AUDIT_RETENTION_DAYS.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = process.env.AUDIT_LOG_DIR || path.join(__dirname, '..', 'logs', 'audit');
const USE_DB = process.env.AUDIT_USE_DB === 'true' || process.env.AUDIT_USE_DB === '1';
const RETENTION_DAYS = Math.max(1, parseInt(process.env.AUDIT_RETENTION_DAYS || '90', 10));

let AuditLogModel = null;
async function getAuditLogModel() {
  if (AuditLogModel) return AuditLogModel;
  if (!USE_DB) return null;
  try {
    const module = await import('../models/auditLogModel.js');
    AuditLogModel = module.default;
    return AuditLogModel;
  } catch (e) {
    console.warn('[audit] AUDIT_USE_DB enabled but AuditLog model not loaded:', e.message);
    return null;
  }
}

function getLogFilePath() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return path.join(LOG_DIR, `audit-${y}-${m}-${d}.log`);
}

function enrichFromReq(payload, req) {
  if (!req) return payload;
  const actor = req.user?._id?.toString?.() || req.user?.id;
  const actorEmail = req.user?.email || '';
  const ip = req.ip || req.connection?.remoteAddress || (req.headers && (req.headers['x-forwarded-for'] || req.headers['cf-connecting-ip'])) || '';
  const forwarded = req.headers?.['x-forwarded-for'];
  const ipResolved = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded;
  const userAgent = typeof req.get === 'function' ? req.get('user-agent') || '' : (req.headers && req.headers['user-agent']) || '';
  return {
    ...payload,
    actor: actor || payload.actor,
    actorEmail: actorEmail || payload.actorEmail,
    ip: ipResolved || ip || payload.ip,
    userAgent: userAgent || payload.userAgent,
  };
}

function toLogLine(payload) {
  const timestamp = new Date().toISOString();
  const record = { ts: timestamp, ...payload };
  return JSON.stringify(record) + '\n';
}

async function writeToFile(payload) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const filePath = getLogFilePath();
    await fs.appendFile(filePath, toLogLine(payload), 'utf8');
  } catch (err) {
    console.error('[audit] File write failed:', err.message);
  }
}

async function writeToDb(payload) {
  const Model = await getAuditLogModel();
  if (!Model) return;
  try {
    await Model.create({
      actor: payload.actor || undefined,
      actorEmail: payload.actorEmail || '',
      action: payload.action,
      resourceType: payload.resourceType || '',
      resourceId: payload.resourceId || '',
      details: payload.details || {},
      outcome: payload.outcome || 'success',
      errorMessage: payload.errorMessage || '',
      ip: payload.ip || '',
      userAgent: payload.userAgent || '',
    });
  } catch (err) {
    console.error('[audit] DB write failed:', err.message);
  }
}

/**
 * Log an audit event. Non-blocking; safe to call from request handlers.
 *
 * @param {Object} payload
 * @param {string} payload.action - e.g. 'user.block', 'user.make_admin', 'mail.send_user'
 * @param {string} [payload.resourceType] - e.g. 'User', 'Blog', 'Payment'
 * @param {string} [payload.resourceId] - ID of the affected resource
 * @param {Object} [payload.details] - extra context (e.g. { targetUserId, subject })
 * @param {string} [payload.outcome] - 'success' | 'failure'
 * @param {string} [payload.errorMessage] - when outcome is 'failure'
 * @param {Object} [req] - Express request (used for actor, ip, userAgent)
 */
export function logAuditEvent(payload, req) {
  const enriched = enrichFromReq(payload, req);
  const safe = {
    action: enriched.action,
    resourceType: enriched.resourceType || '',
    resourceId: enriched.resourceId || '',
    details: enriched.details || {},
    outcome: enriched.outcome || 'success',
    errorMessage: enriched.errorMessage || '',
    actor: enriched.actor || null,
    actorEmail: enriched.actorEmail || '',
    ip: enriched.ip || '',
    userAgent: enriched.userAgent || '',
  };

  setImmediate(async () => {
    await writeToFile(safe);
    if (USE_DB) await writeToDb(safe);
  });
}

/**
 * For each completed month: bundle that month's daily .log files into one audit-YYYY-MM.log.gz, then delete the dailies.
 * Then delete any .log or .log.gz older than RETENTION_DAYS.
 * Call once on server startup (no cron needed on Render free tier).
 */
export async function runAuditRetention() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const entries = await fs.readdir(LOG_DIR, { withFileTypes: true });
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
    const dailyLogsByMonth = new Map();
    for (const e of entries) {
      if (!e.isFile()) continue;
      const logMatch = e.name.match(/^audit-(\d{4})-(\d{2})-(\d{2})\.log$/);
      if (!logMatch) continue;
      const [, y, m, d] = logMatch;
      const yNum = parseInt(y, 10);
      const mNum = parseInt(m, 10) - 1;
      if (yNum === currentYear && mNum === currentMonth) continue;
      const key = `${y}-${m}`;
      if (!dailyLogsByMonth.has(key)) dailyLogsByMonth.set(key, []);
      dailyLogsByMonth.get(key).push({ name: e.name, y, m, d });
    }
    for (const [key, files] of dailyLogsByMonth) {
      files.sort((a, b) => (a.y + a.m + a.d).localeCompare(b.y + b.m + b.d));
      const chunks = [];
      for (const { name } of files) {
        const filePath = path.join(LOG_DIR, name);
        try {
          const content = await fs.readFile(filePath, 'utf8');
          chunks.push(content);
        } catch (err) {
          console.error('[audit] Read failed for', name, err.message);
        }
      }
      if (chunks.length === 0) continue;
      const monthlyGz = path.join(LOG_DIR, `audit-${key}.log.gz`);
      try {
        const combined = chunks.join('');
        const compressed = await gzip(Buffer.from(combined, 'utf8'));
        await fs.writeFile(monthlyGz, compressed);
        for (const { name } of files) {
          await fs.unlink(path.join(LOG_DIR, name)).catch(() => {});
        }
      } catch (err) {
        console.error('[audit] Monthly compress failed for', key, err.message);
      }
    }

    const afterEntries = await fs.readdir(LOG_DIR, { withFileTypes: true });
    const toDelete = [];
    for (const e of afterEntries) {
      if (!e.isFile()) continue;
      const name = e.name;
      const dailyLog = name.match(/^audit-(\d{4})-(\d{2})-(\d{2})\.log$/);
      const dailyGz = name.match(/^audit-(\d{4})-(\d{2})-(\d{2})\.log\.gz$/);
      const monthlyGz = name.match(/^audit-(\d{4})-(\d{2})\.log\.gz$/);
      const filePath = path.join(LOG_DIR, name);
      let fileDate;
      if (dailyLog || dailyGz) {
        const [, y, m, d] = (dailyLog || dailyGz);
        fileDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
      } else if (monthlyGz) {
        const [, y, m] = monthlyGz;
        fileDate = new Date(parseInt(y, 10), parseInt(m, 10), 0);
      } else continue;
      if (fileDate < cutoff) toDelete.push(filePath);
    }
    for (const filePath of toDelete) {
      await fs.unlink(filePath).catch(() => {});
    }
  } catch (err) {
    console.error('[audit] Retention run failed:', err.message);
  }
}

export default { logAuditEvent, runAuditRetention };
