import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/userModel.js';
import { logAuditEvent } from '../utils/auditLogger.js';

const nodeconfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
  greetingTimeout: 10000,
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
};

const transporter = nodemailer.createTransport(nodeconfig);

let smtpVerified = false;
let smtpVerificationAttempted = false;

async function ensureSmtpVerified() {
  if (smtpVerified || smtpVerificationAttempted) return;
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    console.warn('[mailer] EMAIL or EMAIL_PASSWORD not set; outgoing mail will fail.');
    smtpVerificationAttempted = true;
    return;
  }
  smtpVerificationAttempted = true;
  try {
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Verification timeout')), 8000)
    );
    await Promise.race([verifyPromise, timeoutPromise]);
    smtpVerified = true;
    console.log('[mailer] SMTP connection verified for', process.env.EMAIL);
  } catch (err) {
    if (err.message === 'Verification timeout') {
      console.warn('[mailer] SMTP verification timed out (non-blocking). Emails will still attempt to send.');
    } else {
      console.error('[mailer] SMTP verify failed:', err.message);
      if (err.code === 'EAUTH') {
        console.error('[mailer] Use a Gmail App Password (not your normal password): https://myaccount.google.com/apppasswords');
      }
    }
  }
}

let MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'NAMSSN FUTMINNA',
    link: 'https://namssnfutminna.edu.ng/',
  },
});

/**
 * POST /api/v1/users/register-mail
 * 
 * @desc Send a mail
 * @access Public
 * @param {Object} req - Express request object.
 */
export const registerMail = asyncHandler(async (req,res) => {
  const { username, userEmail, text, subject } = req.body;

  // Create the body of the email
  var email = {
    body: {
      name: username,
      intro: text || 'Welcome to NAMSSN, FUTMINNA chapter! We\'re very excited to have you on board.',
      // action: {
      //   instructions: 'To get started with Mailgen, please click here:',
      //   button: {
      //     color: '#22BC66', // Optional action button color
      //     text: 'Confirm your account',
      //     link: 'https://mailgen.js/'
      //   }
      // },
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  };

  // Generate an HTML email with the provided contents
  var emailBody = await MailGenerator.generate(email);

  // Message object
  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject || 'Welcome to NAMSSN, FUTMINNA chapter!',
    html: emailBody
  };
  
  await ensureSmtpVerified();
  try {
    const sendPromise = transporter.sendMail(message);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Send timeout')), 15000)
    );
    await Promise.race([sendPromise, timeoutPromise]);
    console.log('Email sent to:', message.to);
    return res.status(200).send({ msg: 'You should receive an email from us shortly!' });
  } catch (err) {
    if (err.message === 'Send timeout') {
      console.error('[mailer] registerMail timed out after 15s');
    } else {
      console.error('[mailer] registerMail failed:', err.message, err.code || '');
    }
    return res.status(500).send({ error: 'Failed to send email. Please try again later.' });
  }
});

/**
 * POST /api/v1/users/contact-us
 * 
 * @desc Send a mail
 * @access Public
 * @param {Object} req - Express request object.
 */
export const contactUs = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Input validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const msg = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  };

  await ensureSmtpVerified();
  try {
    const sendPromise = transporter.sendMail(msg);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Send timeout')), 15000)
    );
    await Promise.race([sendPromise, timeoutPromise]);
    console.log('Contact form email sent from', email);
    return res.status(200).send({ msg: 'Your message has been sent successfully!' });
  } catch (err) {
    if (err.message === 'Send timeout') {
      console.error('[mailer] contactUs timed out after 15s');
    } else {
      console.error('[mailer] contactUs failed:', err.message, err.code || '');
    }
    return res.status(500).send({ error: 'Failed to send message. Please try again later.' });
  }
});

/**
 * POST /api/v1/admin/notice-mail
 * 
 * @desc Send a mail
 * @access Public
 * @param {Object} req - Express request object.
 */
