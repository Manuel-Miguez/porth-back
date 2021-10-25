import "module-alias/register"; //? Create aliases of directories and register custom module
import dotenv from "dotenv";
import Server from "@classes/server";
import router from "@routes/index";
import { errorHandler } from "@middlewares/error.middleware";

const path = process.env.ENV === "develop" ? "develop.env" : ".env";
const result = dotenv.config({ path });
if (result.error) {
  throw "env file not found, if you are in production remember to use the proper .env file";
}
const server = new Server();

// all the routes
Server.express.use(router);
// handle error
Server.express.use(errorHandler);

server.start(() => {
  console.info(`Server Started! at ${process.env.PORT || 5050}`);
});
