import joi from "joi";


export const trophySchema = joi.object({
    name: joi.string().required(),
    numberOfWinners: joi.number().greater(0).required().default(1) 
}).required();


