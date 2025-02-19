import Joi from "joi";
import objectId from 'joi-objectid';
Joi.objectId = objectId(Joi);
export const signupValidation = {
  body: Joi.object().required().keys({
    name: Joi.string().min(3).max(20).required().messages({
      "any.required": "Send a name for the user, please",
      "string.empty": "name is required",
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(20).required(),
    phoneNumber: Joi.string().length(10).pattern(/^\d+$/).required().messages({
      "string.length": "Phone number must be exactly 10 digits",
      "string.pattern.base": "Phone number must contain only digits",
    }),
    role: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
    officeHours: Joi.string().required(),
    depId: Joi.objectId().required(),
  }),
};

  export const studentValidation = {
    body: Joi.object().required().keys({
        name: Joi.string().min(3).max(20).required().messages({
          "any.required": "Send a name for the user, please",
          "string.empty": "name is required",
        }),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(20).required(),
        phoneNumber: Joi.number().min(10).max(10).required(),
        academicYear: Joi.number().required(),
        depId:Joi.objectId().required(),
      }),
  };

  export const signInValidation = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required().messages({
          "any.required": "Send a email for the user, please",
          "string.empty": "email is required",
        }),
        password: Joi.string().min(5).max(20).required(),
      
      }),
  };