const Joi = require("joi");

module.exports = {

    saleReq: (body) => {
        const schema = Joi.object({
            itemId: Joi.string()
                .alphanum()
                .trim()
                .required(),
            qty:Joi.number()
                .min(1)
                .max(1000)
                .required(),
            payment:Joi.number()
                .valid("cash",'card','momo'),
            channel: Joi.string()
                .alphanum()
                .required()
                .min(4)
        });

        return schema.validate(body)


    },
    createItemReq: (body) => {
        const schema = Joi.object({
            itemId: Joi.string()
                .alphanum()
                .trim()
                .required(),
            itemDescription:Joi.string()
                .required()
                .trim()
                .lowercase(),
            price:Joi.number()
                .min(0)
                .required(),
            cost:Joi.number()
                .min(0)
                .required(),
            category: Joi.string()
                .trim()
                .required()
                .valid("inventory","non-inventory"),
            channel: Joi.string()
                .required()
        });

        return schema.validate(body)


    },



}

