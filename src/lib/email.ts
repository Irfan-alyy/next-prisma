import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.freesmtpservers.com',
  port: 25,
  secure: false, // No TLS for port 25
  auth: null, // No authentication required
});

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