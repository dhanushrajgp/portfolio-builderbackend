import * as yup from "yup";

export const CreateUserSchema = yup.object().shape(
    {
        name:yup.string().trim().required("Name is missing!").min(3,"Name is Too Short!").max(20,"Name is too long"),
        email:yup.string().required("Email is Missing!").email("Invalid email"),
        password:yup.string().required("Password is missing!").min(8,"Password is too short!").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,"Password is too simple!")

    }


)
