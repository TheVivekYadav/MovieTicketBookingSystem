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
  try {
    await transporter.sendMail(mail);
  } catch (e) {
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
      intro: "You have requested to reset your password.",
      action: {
        instructions: "Click the button below to reset your password. If you didn’t request this, please ignore this email.",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: resetPassUrl
        }
      },
      outro: "If you have any questions or need help, feel free to reply to this email."
    }
  };
};

export const emailConfirmationMailGenContent = (username, showDetailUrl) => {
  return {
    body: {
      name: username,
      intro: "Thank you for booking your movie ticket with us!",
      action: {
        instructions: "To view your booking details, please click the button below:",
        button: {
          color: "#22BC66",
          text: "View Booking",
          link: showDetailUrl
        }
      },
      outro: "We hope you enjoy your movie! If you have any questions, feel free to contact our support team."
    }
  };
};



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
