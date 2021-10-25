import { Router } from "express";
import validate from "@middlewares/validate.middleware";
import chatValidator from "@validators/chat.validator";
import chatController from "@controllers/chat.controller";
import catchAsync from "@middlewares/catchAsync.middleware";

const router: Router = Router();

router
  .route("/")
  .get(validate(chatValidator.get), catchAsync(chatController.get))
  .post(validate(chatValidator.create), catchAsync(chatController.create));
router.route("/list").get(catchAsync(chatController.list));

export default router;
