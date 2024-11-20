import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { MAIL_USER , MAIL_PASS, DEBUG, LOGGER} from './env';


const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
  requireTLS: true,
  logger: LOGGER, // Enable logging
  debug: DEBUG,  // Enable debug output
});


// Sending mail function
const send = async ({
  to,
  subject,
  content,
}: {
  to: string | string[];
  subject: string;
  content: string;
}): Promise<any> => {
  console.log("Sending email...");
  
  try {
    const info = await transporter.sendMail({
      from: MAIL_USER,
      to,
      subject,
      html: content,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error; // Propagate error for further handling
  }
};

// Template rendering function
const render = async (template: string, data: any): Promise<string> => {
  console.log("Rendering template...");
  
  const content = await ejs.renderFile(
    path.join(__dirname, `templates/${template}.ejs`),
    data
  );

  return content as string;
};  

// Function to send a registration email
const sendRegisterMail = async (to: string | string[], subject: string, data: any) => {
  try {
    const content = await render("register_success", data);
    await send({ to, subject, content });
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
};

// Function to send an invoice email
const sendInvoiceMail = async (to: string | string[], subject: string, data: any) => {
  try {
    const content = await render("invoice", data);
    await send({ to, subject, content });
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};

export default { sendInvoiceMail, sendRegisterMail };
