import { RequestHandler } from "express";

import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/model/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationEmail } from "#/utils/mail";
import emailverificationtoken from "#/model/emailverificationtoken";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  //verification email
  const token = generateToken();
  sendVerificationEmail(token, {
    name,
    email,
    userId: user._id.toString(),
  });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await emailverificationtoken.findOne({
    owner: userId,
  });

  if (!verificationToken) {
    return res.status(403).json({
      error: "Invalid Token!",
    });
  }
  const matched = await verificationToken?.compareToken(token);
  if (!matched) {
    return res.status(403).json({
      error: "Invalid Token!",
    });
  }

  await User.findByIdAndUpdate(userId,{
    verified:true
  });

  await emailverificationtoken.findByIdAndDelete(verificationToken._id);

  res.json({
    message:"Your email is verified."
  });

};
