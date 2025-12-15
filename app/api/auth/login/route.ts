import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { SUPERADMIN_EMAILS } from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "メールアドレスとパスワードを入力してください" }, { status: 400 });
    }

    // Find user
    const user: any = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません" }, { status: 401 });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません" }, { status: 401 });
    }

    // Auto-upgrade to superadmin if email is in the list
    const isSuperAdmin = SUPERADMIN_EMAILS.includes(email.toLowerCase());
    if (isSuperAdmin && user.role !== "superadmin") {
      await User.updateOne({ _id: user._id }, { role: "superadmin" });
      user.role = "superadmin";
    }

    // Create session data
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      userType: user.userType,
      role: isSuperAdmin ? "superadmin" : (user.role || "user"),
      name: user.userType === "client" ? user.name : user.companyName,
      companyName: user.companyName,
      licenseNumber: user.licenseNumber
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json(sessionData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "ログインに失敗しました" }, { status: 500 });
  }
}
