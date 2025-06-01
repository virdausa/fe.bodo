"use client";

import { Assignment, assignmentSchema } from "@/api/schemas/assignment.schema";
import { Kelas, kelasSchema } from "@/api/schemas/kelas.schema";
import { submissionSchema } from "@/api/schemas/submission.schema";
import { getAssignment } from "@/api/services/assignment.service";
import { getClass } from "@/api/services/kelas.service";
import { deleteQuestionnaire } from "@/api/services/questionnaire.service";
import { createSubmission } from "@/api/services/submission.service";
import { uploadFile } from "@/api/services/upload.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useUserStore } from "@/providers/user.provider";
import { ArrowLeft, File, Upload, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AssignmentPage() {
  const [kelas, setKelas] = useState<Kelas>();
  const [assignment, setAssignment] = useState<Assignment>();
  const [submission, setSubmission] = useState<File[]>([]);
  const { profile } = useUserStore((state) => state);
  const params = useParams();
  const { id, assignmentId } = params;

  useEffect(() => {
    async function fetchAssignment() {
      const response = await getAssignment(Number(id), Number(assignmentId));
      const assignment = assignmentSchema.parse(await response.json());
      setAssignment(assignment);

      const kelasResponse = await getClass(Number(id));
      const kls = kelasSchema.parse(await kelasResponse.json());
      setKelas(kls);
    }

    fetchAssignment();
  }, [id, assignmentId]);

  async function handleSubmissionSubmit() {
    async function handler() {
      const uploadedFiles: { url: string; name: string }[] = [];
      for (const sb of submission) {
        const fileResponse = await uploadFile(sb);
        const fileMetadata = await fileResponse.json();
        uploadedFiles.push({
          name: sb.name,
          url: fileMetadata.data.downloadPage,
        });
      }

      const response = await createSubmission(
        Number(id),
        Number(assignmentId),
        { attachments: uploadedFiles },
      );

      const createdSubmission = submissionSchema.parse(await response.json());
      setAssignment({
        ...assignment!,
        submission: (assignment?.submission ?? []).concat(createdSubmission),
      });
    }
    toast.promise(handler, {
      loading: "Submitting...",
      success: "Submission has been submitted",
      error: "There is an error while submitting",
    });
  }

  async function onDelete() {
    async function handler() {
      const response = await deleteQuestionnaire(
        Number(id),
        Number(assignmentId),
        assignment?.questionnaire?.id ?? 0,
      );

      if (response.ok) {
        setAssignment((asg) => ({ ...asg!, questionnaire: null }));
      }
    }

    toast.promise(handler, {
      loading: "Deleting questionnaire",
      success: "Questionnaire has been deleted",
      error: "There is an error while trying to delete questionnaire",
    });
  }

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <Link
        href={`/dashboard/classes/${id}`}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="size-4" />
        <small className="text-sm">Return</small>
      </Link>
      <div className="flex gap-2 md:gap-4">
        <div className="flex flex-1 flex-col gap-2 md:gap-4">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{assignment?.title}</CardTitle>
              <CardDescription>{assignment?.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 md:gap-4">
              <h3 className="font-bold">Attachments</h3>
              {assignment?.attachments?.map((attachment, idx) => (
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
          <Card>
            <CardContent className="flex justify-end">
              {profile.isProfessor ? (
                assignment?.questionnaire !== null ? (
                  <div className="flex gap-2 md:gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          Delete Questionnaire
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this questionnaire?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the questionnaire and
                            all its questions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete()}>
                            Delete Questionnaire
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button disabled>Create Questionnaire</Button>
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/classes/${id}/assignments/${assignmentId}/questionnaires/create`}
                  >
                    <Button>Create Questionnaire</Button>
                  </Link>
                )
              ) : assignment?.questionnaire === null ? (
                <Button disabled>Open Questionnaire</Button>
              ) : assignment?.questionnaire?.answers?.some(
                  (ans) => ans.student?.id === profile.student?.id,
                ) ? (
                <Button disabled>Questionnaire has been submitted</Button>
              ) : (
                <Link
                  href={`/dashboard/classes/${id}/assignments/${assignmentId}/questionnaires/${assignment?.questionnaire?.id}`}
                >
                  <Button>Open Questionnaire</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
        {!profile.isProfessor && (
          <div className="flex flex-col gap-2 md:gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Submission</CardTitle>
              </CardHeader>
              <CardContent className="w-sm space-y-4">
                <FileUpload
                  value={submission}
                  onValueChange={setSubmission}
                  className="w-full"
                  multiple
                >
                  <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="text-muted-foreground size-6" />
                      </div>
                      <p className="text-sm font-medium">
                        Drag & drop files here
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Or click to browse
                      </p>
                    </div>
                    <FileUploadTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                      >
                        Browse files
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadList>
                    {submission.map((file, index) => (
                      <FileUploadItem
                        key={index}
                        value={file}
                        className="flex-col"
                      >
                        <div className="flex w-full items-center gap-2">
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            >
                              <X />
                            </Button>
                          </FileUploadItemDelete>
                        </div>
                        <FileUploadItemProgress />
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
                <Button
                  className="w-full"
                  onClick={handleSubmissionSubmit}
                  disabled={assignment?.submission?.some(
                    (sub) => sub.student?.id === profile.student?.id,
                  )}
                >
                  Submit
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Submission</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 md:gap-4">
                {assignment?.submission
                  ?.filter((sub) => sub.student?.id === profile.student?.id)
                  .map((sub) =>
                    sub.attachments?.map((attachment, idx) => (
                      <Link
                        href={attachment.url}
                        key={`submission-attachment-${attachment.name}-${idx}`}
                        target="_blank"
                      >
                        <div className="flex items-center gap-1 md:gap-2">
                          <File className="size-4" />
                          {attachment.name}
                        </div>
                      </Link>
                    )),
                  )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {profile.isProfessor && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Student&apos;s Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {kelas?.student?.map((std, idx) => {
                return (
                  <div
                    key={`student-${std.profile?.name}-${idx}`}
                    className="flex flex-col gap-1"
                  >
                    <h3 className="font-bold">{std.profile?.name}</h3>
                    {assignment?.submission?.some(
                      (sub) => sub.student?.id === std.id,
                    ) ? (
                      <div className="flex flex-col gap-2 md:gap-4">
                        {assignment?.submission
                          ?.filter((sub) => sub.student?.id === std.id)
                          .map((sub) =>
                            sub.attachments?.map((attachment, idx) => (
                              <Link
                                href={attachment.url}
                                key={`submission-attachment-${attachment.name}-${idx}`}
                                target="_blank"
                              >
                                <div className="flex items-center gap-1 md:gap-2">
                                  <File className="size-4" />
                                  {attachment.name}
                                </div>
                              </Link>
                            )),
                          )}
                      </div>
                    ) : (
                      `Currently no submission`
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Student&apos;s Questionnaire Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {kelas?.student?.map((std, idx) => {
                return (
                  <div
                    key={`student-${std.profile?.name}-${idx}`}
                    className="flex flex-col gap-1"
                  >
                    <h3 className="font-bold">{std.profile?.name}</h3>
                    {assignment?.submission?.some(
                      (sub) => sub.student?.id === std.id,
                    ) ? (
                      <div className="flex flex-col gap-2 md:gap-4">
                        {assignment?.submission
                          ?.filter((sub) => sub.student?.id === std.id)
                          .map((sub) =>
                            sub.attachments?.map((attachment, idx) => (
                              <Link
                                href={attachment.url}
                                key={`submission-attachment-${attachment.name}-${idx}`}
                                target="_blank"
                              >
                                <div className="flex items-center gap-1 md:gap-2">
                                  <File className="size-4" />
                                  {attachment.name}
                                </div>
                              </Link>
                            )),
                          )}
                      </div>
                    ) : (
                      `Currently no submission`
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
