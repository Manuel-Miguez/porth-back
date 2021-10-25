import express, { Express } from "express";
import http from "http";
import mongoose, { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import socketIO from "socket.io";
import cors from "cors";

export default class Server {
  private static _instance: Server;
  private static httpServer: http.Server;
  private static app: Express;
  private static mongo: Mongoose;
  private static emulatedDB: MongoMemoryServer;
  private static io: socketIO.Server;
  public port: number;

  constructor() {
    this.port = Number(process.env.PORT) || 5050;
    this.init();
  }

  private async init() {
    // Server Set Up
    Server.app = express();
    Server.app.use(
      cors({
        origin: "*",
        credentials: false,
        optionsSuccessStatus: 201,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: true,
        maxAge: 600,
      })
    );
    // Parser JSON  request body
    Server.app.use(express.json());
    // Parser urlenconde request body
    Server.app.use(express.urlencoded({ extended: true }));

    Server.httpServer = new http.Server(Server.app);
    this.setProcessHandlers();

    // Database Set Up
    Server.mongo = mongoose;
    Server.emulatedDB = await MongoMemoryServer.create({
      instance: {
        port: 20211,
      },
    });
    this.startDB();
  }

  /**
   * Return server static instance
   */
  public static get instance(): Server {
    return this._instance || (this._instance = new this());
  }

  /**
   * Return server static instance
   */
  public static get express(): Express {
    return Server.app;
  }
  /**
   * Return mongoose static instance
   */
  public static get mongoose(): Mongoose {
    return Server.mongo;
  }

  /**
   * Return socketIO Server static instance
   */
  public static get socketIO(): socketIO.Server {
    return Server.io;
  }
  /**
   * Starts Server
   * @param callback Callback to execute after server starts
   */
  public start(callback: Function): void {
    Server.httpServer.listen(this.port, callback());
    this.setSocketConnection();
    Server.httpServer.on("error", this.onServerError);
  }

  /**
   * Close server Connection
   * @param callback Callback Function to call after close server
   */
  public close(callback?: Function): void {
    if (callback) {
      Server.httpServer.close(callback());
      return;
    }
    Server.httpServer.close();

    // disconect ODM
    Server.mongo.disconnect();

    // Removes in memory db
    Server.emulatedDB.stop();
  }

  private setSocketConnection() {
    Server.io = new socketIO.Server(Server.httpServer, {
      cors: {
        origin: "*",
        credentials: false,
        preflightContinue: true,
        maxAge: 600,
      },
      // allowEIO3: true,
      // transports: ["polling", "websocket"],
    });
  }

  private async startDB() {
    // Setting event Handlers
    Server.mongo.connection.on("connected", () => {
      console.log("Database is connected!");
    });

    // If the connection throws an error
    Server.mongo.connection.on("error", (err) => {
      console.log("Mongoose default connection error: " + err);
      throw new Error("There was an error connecting to the Database");
    });

    // When the connection is disconnected
    Server.mongo.connection.on("disconnected", () => {
      console.log("Mongoose default connection disconnected");
    });

    const uri = Server.emulatedDB.getUri();
    console.log(uri);

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: process.env.ENV === "development",
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    Server.mongo.connect(uri, options);
  }

  private onServerError(error: NodeJS.ErrnoException): void {
    console.log(error);
    if (error.syscall !== "listen") {
      throw error;
    }
  }

  private setProcessHandlers() {
    // handler for Gracefully exiting the app
    process.on("SIGINT", () => {
      console.info("Gracefully shutting down");
      console.info("Closing the MongoDB connection");
      this.close();
    });

    // handler for signal termination event
    process.on("SIGTERM", () => {
      console.info("SIGTERM recieve");
      this.close();
    });

    // handler for uncaught Exception
    process.on("uncaughtException", (error) => {
      console.error(error);
      this.exitServerHander();
    });

    // handler for uncaught Rejection
    process.on("unhandledRejection", (error) => {
      console.error(error);
      this.exitServerHander();
    });

    // handler for nodemon restart event
    process.once("SIGHUP", () => {
      this.exitServerHander();
    });
  }

  private exitServerHander() {
    this.close();
    process.exit(0);
  }
}
