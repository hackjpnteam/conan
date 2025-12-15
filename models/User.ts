import mongoose, { Schema, Document, Model } from "mongoose";

// スーパーアドミンのメールアドレス
export const SUPERADMIN_EMAILS = [
  "tomura@hackjpn.com",
  "tomtysmile5017@gmail.com"
];

export interface IUser extends Document {
  email: string;
  password: string;
  userType: "client" | "agency";
  role: "user" | "superadmin";
  phone: string;
  // Client fields
  name?: string;
  isAnonymous?: boolean;
  // Agency fields
  licenseNumber?: string;
  companyName?: string;
  contactPerson?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["client", "agency"], required: true },
  role: { type: String, enum: ["user", "superadmin"], default: "user" },
  phone: { type: String, required: true },
  // Client fields
  name: { type: String },
  isAnonymous: { type: Boolean, default: false },
  // Agency fields
  licenseNumber: { type: String },
  companyName: { type: String },
  contactPerson: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
