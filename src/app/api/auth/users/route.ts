import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";
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

// 保存用户数据到文件
function saveUsers(users: any[]) {
  try {
    // 确保 data 目录存在
    const dataDir = join(process.cwd(), "data");
    require("fs").mkdirSync(dataDir, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Failed to save users:", error);
  }
}

// 初始化时加载用户数据
let users = loadUsers();

export async function GET(request: NextRequest) {
  try {
    // 验证 token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 返回用户列表（不包含密码）
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    return NextResponse.json({ users: usersWithoutPassword });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证 token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名和密码不能为空" },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
      return NextResponse.json(
        { error: "用户名已存在" },
        { status: 400 }
      );
    }

    // 创建新用户
    const newUser = {
      id: Date.now().toString(),
      username,
      password: simpleHash(password),
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users); // 持久化到文件

    // 返回新用户（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 验证 token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, oldPassword, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { error: "用户ID和新密码不能为空" },
        { status: 400 }
      );
    }

    // 查找用户
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 验证旧密码
    if (oldPassword && !verifyPassword(oldPassword, users[userIndex].password)) {
      return NextResponse.json(
        { error: "原密码错误" },
        { status: 400 }
      );
    }

    // 更新密码
    users[userIndex].password = simpleHash(password);
    saveUsers(users); // 持久化到文件

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 验证 token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "用户ID不能为空" },
        { status: 400 }
      );
    }

    // 不能删除最后一个管理员
    const adminCount = users.filter(u => u.role === "admin").length;
    const userToDelete = users.find(u => u.id === userId);

    if (adminCount <= 1 && userToDelete?.role === "admin") {
      return NextResponse.json(
        { error: "不能删除最后一个管理员" },
        { status: 400 }
      );
    }

    // 删除用户
    users = users.filter(u => u.id !== userId);
    saveUsers(users); // 持久化到文件

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}