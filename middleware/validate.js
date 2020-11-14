
const ExpressError = require("../utils/expressError")
const joi = require('joi')




module.exports.validateUser = (req, res, next) => {
    const userSchema = joi.object({
        user: joi.object({
            f_name: joi.string().required(),
            l_name: joi.string().required(),
            email: joi.string().required(),
            password: joi.string().required(),
        }).required()
    })

    const {error} = userSchema.validate(req.body)


    if(error) {
        const msg = error.details.map((e) => e.message).join(',')
        throw new ExpressError(msg, 400)
    
    } else {
        next();
    }


}

