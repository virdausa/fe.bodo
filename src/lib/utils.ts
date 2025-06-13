import { Assignment } from "@/api/schemas/assignment.schema";
import { Kelas } from "@/api/schemas/kelas.schema";
import { Post } from "@/api/schemas/post.schema";
import { Presence } from "@/api/schemas/presence.schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getKelasContent(
  kelas: Kelas,
): (Post | Assignment | Presence)[] {
  const posts = (kelas.post ?? []).map((p) => ({ ...p, type: "post" }));
  const assignments = (kelas.assignment ?? []).map((a) => ({
    ...a,
    type: "assignment",
  }));
  // Presence doesn't have a 'date' field, so we use 'deadline' as the sort key
  const presences = (kelas.presence ?? []).map((p) => ({
    ...p,
    date: p.deadline, // Use deadline for sorting
    type: "presence",
  }));

  const allContent = [...posts, ...assignments, ...presences];

  allContent.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return allContent;
}

export function isAssignment(item: Post | Assignment): item is Assignment {
  return "deadline" in item && item.deadline instanceof Date;
}

export function isPresence(
  content: Post | Assignment | Presence,
): content is Presence {
  return "deadline" in content && !("title" in content);
}
