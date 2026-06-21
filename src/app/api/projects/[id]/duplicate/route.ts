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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = verifyToken(request);
  if (!isAuthSuccess(authResult)) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const auth = authResult;

  try {
    await dbConnect();

    const original = await Project.findById(params.id);
    if (!original) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const userId = auth.userId;
    const isOwner = original.owner.toString() === userId;
    const isCollaborator = original.collaborators?.some(
      (c) => c.userId.toString() === userId
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const duplicate = await Project.create({
      title: `${original.title} (Copy)`,
      description: original.description,
      programmingLanguage: original.programmingLanguage,
      visibility: "private",
      owner: auth.userId,
      collaborators: [
        { userId: auth.userId, role: "owner", joinedAt: new Date() },
      ],
      code: original.code || "// your code...",
    });

    return NextResponse.json(
      { success: true, data: duplicate },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error duplicating project:", err);
    return NextResponse.json(
      { success: false, error: "Failed to duplicate project" },
      { status: 500 }
    );
  }
}
