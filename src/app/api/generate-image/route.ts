import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, productName, category } = body;

    const apiKey = process.env.SEEDREAM_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SEEDREAM_KEY 环境变量未设置" },
        { status: 500 }
      );
    }

    // 构建详细的商品视频生成提示词
    const detailedPrompt = `电商产品视频，${productName}，${category}类别，现代简约风格，专业灯光，产品展示，清晰细节，高品质，时尚潮流，${prompt || ''}。适合用于电商平台展示。`;

    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "doubao-seedance-1-0-pro-250528",
        content: [
          {
            type: "text",
            text: detailedPrompt
          }
        ],
        ratio: "16:9",
        duration: 5,
        watermark: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Seedance API error:", data);
      return NextResponse.json(
        { error: data.error?.message || "视频生成失败" },
        { status: response.status }
      );
    }

    // 返回任务ID用于后续轮询
    return NextResponse.json({
      success: true,
      taskId: data.data?.task_id,
      taskStatus: data.data?.task_status || "processing",
    });
  } catch (error) {
    console.error("Seedance generation error:", error);
    return NextResponse.json(
      { error: "视频生成服务出错" },
      { status: 500 }
    );
  }
}

// 轮询视频生成状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "缺少taskId参数" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SEEDREAM_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SEEDREAM_KEY 环境变量未设置" },
        { status: 500 }
      );
    }

    const response = await fetch(`https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Seedance status check error:", data);
      return NextResponse.json(
        { error: data.error?.message || "查询失败" },
        { status: response.status }
      );
    }

    // 检查任务状态
    const taskStatus = data.data?.task_status;
    const videoUrl = data.data?.output?.video?.url;

    if (taskStatus === "succeeded" && videoUrl) {
      return NextResponse.json({
        success: true,
        taskStatus: "succeeded",
        videoUrl: videoUrl,
      });
    } else if (taskStatus === "failed") {
      return NextResponse.json({
        success: false,
        taskStatus: "failed",
        error: data.data?.error?.message || "视频生成失败",
      });
    } else {
      // 仍在处理中
      return NextResponse.json({
        success: true,
        taskStatus: taskStatus || "processing",
        progress: data.data?.progress || 0,
      });
    }
  } catch (error) {
    console.error("Seedance status check error:", error);
    return NextResponse.json(
      { error: "查询服务出错" },
      { status: 500 }
    );
  }
}