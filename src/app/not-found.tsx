// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="flex items-center gap-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-sm">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved or deleted.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Go Back Home</Link>
      </Button>
    </main>
  );
}
