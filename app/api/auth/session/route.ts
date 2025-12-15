import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const sessionData = JSON.parse(session.value);
    return NextResponse.json({ user: sessionData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "ログアウトに失敗しました" }, { status: 500 });
  }
}
