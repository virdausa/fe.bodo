"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/providers/user.provider";

export default function ProfilePage() {
  const { profile } = useUserStore((state) => state);

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This page contains your full profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Common Information */}
          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm font-medium">
              Full Name
            </p>
            <p className="text-lg font-semibold">{profile.name}</p>
          </div>

          {/* Role-Specific Information */}
          {profile.isProfessor ? (
            <>
              {/* Professor Details */}
              <div className="grid gap-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Role
                </p>
                <p className="text-lg font-semibold">Professor</p>
              </div>
              {profile.professor && (
                <>
                  <div className="grid gap-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Professor Number
                    </p>
                    <p className="text-lg font-semibold">
                      {profile.professor.number}
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Major
                    </p>
                    <p className="text-lg font-semibold">
                      {profile.professor.major}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Student Details */}
              <div className="grid gap-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Role
                </p>
                <p className="text-lg font-semibold">Student</p>
              </div>
              {profile.student && (
                <>
                  <div className="grid gap-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Student Number
                    </p>
                    <p className="text-lg font-semibold">
                      {profile.student.number}
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Major
                    </p>
                    <p className="text-lg font-semibold">
                      {profile.student.major}
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Class
                    </p>
                    <p className="text-lg font-semibold">
                      {profile.student.class}
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
