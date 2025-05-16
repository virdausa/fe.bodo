"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/providers/user.provider";

export default function DashboardPage() {
  const { profile } = useUserStore((state) => state);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Class</CardTitle>
        <CardDescription>Manage your class</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-2 md:space-y-4">
        {profile.isProfessor ? (
          <Button>Create a class</Button>
        ) : (
          <Button>Join a class</Button>
        )}
      </CardContent>
    </Card>
  );
}
