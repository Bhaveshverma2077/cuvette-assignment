import formData from "form-data";
import Mailgun from "mailgun.js";
import twilio from "twilio";

let mg = null;
let mailgun = null;
let twilioClient = null;
let twilioSenderNumber = null;

// there were some issues accessing env
// variable in this file so i am accessing like this currently
// this is a temporary solution
setTimeout(() => {
  mailgun = new Mailgun(formData);

  mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
  });

  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  twilioClient = twilio(accountSid, authToken);
  twilioSenderNumber = process.env.TWILIO_SENDER_NUMBER;
}, 1600);

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `Excited User <${process.env.MAILGUN_EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  return mg.messages
    .create(process.env.MAILGUN_DOMAIN, mailOptions)
    .then((msg) => console.log(msg))
    .catch((err) => console.log(JSON.stringify(err)));
};

const sendSMS = async (to, text) => {
  return twilioClient.messages.create({
    from: twilioSenderNumber,
    body: text,
    to,
  });
};

export { sendEmail, sendSMS };
