import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { pick } from "@helpers/functions.helper";

/**
 * Validate data from request with a Joi Schema
 * @param schema Request's Joi Schema
 */
const validate =
  (schema: Object) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body", "file"]);
    const object = pick(req, Object.keys(validSchema));
    const stripUnknown: boolean = object && !object.file;
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" } })
      .validate(object, { stripUnknown });
    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");

      return next({
        ok: false,
        message: errorMessage,
        statusCode: 400, //? Bad Request
      });
    }

    Object.assign(req, value);
    return next();
  };
export default validate;
