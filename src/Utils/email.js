const nodemailer = require("nodemailer");

exports.sendEmail = async (option) => {
  // create transfer
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email options
  const emailOptions = {
    from: "cineflix@demomailtrap.com",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transport.sendMail(emailOptions);
};
