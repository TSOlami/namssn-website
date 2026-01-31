import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

// Configure nodemailer transport
const nodeconfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodeconfig);

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
    await transporter.sendMail(message);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
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
    await transporter.sendMail(message);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset confirmation:', error);
    // Don't throw here - this is a non-critical notification
    return { success: false };
  }
};
