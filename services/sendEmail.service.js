import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendEmail = async (to) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" ${process.env.EMAIL}>`,
      to,
      subject: "Hello ✔",
      text: "Hello world?", // Plain-text version of the message
      html: "<b>Hello world?</b>", // HTML version of the message
    });
    return info;
  } catch (error) {
    console.log(error);
    console.log(`Failed to send email to ${to}`);
  }
};
