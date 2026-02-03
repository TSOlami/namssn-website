# Audit Logging (Cost-Effective)

## Purpose

Record **who did what, when, and the outcome** for accountability, security review, and compliance. Enables answering: "Who blocked this user?", "Who sent that email?", etc.

## How It Works

- **Primary store: file-based logs** (no database cost). Events are appended as **JSON lines** to daily files: `logs/audit/audit-YYYY-MM-DD.log`.
- **Optional: database** for recent-activity UI or querying. Set `AUDIT_USE_DB=true` to also write to the `AuditLog` collection. Use a TTL index or cron to delete DB records older than 30–90 days so DB stays small.

## Environment

| Variable               | Default              | Description                                                |
|------------------------|----------------------|------------------------------------------------------------|
| `AUDIT_LOG_DIR`        | `backend/logs/audit`| Directory for daily log files.                             |
| `AUDIT_USE_DB`         | `false`              | Set to `true` or `1` to also write to MongoDB.             |
| `AUDIT_RETENTION_DAYS` | `90`                 | Delete log files older than this many days (on startup).   |

**Cost-effective default:** Do not set `AUDIT_USE_DB`; use file-only. Disk/log storage is cheap; DB growth can be expensive.

## Log File Format

One JSON object per line (JSON lines), e.g.:

```json
{"ts":"2025-01-31T12:00:00.000Z","action":"user.block","resourceType":"User","resourceId":"...","details":{"targetUsername":"jane"},"outcome":"success","actor":"...","actorEmail":"admin@example.com","ip":"1.2.3.4","userAgent":"..."}
```

Fields: `ts`, `action`, `resourceType`, `resourceId`, `details`, `outcome`, `actor`, `actorEmail`, `ip`, `userAgent`.

## Retention (Cost-Effective)

On **Render free tier** you don't get cron jobs. The audit logger handles retention **on server startup** (no cron needed):

- **On every deploy/restart:** For each **completed past month**, all that month's daily `.log` files are bundled into one compressed `audit-YYYY-MM.log.gz`; then any `.log` or `.log.gz` older than `AUDIT_RETENTION_DAYS` (default 90) are deleted. So you get one archive per month (fewer files) and logs don't grow forever—no cron needed.
- **Optional:** Use an external free cron (e.g. [cron-job.org](https://cron-job.org)) to hit a protected admin endpoint that runs retention, if you want compression more often than on restart.
- **Optional:** Ship `.gz` files to S3/GCS with a lifecycle rule (e.g. delete after 1 year).
- **DB (if enabled):** Add a TTL index on `createdAt` so MongoDB auto-deletes records older than 30 days (no cron).

## Adding New Events

In any controller (after a state-changing action):

```js
import { logAuditEvent } from '../utils/auditLogger.js';

// On success
logAuditEvent({
  action: 'blog.delete',
  resourceType: 'Blog',
  resourceId: blogId,
  details: { title: blog.title },
  outcome: 'success',
}, req);

// On failure
logAuditEvent({
  action: 'blog.delete',
  resourceType: 'Blog',
  resourceId: blogId,
  outcome: 'failure',
  errorMessage: err.message,
}, req);
```

`req` is used to fill `actor`, `actorEmail`, `ip`, and `userAgent`. Omit `req` for system/unauthenticated events.

## Currently Audited Actions

- `user.block` – admin blocks a user
- `user.unblock` – admin unblocks a user
- `user.make_admin` – admin grants admin role
- `user.remove_admin` – admin removes admin role
- `mail.send_user` – admin sends personal email to a user

Add more calls in adminController, mailer, postController, etc., for create/update/delete of blogs, events, announcements, categories, and other sensitive operations.
