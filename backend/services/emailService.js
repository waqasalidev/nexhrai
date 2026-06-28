import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Simulated console fallback in development when credentials are missing
  return {
    sendMail: async (options) => {
      console.log(`\n========================================`);
      console.log(`[SIMULATED EMAIL]`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Text Body: ${options.text}`);
      console.log(`========================================\n`);
      return { messageId: 'simulated_mail_id' };
    }
  };
};

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"NexHR AI" <${process.env.EMAIL_USER || 'noreply@nexhr.ai'}>`,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.error(`Email send failure: ${error.message}`);
    throw new Error('Email service failed');
  }
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6d28d9; text-align: center;">Welcome to NexHR AI!</h2>
      <p>Hello ${user.name},</p>
      <p>Thank you for creating an account with NexHR AI. We are thrilled to help you automate and optimize your recruitment process using advanced AI.</p>
      <p>You have registered as a <strong>${user.role}</strong>.</p>
      <p>Log in to your dashboard to get started.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">© 2026 NexHR AI. All rights reserved.</p>
    </div>
  `;
  const text = `Welcome to NexHR AI, ${user.name}! You have successfully registered as a ${user.role}.`;
  return await sendMail({ to: user.email, subject: 'Welcome to NexHR AI!', text, html });
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6d28d9; text-align: center;">Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>You are receiving this email because you (or someone else) requested a password reset for your NexHR AI account.</p>
      <p>Please click the button below to set a new password. This link is valid for 10 minutes:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">© 2026 NexHR AI. All rights reserved.</p>
    </div>
  `;
  const text = `You requested a password reset. Please click this link to reset your password: ${resetUrl}`;
  return await sendMail({ to: user.email, subject: 'NexHR AI - Password Reset Request', text, html });
};

export const sendInterviewInvitation = async (candidate, recruiter, job, interview) => {
  const formattedDate = new Date(interview.dateTime).toLocaleString();
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6d28d9; text-align: center;">Interview Scheduled</h2>
      <p>Hello ${candidate.name},</p>
      <p>We are pleased to invite you to an interview for the <strong>${job.title}</strong> position.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
        <p style="margin: 5px 0;"><strong>Type:</strong> ${interview.type}</p>
        ${interview.link ? `<p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="${interview.link}">${interview.link}</a></p>` : ''}
        <p style="margin: 5px 0;"><strong>Organizer:</strong> ${recruiter.name}</p>
      </div>
      ${interview.notes ? `<p><strong>Recruiter Notes:</strong> ${interview.notes}</p>` : ''}
      <p>Please make sure to join on time. Good luck!</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">© 2026 NexHR AI. All rights reserved.</p>
    </div>
  `;
  const text = `Hello ${candidate.name}, you have been scheduled for an interview for ${job.title} on ${formattedDate}. Link: ${interview.link || 'N/A'}`;
  return await sendMail({ to: candidate.email, subject: `Interview Invitation: ${job.title}`, text, html });
};

export const sendApplicationUpdate = async (candidate, job, status) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6d28d9; text-align: center;">Application Status Update</h2>
      <p>Hello ${candidate.name},</p>
      <p>Your application status for the position of <strong>${job.title}</strong> has been updated.</p>
      <p>New Status: <span style="background-color: #f3e8ff; color: #6d28d9; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${status}</span></p>
      <p>Please log in to your candidate dashboard to view more details.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">© 2026 NexHR AI. All rights reserved.</p>
    </div>
  `;
  const text = `Hello ${candidate.name}, your application status for ${job.title} has been updated to ${status}.`;
  return await sendMail({ to: candidate.email, subject: `Application Status Update: ${job.title}`, text, html });
};
