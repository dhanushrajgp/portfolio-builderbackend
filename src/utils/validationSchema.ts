import * as yup from "yup";
import { isValidObjectId } from "mongoose";

export const CreateUserSchema = yup.object().shape(
    {
        name:yup.string().trim().required("Name is missing!").min(3,"Name is Too Short!").max(20,"Name is too long"),
        email:yup.string().required("Email is Missing!").email("Invalid email"),
        password:yup.string().required("Password is missing!").min(8,"Password is too short!").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,"Password is too simple!")

    }
)

export const TokenAndIDValidation = yup.object().shape(
    {
        token:yup.string().trim().required("Invalid Token!"),
        userId:yup.string().transform(function(value){
            if(this.isType(value) && isValidObjectId(value)){
                return value
            }
            return ""
        }).required("Invalid UserId!")
    }
)




