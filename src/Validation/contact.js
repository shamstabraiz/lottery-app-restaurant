import joi from "joi";


export const contactSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    trophyId: joi.string().required()
}).required();