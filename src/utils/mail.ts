import nodemailer from "nodemailer";

import EmailVerificationToken from "#/model/emailverificationtoken";
import { MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL } from "#/utils/variables";
import { generateTemplate } from "#/mail/Template";
import path from "path";

export const generateMailTransport = ()=>{
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASS
        }
      });
    return transport;
}

interface Profile{
    name:string;
    email:string;
    userId:string;
}

export const sendVerificationEmail=async (token:string,profile:Profile)=>{

    const transport = generateMailTransport()
    const {name,userId,email} = profile;
    const welcomeMessage= `Hi ${name} Welcome to the Portfolio Builder. Now you can build your digital resume easily. use the given OTP to verify your email`
  
    transport.sendMail({
        to:email,
        from:VERIFICATION_EMAIL,
        subject:"Welcome message",
        html:generateTemplate({
            title:"Welcome to Portfolio-builder",
            message:welcomeMessage,
            logo:"cid:logo",
            banner:"cid:welcome",
            link:"#",
            btnTitle:token
        }),
        attachments:[
            {
                filename:"logo.png",
                path:path.join(__dirname,"../mail/logo.png"),
                cid:"logo"
            },
            {
                filename:"welcome.png",
                path:path.join(__dirname,"../mail/welcome.png"),
                cid:"welcome"
            }
        ]
    })
}
interface Options{
email:string;
link:string;
}

export const sendForgetPasswordLink=async (options:Options)=>{

    const transport = generateMailTransport()
    const {email,link} = options;
    const message = "Use the link given below to change your password."
  
    transport.sendMail({
        to:email,
        from:VERIFICATION_EMAIL,
        subject:"Reset Password Link",
        html:generateTemplate({
            title:"Forget Password",
            message,
            logo:"cid:logo",
            banner:"cid:forget_password",
            link,
            btnTitle:"Reset Password"
        }),
        attachments:[
            {
                filename:"logo.png",
                path:path.join(__dirname,"../mail/logo.png"),
                cid:"logo"
            },
            {
                filename:"forget_password.png",
                path:path.join(__dirname,"../mail/forget_password.png"),
                cid:"forget_password"
            }
        ]
    })
}