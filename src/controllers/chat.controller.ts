import { Request, Response } from "express";
import service from "@services/chat.service";
import { Chat } from "@models/chat.model";

const get = async (req: Request, res: Response) => {
  const id: string = req.query.id as string;
  const status = 200; //? OK
  const result = await service.get(id);
  res.status(status).json({
    ok: true,
    message: result,
    statusCode: 200,
  });
  return;
};

const create = async (req: Request, res: Response) => {
  const body: Chat = req.body;
  const status = 200; //? OK
  const result = await service.create(body);
  res.status(status).json({
    ok: true,
    message: result,
    statusCode: 200,
  });
  return;
};

const list = async (req: Request, res: Response) => {
  const result = await service.list();
  const status = 200; //? OK
  res.status(status).json({
    ok: true,
    message: result,
    statusCode: status,
  });
  return;
};

export default { get, create, list };
