import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  jobId: mongoose.Types.ObjectId;
  bidId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "in_progress" | "completed" | "cancelled" | "refunded";
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  paidAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    bidId: { type: Schema.Types.ObjectId, ref: "Bid", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "in_progress", "completed", "cancelled", "refunded"],
      default: "pending"
    },
    stripePaymentIntentId: { type: String },
    stripeSessionId: { type: String },
    paidAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
