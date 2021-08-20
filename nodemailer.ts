import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';

export class Nodemailer {
    static otpgenerator(){
      let digits = '0123456789';
      let otp = '';
      for (let i = 0; i < 5; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
      }
      return (otp);
    }
    static createTransporter() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
            api_key: 'xxx'
            }
        }))
    }

    static sendEmail(from, to, subject, html) {
        return this.createTransporter().sendMail({from, to, subject, html});
    }
}

