import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();


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
export const registerMail = async (req,res) => {
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
  
  console.log("Sending Mail to: ", message.to)
  // Send the email
  await transporter.sendMail(message)
  .then(() => {
    console.log("Email sent successfully!")
    return res.status(200).send({msg: 'You should receive an email from us shortly!'})
  })
  .catch(error => res.status(500).send({error}))
};

/**
 * POST /api/v1/users/contact-us
 * 
 * @desc Send a mail
 * @access Public
 * @param {Object} req - Express request object.
 */
export const contactUs = async (req, res) => {
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
};