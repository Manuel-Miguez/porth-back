import { Router } from "express";
import ChatRoute from "@routes/chat.route";
const router: Router = Router();

router.use("/chat", ChatRoute);

export default router;
