import Joi from "joi";

export const userSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
