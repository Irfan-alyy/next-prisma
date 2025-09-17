import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const session = await auth();

  //   console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "User not logged in" },
      { status: 401 }
    );
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(
        error.message ? error.message : "Error occure during fetching user data"
      );
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  const formData = await request.formData();
  const type = formData.get("type") as string;
  const name = formData.get("name") as string | null;
  const imageFile = formData.get("image") as File | null;
  const removeImage = formData.get("removed") as string | null;
  console.log(type, name, imageFile, removeImage);
  if (!["candidate", "employer"].includes(type)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  interface UpdateData {
    name: string | undefined;
    type: string | undefined;
    image: string | null | undefined;
  }
  const updateData: UpdateData = {
    name: name?.trim() || undefined,
    type: type || undefined,
    image: undefined,
  };
  if (removeImage) {
    const imagePath = join(
      process.cwd(),
      "public",
      "profile_pictures",
      session?.user?.image?.split("/").pop() || ""
    );
    try {
      await unlink(imagePath);
      console.log("image unlinked");
      updateData.image = null;
    } catch (error: unknown) {
      console.warn("Failed to delete image file:", error);
    }
  }
  if (imageFile && imageFile.size > 0) {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (currentUser?.image) {
      const imagePath = join(
        process.cwd(),
        "public",
        "profile_pictures",
        currentUser.image.split("/").pop() || ""
      );
      try {
        await unlink(imagePath);
      } catch (error) {
        console.warn("Failed to delete image file:", error);
      }
    }
    updateData.image = undefined;
    const filePath = await saveImage(imageFile, session.user.id);
    console.log(filePath);
    updateData.image = filePath;
  }
  const user = await prisma.user.update({
    where: { id: session?.user?.id },
    data: { ...updateData },
  });
  return NextResponse.json(user);
}

const saveImage = async (file: File, userId: string) => {
  const uploadDir = join(process.cwd(), "public", "profile_pictures");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error: unknown) {
    console.warn(
      "Profile pictures directory already exists or failed to create:",
      error
    );
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `profile-${userId}-${uuidv4()}.${fileExtension}`;
  const filePath = join(uploadDir, filename);
  await writeFile(filePath, buffer);
  return `/profile_pictures/${filename}`;
};
