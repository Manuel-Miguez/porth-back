import mongoose, { Document, Schema } from "mongoose";
import { emitChatSocket } from "@helpers/broadcast.helper";

export interface Chat extends Document {
  sender: string;
  message: string;
}

const schema: Schema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

schema.post("save", function (next) {
  emitChatSocket();
});

const model = mongoose.model<Chat>("Chat", schema);
export { model };
