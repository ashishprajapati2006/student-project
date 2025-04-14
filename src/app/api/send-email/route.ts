import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Create a transporter using your email service configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: 'ashish2772006@gmail.com',
        pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
      },
    });

    // Email message options
    const mailOptions = {
      from: 'ashish2772006@gmail.com',
      to: email,
      subject: 'Registration Approved',
      html: `<p>Dear ${name},</p><p>Your registration has been approved by the admin.</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
