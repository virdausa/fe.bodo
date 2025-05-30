import { Assignment } from "@/api/schemas/assignment.schema";
import { Kelas } from "@/api/schemas/kelas.schema";
import { Post } from "@/api/schemas/post.schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getKelasContent(kelas: Kelas): (Post | Assignment)[] {
  const posts = kelas.post ?? [];
  const assignments = kelas.assignment ?? [];
  const combined = [...posts, ...assignments];
  return combined.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function isAssignment(item: Post | Assignment): item is Assignment {
  return "deadline" in item && item.deadline instanceof Date;
}
