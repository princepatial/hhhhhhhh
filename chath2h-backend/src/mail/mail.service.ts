import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURED === 'true',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
  }

  async send(emailData: {
    to: string,
    subject: string,
    text?: string,
    html?: string
  }) {
    try {
      const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      };

      console.log('Sending email to:', emailData.to);
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}