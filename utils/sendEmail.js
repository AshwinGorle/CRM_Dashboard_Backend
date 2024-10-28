import dotenv from 'dotenv'

dotenv.config();
import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
    service : 'gmail',
    host : process.env.EMAIL_HOST,
    PORT : process.env.EMAIL_PORT,
    secure : false,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
})

const sendEmail = async (email, subject, description)=>{
    console.log("sending email .....", email);
    console.log("env email .....", process.env.EMAIL_FROM);
    
    try{
    let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email.to,
        subject: email.subject ,
        html: email.html,
      });
    }catch(err){
        throw err;
    }
 }

 export default sendEmail;