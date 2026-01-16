const nodemailer = require('nodemailer');
const { query, getClient } = require('../config/database');

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT) || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@mrcreams.com';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send email verification
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} verificationToken - Verification token
 * @returns {boolean} Success status
 */
const sendEmailVerification = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify Your MR.CREAMS Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MR.CREAMS</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Emotional Intelligence Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for joining MR.CREAMS! To complete your registration and start your journey toward better emotional intelligence and relationship health, please verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              This verification link will expire in 24 hours. If you didn't create an account with MR.CREAMS, please ignore this email.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 MR.CREAMS. All rights reserved.<br>
              This email was sent to ${email}
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email verification sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email verification:', error);
    return false;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} resetToken - Reset token
 * @returns {boolean} Success status
 */
const sendPasswordReset = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Reset Your MR.CREAMS Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">MR.CREAMS Account Security</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password for your MR.CREAMS account. If you made this request, click the button below to reset your password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 MR.CREAMS. All rights reserved.<br>
              This email was sent to ${email}
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

/**
 * Send welcome email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} userType - User type
 * @returns {boolean} Success status
 */
const sendWelcomeEmail = async (email, name, userType) => {
  try {
    const transporter = createTransporter();

    let dashboardPath = '/dashboard';
    if (userType === 'therapist') {
      dashboardPath = '/dashboards/therapist';
    } else if (['company', 'platform_admin', 'executive'].includes(userType)) {
      dashboardPath = '/dashboards/organization';
    } else if (['admin', 'super_admin', 'it_admin', 'support'].includes(userType)) {
      dashboardPath = '/dashboards/admin';
    }

    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}${dashboardPath}`;

    let contentBlocks = [];
    if (userType === 'therapist') {
      contentBlocks = [
        '<li>Verify your professional credentials</li>',
        '<li>Set up your client portal and availability</li>',
        '<li>Explore advanced analytics for your sessions</li>'
      ];
    } else if (['company', 'platform_admin', 'executive'].includes(userType)) {
      contentBlocks = [
        '<li>Connect your HR or people systems</li>',
        '<li>Invite managers and key stakeholders</li>',
        '<li>Review your organization wellness dashboards</li>'
      ];
    } else if (['admin', 'super_admin', 'it_admin', 'support'].includes(userType)) {
      contentBlocks = [
        '<li>Review default security and privacy settings</li>',
        '<li>Configure roles, permissions, and escalation paths</li>',
        '<li>Set up monitoring and alerting for your environment</li>'
      ];
    } else {
      contentBlocks = [
        '<li>Complete your emotional baseline assessment</li>',
        '<li>Explore personalized growth exercises</li>',
        '<li>Set up your first reflection session</li>'
      ];
    }

    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Welcome to MR.CREAMS - Your Journey Begins!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MR.CREAMS!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Emotional Intelligence Journey Starts Now</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #666; line-height: 1.6;">
              Welcome to MR.CREAMS! We're excited to have you join our community dedicated to improving emotional intelligence and relationship health through AI-powered insights.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                ${contentBlocks.join('')}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                Get Started
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If you have any questions or need help getting started, don't hesitate to reach out to our support team.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 MR.CREAMS. All rights reserved.<br>
              This email was sent to ${email}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

/**
 * Send MFA setup email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} mfaSecret - MFA secret
 * @returns {boolean} Success status
 */
const sendMFASetup = async (email, name, mfaSecret) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Complete Your MR.CREAMS Security Setup',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Security Setup</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Enable Two-Factor Authentication</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #666; line-height: 1.6;">
              To enhance the security of your MR.CREAMS account, we recommend enabling two-factor authentication (2FA). This adds an extra layer of protection to your account.
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #155724; margin: 0; font-size: 14px;">
                <strong>Your MFA Secret:</strong> ${mfaSecret}
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              Please use this secret to set up 2FA in your authenticator app (Google Authenticator, Authy, etc.). This secret will not be shown again for security reasons.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 MR.CREAMS. All rights reserved.<br>
              This email was sent to ${email}
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('MFA setup email sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending MFA setup email:', error);
    return false;
  }
};

/**
 * Send support ticket notification
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} ticketNumber - Ticket number
 * @param {string} title - Ticket title
 * @returns {boolean} Success status
 */
const sendSupportTicketNotification = async (email, name, ticketNumber, title) => {
  try {
    const transporter = createTransporter();
    
    const ticketUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticketNumber}`;
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: `Support Ticket Created - ${ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Support Ticket Created</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">We've received your request</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for contacting MR.CREAMS support. We've created a support ticket for your request and our team will get back to you soon.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Ticket Details</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Ticket Number:</strong> ${ticketNumber}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Subject:</strong> ${title}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> Open</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${ticketUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                View Ticket
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              You can track the progress of your ticket by clicking the button above or logging into your account.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 MR.CREAMS. All rights reserved.<br>
              This email was sent to ${email}
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Support ticket notification sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending support ticket notification:', error);
    return false;
  }
};

/**
 * Test email configuration
 * @returns {boolean} Success status
 */
const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
};

module.exports = {
  sendEmailVerification,
  sendPasswordReset,
  sendWelcomeEmail,
  sendMFASetup,
  sendSupportTicketNotification,
  testEmailConfiguration
};
