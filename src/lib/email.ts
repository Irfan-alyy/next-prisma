import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";


const transporter = nodemailer.createTransport( new SMTPTransport({
  host: 'smtp.freesmtpservers.com',
  port: 25,
  secure: false, // No TLS for port 25// No authentication required
}));

export async function sendEmail(to: string, subject: string, text: string, from: string = '"JobBoard Team" <no-reply@jobboard.com>') {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: `<p>${text.replace(/\n/g, '<br>')}</p>`,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}