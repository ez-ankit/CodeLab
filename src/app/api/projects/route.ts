import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import Project from "@/src/lib/models/project";
import { verifyToken } from "@/src/lib/middleware/auth";
import type { AuthSuccess } from "@/src/lib/middleware/auth";

function isAuthSuccess(
  auth: ReturnType<typeof verifyToken>
): auth is AuthSuccess {
  return "userId" in auth;
}

export async function GET(request: NextRequest) {
  const authResult = verifyToken(request);
  if (!isAuthSuccess(authResult)) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const auth = authResult;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const archived = searchParams.get("archived");

    const query: Record<string, unknown> = {
      $or: [
        { owner: auth.userId },
        { "collaborators.userId": auth.userId },
      ],
    };

    if (archived === "true") query.archived = true;
    else if (archived !== "all") query.archived = false;

    if (search) {
      query.$text = { $search: search };
    }

    const projects = await Project.find(query)
      .populate("owner", "username email avatar")
      .populate("collaborators.userId", "username email avatar")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = verifyToken(request);
  const isAuthenticated = isAuthSuccess(authResult);
  const auth = isAuthenticated ? (authResult as AuthSuccess) : null;

  try {
    await dbConnect();

    const body = await request.json();
    const { title, description, programmingLanguage, visibility } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      title: title.trim(),
      description: description?.trim() || "",
      programmingLanguage: programmingLanguage || "javascript",
      visibility: visibility || "private",
      owner: auth?.userId || null,
      ...(auth
        ? {
            collaborators: [
              { userId: auth.userId, role: "owner", joinedAt: new Date() },
            ],
          }
        : {}),
      code: "// your code...",
    });

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating project:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
