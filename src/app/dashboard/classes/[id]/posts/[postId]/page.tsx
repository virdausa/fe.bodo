"use client";

import { Post, postSchema } from "@/api/schemas/post.schema";
import { getPost } from "@/api/services/post.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, File } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostPage() {
  const [post, setPost] = useState<Post>();
  const params = useParams();
  const { id, postId } = params;

  useEffect(() => {
    async function fetchPost() {
      const response = await getPost(Number(id), Number(postId));
      const post = postSchema.parse(await response.json());
      setPost(post);
    }

    fetchPost();
  }, [id, postId]);

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <Link
        href={`/dashboard/classes/${id}`}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="size-4" />
        <small className="text-sm">Return</small>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>{post?.title}</CardTitle>
          <CardDescription>{post?.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 md:gap-4">
          <h3 className="font-bold">Attachments</h3>
          {post?.attachments?.map((attachment, idx) => (
            <Link
              href={attachment.url}
              key={`attachment-${attachment.name}-${idx}`}
              target="_blank"
            >
              <div className="flex items-center gap-1 md:gap-2">
                <File className="size-4" />
                {attachment.name}
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
