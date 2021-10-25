import Server from "@classes/server";
import chatService from "@services/chat.service";

const emitChatSocket = async () => {
  const chats = await chatService.list().catch((err) => {
    console.log(err);
  });
  Server.socketIO.emit("message", chats);
};

export { emitChatSocket };
