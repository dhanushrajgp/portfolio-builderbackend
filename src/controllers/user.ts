import { RequestHandler } from "express";

import { CreateUser } from "#/@types/user";
import User from "#/model/user";


export const create: RequestHandler = async (req:CreateUser,res)=>{
    const {email,password,name} = req.body;
    const user = await User.create({
        name,email,password
    })
    res.status(201).json({user});
    }