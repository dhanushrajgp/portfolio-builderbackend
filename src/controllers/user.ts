import { RequestHandler } from "express";

import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/model/user";
import { generateToken } from "#/utils/helper";
import { sendForgetPasswordLink, sendVerificationEmail } from "#/utils/mail";
import emailverificationtoken from "#/model/emailverificationtoken";
import passwordresettoken from "#/model/passwordresettoken";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  //verification email
  const token = generateToken();
  await emailverificationtoken.create({
    owner: user._id,
    token: token,
  });
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

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await emailverificationtoken.findByIdAndDelete(verificationToken._id);

  res.json({
    message: "Your email is verified.",
  });
};

export const sendReVerificationToken: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { userId } = req.body;
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid UserID" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid Request" });

  await emailverificationtoken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await emailverificationtoken.create({
    owner: userId,
    token,
  });

  sendVerificationEmail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your email" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user) return res.status(404).json({ error: "Account Not Found!" });

  const token = crypto.randomBytes(36).toString("hex");

  passwordresettoken.findOneAndDelete({
    owner: user._id,
  });

  passwordresettoken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check your registered mail" });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({
   valid:true
  })
};
