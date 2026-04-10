"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { User, Plus, Trash2, Lock, Loader2, Check, X } from "lucide-react";

interface UserInfo {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { user, token, changePassword } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 新用户表单
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  // 修改密码表单
  const [oldPassword, setOldPassword] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  // 加载用户列表
  useEffect(() => {
    loadUsers();
  }, [token]);

  const loadUsers = async () => {
    if (!token) return;

    try {
      const res = await fetch("/api/auth/users", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新用户
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAddingUser(true);

    if (!token) {
      setError("请先登录");
      setAddingUser(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "添加失败");
        return;
      }

      setSuccess("用户添加成功");
      setNewUsername("");
      setNewPassword("");
      loadUsers();

      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("网络错误");
    } finally {
      setAddingUser(false);
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("确定要删除该用户吗？")) return;

    try {
      const res = await fetch(`/api/auth/users?id=${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "删除失败");
        return;
      }

      loadUsers();
      setSuccess("用户已删除");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("网络错误");
    }
  };

  // 修改密码
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPwd !== confirmPwd) {
      setError("两次输入的密码不一致");
      return;
    }

    if (newPwd.length < 6) {
      setError("密码长度至少6位");
      return;
    }

    setChangingPwd(true);

    const success = await changePassword(oldPassword, newPwd);

    if (success) {
      setSuccess("密码修改成功，请重新登录");
      setOldPassword("");
      setNewPwd("");
      setConfirmPwd("");
    } else {
      setError("原密码错误");
    }

    setChangingPwd(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">账号管理</h1>
        <p className="text-gray-400">管理后台管理员账号</p>
      </motion.div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2">
          <X className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            管理员列表
          </h2>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{u.username}</p>
                  <p className="text-sm text-gray-500">
                    创建于 {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                {u.id === user?.id && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-sm rounded">
                    当前账号
                  </span>
                )}
                {u.id !== user?.id && (
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add User Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加管理员
          </h2>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">用户名</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">密码</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="请输入密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={addingUser}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {addingUser ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  添加中...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  添加管理员
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Change Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border border-border lg:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            修改密码
          </h2>

          <form onSubmit={handleChangePassword} className="max-w-md">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">当前密码</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="请输入当前密码"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">新密码</label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="请输入新密码"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">确认新密码</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="请再次输入新密码"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={changingPwd}
                className="w-full py-3 bg-secondary hover:bg-secondary/90 disabled:bg-secondary/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {changingPwd ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    修改中...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    修改密码
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}