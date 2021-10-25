import { Chat, model as ChatModel } from "@models/chat.model";

const get = async (id: string): Promise<Chat> => {
  const result = await ChatModel.findById(id).catch((err) => {
    console.log(err);
    throw "There was an error making that search";
  });
  if (!result) throw "chat not found";
  return result;
};

const create = async (body: Chat): Promise<Chat> => {
  const result = await ChatModel.create(body).catch((err) => {
    throw "chat not created";
  });
  if (!result) throw "chat not created";
  return result;
};

const list = async () => {
  const results = await ChatModel.find().catch((err) => {
    console.log(err);
    throw "There was an error making that search";
  });
  return results;
};

export default { get, create, list };
