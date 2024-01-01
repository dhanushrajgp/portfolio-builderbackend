import passwordresettoken from "#/model/passwordresettoken";
import { RequestHandler } from "express";

export const isValidPassResetToken: RequestHandler = async (req, res,next) => {
    const { token,userId } = req.body;
  
    const resetToken =  await passwordresettoken.findOne({
      owner:userId
    })
  
    if(!resetToken) return res.status(403).json({
      error:"Unauthorized access, invalid Token!"
    })
    
    const matched = await resetToken.compareToken(token)
    
    if(!matched) return res.status(403).json({
      error:"Unauthorized access, invalid Token!"
    })
  
    next();
  };
  