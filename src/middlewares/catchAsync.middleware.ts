import { NextFunction, Request, Response } from "express";

/**
 * Wrapper to handle errors in controllers
 * @param fn Middleware to wrap
 */
const catchAsync =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      let response: string = "There was an error doing that Action";
      if (err.stack) {
        if (process.env.ENV === "development") {
          response = err.stack;
        }
      } else {
        next(err);
      }
      next({
        ok: false,
        message: response,
        statusCode: 502, //? Bad gateway
      });
    });
    return;
  };
export default catchAsync;
