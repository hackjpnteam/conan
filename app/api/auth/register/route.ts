import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { SUPERADMIN_EMAILS } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, userType, phone, name, isAnonymous, licenseNumber, companyName, contactPerson } = body;

    // Validate required fields
    if (!email || !password || !userType || !phone) {
      return NextResponse.json({ error: "必須項目が入力されていません" }, { status: 400 });
    }

    // Validate agency-specific fields
    if (userType === "agency") {
      if (!licenseNumber || !companyName || !contactPerson) {
        return NextResponse.json({ error: "探偵事務所の登録には全ての項目が必要です" }, { status: 400 });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData: any = {
      email,
      password: hashedPassword,
      userType,
      phone,
      role: SUPERADMIN_EMAILS.includes(email.toLowerCase()) ? "superadmin" : "user"
    };

    if (userType === "client") {
      userData.name = name || "匿名";
      userData.isAnonymous = isAnonymous || !name;
    } else {
      userData.licenseNumber = licenseNumber;
      userData.companyName = companyName;
      userData.contactPerson = contactPerson;
    }

    const user = await User.create(userData);

    return NextResponse.json({
      _id: user._id,
      email: user.email,
      userType: user.userType,
      role: user.role,
      name: user.name,
      companyName: user.companyName
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
