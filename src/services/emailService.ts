import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";
import config from "../utils/config";
import logger from "../utils/logger";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  /**
   * Send onboarding account verification email to user
   * @param templateName
   * @param name
   * @param email
   * @param subject
   * @param otp
   */
  async sendVerificationEmail(
    templateName: string,
    subject: string,
    name: string,
    email: string,
    otp: string
  ) {
    try {
      const data = {
        userName: name,
        otp: otp,
        companyName: config.APP_NAME,
        privacyPolicyUrl: config.PRIVACY,
        contactUrl: config.CONTACT_US,
        companyWebsite: config.WEBSITE,
        logoUrl: config.LOGO_URL,
        supportEmail: config.EMAIL_FROM,
      };

      const emailHtml = await ejs.renderFile(
        path.join(__dirname, "views", `${templateName}.ejs`),
        data
      );

      const mailOptions = {
        from: `${config.APP_NAME} <${config.EMAIL_FROM}>`,
        to: email,
        subject,
        html: emailHtml,
      };

      const response = await this.transporter.sendMail(mailOptions);

      // logger.info(`Email SENT RESPONSE :::::::::== `, response);

      logger.info(
        `🎉🎉🎉🎉🎉🎉 Email Verification Email (${templateName}) sent to: ${email}`
      );
    } catch (error) {
      logger.error(
        `❌❌❌❌❌❌ Error sending email verification ${templateName} email:`,
        error
      );
    }
  }

  /**
   * Send welcome email
   * @param templateName
   * @param subject
   * @param name
   * @param email
   */
  async sendWelcomeEmail(
    templateName: string,
    subject: string,
    name: string,
    email: string
  ) {
    try {
      const data = {
        userName: name,
        companyName: config.APP_NAME,
        privacyPolicyUrl: config.PRIVACY,
        contactUrl: config.CONTACT_US,
        companyWebsite: config.WEBSITE,
        logoUrl: config.LOGO_URL,
        supportEmail: config.EMAIL_FROM,
      };

      const emailHtml = await ejs.renderFile(
        path.join(__dirname, "views", `${templateName}.ejs`),
        data
      );

      const mailOptions = {
        from: `${config.APP_NAME} <${config.EMAIL_FROM}>`,
        to: email,
        subject,
        html: emailHtml,
      };

      await this.transporter.sendMail(mailOptions);

      logger.info(
        `🎉🎉🎉🎉🎉🎉 Welcome Email (${templateName}) sent to: ${email}`
      );
    } catch (error) {
      logger.error(
        `❌❌❌❌❌❌  Error sending welcome ${templateName} email:`,
        error
      );
    }
  }

  /**
   * Send onboarding account verification email to user
   * @param templateName
   * @param name
   * @param email
   * @param subject
   * @param otp
   */
  async sendPasswordResetEmail(
    templateName: string,
    subject: string,
    name: string,
    email: string,
    otp: string
  ) {
    try {
      const data = {
        userName: name,
        otp: otp,
        companyName: config.APP_NAME,
        privacyPolicyUrl: config.PRIVACY,
        contactUrl: config.CONTACT_US,
        companyWebsite: config.WEBSITE,
        logoUrl: config.LOGO_URL,
        supportEmail: config.EMAIL_FROM,
      };

      const emailHtml = await ejs.renderFile(
        path.join(__dirname, "views", `${templateName}.ejs`),
        data
      );

      const mailOptions = {
        from: `${config.APP_NAME} <${config.EMAIL_FROM}>`,
        to: email,
        subject,
        html: emailHtml,
      };

      await this.transporter.sendMail(mailOptions);

      logger.info(
        `🎉🎉🎉🎉🎉🎉 Password Reset Email (${templateName}) sent to: ${email}`
      );
    } catch (error) {
      logger.error(
        `❌❌❌❌❌❌ Error sending password reset ${templateName} email:`,
        error
      );
    }
  }

  /**
   * Send password changed email
   * @param templateName
   * @param subject
   * @param name
   * @param email
   * @param changeDate
   */
  async sendPasswordChangedEmail(
    templateName: string,
    subject: string,
    name: string,
    email: string,
    changeDate: string
  ) {
    try {
      const data = {
        userName: name,
        changeDate: changeDate,
        companyName: config.APP_NAME,
        privacyPolicyUrl: config.PRIVACY,
        contactUrl: config.CONTACT_US,
        companyWebsite: config.WEBSITE,
        logoUrl: config.LOGO_URL,
        supportEmail: config.EMAIL_FROM,
      };

      const emailHtml = await ejs.renderFile(
        path.join(__dirname, "views", `${templateName}.ejs`),
        data
      );

      const mailOptions = {
        from: `${config.APP_NAME} <${config.EMAIL_FROM}>`,
        to: email,
        subject,
        html: emailHtml,
      };

      await this.transporter.sendMail(mailOptions);

      logger.info(
        `🎉🎉🎉🎉🎉🎉 Password Changed Email (${templateName}) sent to: ${email}`
      );
    } catch (error) {
      logger.error(
        `❌❌❌❌❌❌  Error sending password changed ${templateName} email:`,
        error
      );
    }
  }
}

export const emailService = new EmailService();
