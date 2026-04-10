import { NextResponse } from "next/server";

export async function POST() {
  // 登出只需要客户端清除 token，这里返回成功即可
  return NextResponse.json({ success: true });
}