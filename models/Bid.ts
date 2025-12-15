import mongoose, { Schema, Model } from "mongoose";

export interface IBid {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  agencyName: string;
  licenseNumber: string;
  quote: number;
  days: number;
  proposal: string;
  contactEmail: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const BidSchema = new Schema<IBid>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // 入札者
  agencyName: { type: String, required: true },
  licenseNumber: { type: String, required: true }, // 探偵業届出番号
  quote: { type: Number, required: true },
  days: { type: Number, required: true },
  proposal: { type: String, required: true },
  contactEmail: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export type BidType = {
  _id: string;
  jobId: string;
  agencyName: string;
  licenseNumber: string;
  quote: number;
  days: number;
  proposal: string;
  contactEmail: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

const Bid: Model<IBid> = mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema);
export default Bid;