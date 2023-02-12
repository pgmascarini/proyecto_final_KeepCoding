import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SEND_GRID_API_KEY);

const sendEmail = ({ to, from, subject, text, html }) => {
    const message = { to, from, subject, text, html };
    return sendgrid.send(message);
}

export default sendEmail;