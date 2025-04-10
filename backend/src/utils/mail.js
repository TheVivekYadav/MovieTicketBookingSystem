import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendMail = async (options) => {

  const mailGenerator = new Mailgen({
    product: {
    theme: "default",
    name: "Mailgen",
    link: "https://mailgen.js/"
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
  const emailHtml = mailGenerator.generate(options.mailGenContent);
  
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    }
  });

  
  const mail = {
    from: 'mail.taskmanager@example.com',
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  }
  try{
  await transporter.sendMail(mail);
  }catch(e){
    console.error(e);
  }

}

export const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Intro text",
      action: {
        instructions: "To get start with our app, please click here",
        button: {
          color: "#22BC66",
          text: "verify your email",
          link: verificationUrl,
        }
      },
      outro: "This is outro"
    }
  }
}

export const forgotPasswordMailGenContent = (username, resetPassUrl) => {
  return {
    body: {
      name: username,
      intro: "Request to reset password",
      action: {
        instructions: "To change your password click here",
        button: {
          color: "#22BC66",
          text: "reset passwd",
          link: "resetPassUrl",
        }
      },
      outro: "This is outro"
    }
  }
}

export const emailConfirmationMailGenContent = (username, showDetailUrl) => {
  return {
    body:{
      name: username,
      intro: "Booking Intro",
      action: {
        instructions: "Intruction of bookings",
        button: {
          color: "#22BC66",
          text: "Details",
          link: "link to the view the details on fronted"
        }
      },
      outro: "This is outro of bookings",
    }
  }
}

/*
sendMail({
  email: user.email,
  subject: 'Aaaa',
  mailGenContent: emailVerificationMailGenContent(
    username,
    ``
  )
});

*/
