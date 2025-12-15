import mongoose, { Schema, Model } from "mongoose";

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  bidId: mongoose.Types.ObjectId;
  senderType: "client" | "agency";
  content: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  bidId: { type: Schema.Types.ObjectId, ref: "Bid", required: true },
  senderType: { type: String, enum: ["client", "agency"], required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export type MessageType = {
  _id: string;
  jobId: string;
  bidId: string;
  senderType: "client" | "agency";
  content: string;
  read: boolean;
  createdAt: string;
};

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
