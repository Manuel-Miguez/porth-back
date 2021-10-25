import Joi from "joi";

const create = {
  body: Joi.object().keys({
    sender: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

const get = {
  query: Joi.object().keys({
    id: Joi.string().lowercase().required(),
  }),
};

export default {
  create,
  get,
};
