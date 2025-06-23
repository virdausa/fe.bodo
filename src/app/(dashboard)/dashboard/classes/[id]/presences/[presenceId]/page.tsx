"use client";

import { Kelas, kelasSchema } from "@/api/schemas/kelas.schema";
import { Presence, presenceSchema } from "@/api/schemas/presence.schema";
import { getClass } from "@/api/services/kelas.service";
import { getPresence } from "@/api/services/presence.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PresencePage() {
  const [kelas, setKelas] = useState<Kelas>();
  const [presence, setPresence] = useState<Presence>();
  const params = useParams();
  // Get classId from `id` and presenceId from `presenceId`
  const { id, presenceId } = params;

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the specific presence session (which includes who has attended)
        const presenceResponse = await getPresence(
          Number(id),
          Number(presenceId),
        );
        const presenceData = presenceSchema.parse(
          await presenceResponse.json(),
        );
        setPresence(presenceData);

        // Fetch the class to get the full list of all students enrolled
        const kelasResponse = await getClass(Number(id));
        const kls = kelasSchema.parse(await kelasResponse.json());
        setKelas(kls);
      } catch (error) {
        console.error("Failed to fetch presence or class data:", error);
      }
    }

    fetchData();
  }, [id, presenceId]);

  const totalStudents = kelas?.student?.length ?? 0;
  const presentStudents = presence?.student?.length ?? 0;

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <Link
        href={`/dashboard/classes/${id}`}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="size-4" />
        <small className="text-sm">Return to Class</small>
      </Link>

      {/* --------------------------------------------------------------------------------
          Top area: Presence session details and summary
      ---------------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Presence Session Details</CardTitle>
            <CardDescription>
              Attendance status for this session.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Clock className="text-muted-foreground size-4" />
            <span className="font-semibold">Deadline:</span>
            <span>
              {presence
                ? format(new Date(presence.deadline), "PPP p")
                : "Loading..."}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {presentStudents} / {totalStudents}
            </p>
            <p className="text-muted-foreground">Students Present</p>
          </CardContent>
        </Card>
      </div>

      {/* --------------------------------------------------------------------------------
          Main Content: A list of all students and their attendance status
      ---------------------------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {kelas?.student?.map((std, idx) => {
            // Check if this student's ID is in the presence.student array
            const isPresent = presence?.student?.some((s) => s.id === std.id);

            return (
              <div
                key={`student-${std.profile?.name}-${idx}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <h3 className="font-bold">{std.profile?.name}</h3>

                {isPresent ? (
                  <div className="flex items-center gap-2 font-semibold text-green-600">
                    <CheckCircle className="size-5" />
                    <span>Present</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 font-semibold text-red-600">
                    <XCircle className="size-5" />
                    <span>Absent</span>
                  </div>
                )}
              </div>
            );
          })}
          {totalStudents === 0 && (
            <p className="text-muted-foreground text-center">
              There are no students enrolled in this class.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
