import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// 简单加密函数
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return simpleHash(password) === hashedPassword;
}

// 用户数据文件路径
const DATA_FILE = join(process.cwd(), "data", "users.json");

// 默认用户
const defaultUsers = [
  {
    id: "1",
    username: "awanawan",
    password: simpleHash("awanawan"),
    role: "admin",
    createdAt: new Date().toISOString(),
  }
];

// 从文件读取用户数据
function loadUsers() {
  try {
    if (existsSync(DATA_FILE)) {
      const data = readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load users:", error);
  }
  return defaultUsers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名和密码不能为空" },
        { status: 400 }
      );
    }

    // 从文件加载用户数据
    const users = loadUsers();

    // 验证用户
    const user = users.find((u: any) => u.username === username);

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 生成简单 token
    const token = simpleHash(`${user.id}-${Date.now()}-${Math.random()}`);

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}