export const mailNotice = asyncHandler(async (req, res) => {
  const { sendTo, subject, text, selectedLevel } = req.body;

  if (!sendTo || !subject || !text || !selectedLevel) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  let userEmails;

  if (selectedLevel === 'all') {
    userEmails = await User.find().distinct(sendTo === 'studentEmail' ? 'studentEmail' : 'email');
  } else {
    userEmails = await User.find({ level: selectedLevel }).distinct(sendTo === 'studentEmail' ? 'studentEmail' : 'email');
  }

  if (!userEmails || userEmails.length === 0) {
    res.status(404).json({ message: 'No emails found for the specified criteria' });
    return;
  }

  await ensureSmtpVerified();
  const failures = [];
  for (const userEmail of userEmails) {
    try {
      const email = {
        body: {
          intro: text || 'Welcome to NAMSSN, FUTMINNA chapter! We\'re very excited to have you on board.',
          outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
        },
      };
      const emailBody = await MailGenerator.generate(email);
      const message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject || 'Welcome to NAMSSN, FUTMINNA chapter!',
        html: emailBody,
      };
      const sendPromise = transporter.sendMail(message);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Send timeout')), 15000)
      );
      await Promise.race([sendPromise, timeoutPromise]);
    } catch (err) {
      if (err.message === 'Send timeout') {
        console.error('[mailer] notice-mail timed out for', userEmail);
      } else {
        console.error('[mailer] notice-mail failed for', userEmail, err.message);
      }
      failures.push(userEmail);
    }
  }
  if (failures.length > 0) {
    console.warn('[mailer] notice-mail: failed for', failures.length, 'recipients');
    return res.status(207).json({
      msg: `Emails sent; ${failures.length} failed.`,
      failedCount: failures.length,
      total: userEmails.length,
    });
  }
  console.log('Notice emails sent to', userEmails.length, 'recipients');
  res.status(200).json({ msg: 'Emails sent successfully!' });
});

/**
 * POST /api/v1/admin/send-user-mail
 * @desc Send a personal email TO a single user (admin only). The admin composes subject + message;
 *      we send that email to the user's email address (we do NOT send account/credentials to anyone).
 * @access Private (admin)
 */
export const sendUserMail = asyncHandler(async (req, res) => {
  const { userId, subject, text } = req.body;

  if (!userId || !subject || !text) {
    res.status(400).json({ message: 'userId, subject and text are required' });
    return;
  }

  const user = await User.findById(userId).select('name email studentEmail');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const userEmail = user.studentEmail || user.email;
  if (!userEmail) {
    res.status(400).json({ message: 'User has no email on file' });
    return;
  }

  const email = {
    body: {
      name: user.name,
      intro: text,
      outro: 'Need help, or have questions? Just reply to this email.',
    },
  };

  const emailBody = await MailGenerator.generate(email);
  const message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject.trim(),
    html: emailBody,
  };

  await ensureSmtpVerified();
  try {
    const sendPromise = transporter.sendMail(message);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Send timeout')), 15000)
    );
    await Promise.race([sendPromise, timeoutPromise]);
  } catch (err) {
    if (err.message === 'Send timeout') {
      console.error('[mailer] sendUserMail timed out after 15s');
    } else {
      console.error('[mailer] sendUserMail failed:', err.message, err.code || '');
    }
    logAuditEvent({
      action: 'mail.send_user',
      resourceType: 'User',
      resourceId: userId,
      details: { to: userEmail, error: err.message },
      outcome: 'failure',
      errorMessage: err.message,
    }, req);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
  logAuditEvent({
    action: 'mail.send_user',
    resourceType: 'User',
    resourceId: userId,
    details: { to: userEmail, subjectLength: subject?.length },
    outcome: 'success',
  }, req);
  console.log('Personal email sent to:', userEmail);
  res.status(200).json({ msg: 'Email sent successfully!' });
});