import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Ensure the admin's email and password are set in environment variables
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_SMTP_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Admin email or password not configured in environment variables.');
      return NextResponse.json({ message: 'Failed to send email: Admin credentials missing' }, { status: 500 });
    }

    // Create a transporter using your email service configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: adminEmail, // Admin's email
        pass: adminPassword, // Admin's password
      },
    });

    // Email message options
    const mailOptions = {
      from: adminEmail, // Admin's email
      to: email,
      subject: 'Registration Approved',
      html: `<p>Dear ${name},</p><p>Your registration has been approved by the admin.</p>`,
    };

    // Log the email options for debugging
    console.log('Sending email with options:', mailOptions);

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
