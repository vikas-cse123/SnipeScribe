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

export const sendEmail = async (to,html) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" ${process.env.EMAIL}>`,
      to,
      subject: "Hello ✔",
      html
    });
    return info;
  } catch (error) {
    console.log(error);
    console.log(`Failed to send email to ${to}`);
  }
};
