import { NextFunction, Request, Response } from "express";

/**
 * Returns in a JSON the Custom Response
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode, message } = err;
  if (process.env.ENV === "develop") {
    console.log(err);
  }
  if (!statusCode) {
    statusCode = 500; //? Internal Server Error
  }
  if (!message) {
    message =
      typeof err === "string" ? err : "There was an error making your request";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ok: statusCode < 400,
    ...(process.env.ENV === "develop" && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
  return;
};

export { errorHandler };
