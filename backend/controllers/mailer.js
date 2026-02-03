import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/userModel.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// https://ethereal.email/create
let nodeconfig = {
  service: 'gmail',
	auth: {
	  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
	  user: process.env.EMAIL,
	  pass: process.env.EMAIL_PASSWORD,
	},
};

let transporter = nodemailer.createTransport(nodeconfig); // create reusable transporter object using the default SMTP transport

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
  
  console.log("Sending Mail to: ", message.to);
  // Send the email
  await transporter.sendMail(message)
  .then(() => {
    console.log("Email sent successfully!")
    return res.status(200).send({msg: 'You should receive an email from us shortly!'})
  })
  .catch(error => res.status(500).send({error}))
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

  console.log("Sending message to admin");

  // Message object
  let msg = {
    from: email,
    to: process.env.EMAIL,
    subject: subject,
    text: message
  };

  // Send the email
  await transporter.sendMail(msg)
  .then(() => {
    console.log("Email sent successfully!")
    return res.status(200).send({msg: 'Your message has been sent successfully!'})
  })
  .catch(error => res.status(500).send({error}))
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

  const emailPromises = userEmails.map(async (userEmail) => {
    var email = {
      body: {
        intro: text || 'Welcome to NAMSSN, FUTMINNA chapter! We\'re very excited to have you on board.',
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
      }
    };

    var emailBody = await MailGenerator.generate(email);

    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: subject || 'Welcome to NAMSSN, FUTMINNA chapter!',
      html: emailBody
    };

    await transporter.sendMail(message);
  });

  await Promise.all(emailPromises);

  console.log("Emails sent successfully!");
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

  await transporter.sendMail(message);
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