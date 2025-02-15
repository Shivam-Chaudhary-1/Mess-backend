import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const mailSender = async (email, message, subject) => {
    try{

        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
               user: process.env.MAIL_USER,
               pass: process.env.MAIL_PASS
            },
            secure:false
        })
          

        const info = await transporter.sendMail({
            from:process.env.MAIL_USER,
            to:email,
            subject:subject,
            html:`<div>${message}</div>`
        })
        
        console.log("Mail sent: ");

        return info;

    } catch(error){
        console.log("Error in sending mail: ", error.message);
        return error;
    }
}

export default mailSender;

