import mongoose, { Schema, Model } from "mongoose";

export interface IJob {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  area: string;
  budgetMax: number;
  desiredOutcome: string;
  description: string;
  contactEmail: string;
  userId?: mongoose.Types.ObjectId;
  status: string;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  category: { type: String, required: true }, // 浮気/ストーカー/詐欺など
  area: { type: String, required: true },     // 市区町村レベル
  budgetMax: { type: Number, required: true },
  desiredOutcome: { type: String, required: true }, // 写真/動画/接触確認など
  description: { type: String, required: true },    // 非公開情報を含む可能性
  contactEmail: { type: String, required: true },   // 非公開
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // 投稿者
  status: { type: String, default: "open" },
  createdAt: { type: Date, default: Date.now }
});

export type JobType = {
  _id: string;
  title: string;
  category: string;
  area: string;
  budgetMax: number;
  desiredOutcome: string;
  description: string;
  contactEmail: string;
  status: "open" | "closed";
  createdAt: string;
};

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;