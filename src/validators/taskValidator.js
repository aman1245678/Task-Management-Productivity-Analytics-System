import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  timeSpent: Joi.number().min(0)
});