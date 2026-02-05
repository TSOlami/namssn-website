import dns from 'dns';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

dns.setDefaultResultOrder('ipv4first');

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

export async function verifyEmailTransport() {
  if (smtpVerified || smtpVerificationAttempted) return;
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    console.warn('[emailService] EMAIL or EMAIL_PASSWORD not set.');
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
    console.log('[emailService] SMTP verified for', process.env.EMAIL);
  } catch (err) {
    if (err.message === 'Verification timeout') {
      console.warn('[emailService] SMTP verification timed out (non-blocking). Emails will still attempt to send.');
    } else {
      console.error('[emailService] SMTP verify failed:', err.message);
      if (err.code === 'EAUTH') {
        console.error('[emailService] Use a Gmail App Password: https://myaccount.google.com/apppasswords');
      }
    }
  }
}

const MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'NAMSSN FUTMINNA',
    link: 'https://namssnfutminna.edu.ng/',
  },
});

/**
 * Send OTP email to user
 * @param {string} userEmail - The recipient's email address
 * @param {string} username - The recipient's username
 * @param {string} otp - The OTP code to send
 * @returns {Promise} - Resolves on success, rejects on failure
 */
export const sendOTPEmail = async (userEmail, username, otp) => {
  const email = {
    body: {
      name: username,
      intro: `Your OTP verification code is: <strong>${otp}</strong>`,
      action: {
        instructions: 'This code is valid for 5 minutes. Please do not share this code with anyone.',
        button: {
          color: '#22BC66',
          text: `Your OTP: ${otp}`,
          link: '#'
        }
      },
      outro: 'If you did not request this OTP, please ignore this email or contact support if you have concerns.'
    }
  };

  const emailBody = MailGenerator.generate(email);

  const message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'NAMSSN - Your OTP Verification Code',
    html: emailBody
  };

  try {
    await verifyEmailTransport();
    const sendPromise = transporter.sendMail(message);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Send timeout')), 15000)
    );
    await Promise.race([sendPromise, timeoutPromise]);
    return { success: true };
  } catch (error) {
    if (error.message === 'Send timeout') {
      console.error('[emailService] OTP send timed out after 15s');
      throw new Error('Email service timeout. Please try again.');
    }
    console.error('[emailService] OTP send failed:', error.message, error.code || '');
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Send password reset confirmation email
 * @param {string} userEmail - The recipient's email address
 * @param {string} username - The recipient's username
 * @returns {Promise} - Resolves on success, rejects on failure
 */
export const sendPasswordResetConfirmation = async (userEmail, username) => {
  const email = {
    body: {
      name: username,
      intro: 'Your password has been successfully reset.',
      outro: 'If you did not make this change, please contact support immediately.'
    }
  };

  const emailBody = MailGenerator.generate(email);

  const message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'NAMSSN - Password Reset Confirmation',
    html: emailBody
  };

  try {
    await verifyEmailTransport();
    const sendPromise = transporter.sendMail(message);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Send timeout')), 15000)
    );
    await Promise.race([sendPromise, timeoutPromise]);
    return { success: true };
  } catch (error) {
    if (error.message === 'Send timeout') {
      console.error('[emailService] Password reset confirmation timed out after 15s');
    } else {
      console.error('[emailService] Password reset confirmation failed:', error.message);
    }
    return { success: false };
  }
};
