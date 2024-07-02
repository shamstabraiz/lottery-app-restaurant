import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
    const user = process.env.EMAIL;
    const pass = process.env.PASS;
    const from = process.env.FROM;
    if(!user || !pass){
        console.error("Email or password not set");
        return;
    }
    if(!from){
        console.error("From email not set");
        return;
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user,
            pass: pass,
        },
    });

    const mailOptions = {
        from: from,
        to: email,
        subject: subject,
        text: text,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export { sendEmail };