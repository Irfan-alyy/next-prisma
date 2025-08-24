import  from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "irfanserboon562@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

export async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}