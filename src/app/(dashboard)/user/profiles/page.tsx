"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useUserStore } from "@/providers/user.provider"; 

export default function ProfilePage() {
    const user = useUserStore((state) => state);

    return (
        <Card>
        <CardHeader>
            <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
        </CardContent>
        </Card>
    );
}