"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Clock,
  Copy,
  NotebookText,
  PencilLine,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { createPostSchema, postSchema } from "@/api/schemas/post.schema";
import { createPost } from "@/api/services/post.service";
import { getClass } from "@/api/services/kelas.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KelasStoreProvider, useKelasStore } from "@/providers/kelas.provider";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  assignmentSchema,
  createAssignmentSchema,
} from "@/api/schemas/assignment.schema";
import { createAssignment } from "@/api/services/assignment.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getKelasContent, isAssignment } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { kelasSchema } from "@/api/schemas/kelas.schema";
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
import { uploadFile } from "@/api/services/upload.service";

function CreatePostModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { kelas, updateKelas } = useKelasStore((state) => state);

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", description: "", attachments: [] },
  });

  async function handleSubmit(values: z.output<typeof createPostSchema>) {
    try {
      const uploadedFiles: { url: string; name: string }[] = [];
      for (const fl of files) {
        const fileResponse = await uploadFile(fl);
        const fileMetadata = await fileResponse.json();
        uploadedFiles.concat({
          name: fl.name,
          url: fileMetadata.downloadPage,
        });
      }

      const response = await createPost(kelas.id, {
        ...values,
        attachments: uploadedFiles,
      });
      if (response.ok) {
        const post = postSchema.parse(await response.json());
        updateKelas({ ...kelas, post: (kelas.post ?? []).concat(post) });
        setOpen(false);
        toast("Post has been added successfully");
        form.reset();
      } else {
        throw new Error("Response not ok");
      }
    } catch (error) {
      toast.error("There is an error while trying to create post");
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Create Post <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Create a post for your class</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input placeholder="New Material" {...field} />
                    </FormControl>
                    <FormDescription>This is your post title</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your post description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FileUpload
                value={files}
                onValueChange={setFiles}
                className="w-full max-w-md"
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
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Browse files
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {files.map((file, index) => (
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

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-fit hover:cursor-pointer">
                  Create Post
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreateAssignmentModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { kelas, updateKelas } = useKelasStore((state) => state);

  const form = useForm<z.infer<typeof createAssignmentSchema>>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: new Date(),
      attachments: [],
    },
  });

  async function handleSubmit(values: z.output<typeof createAssignmentSchema>) {
    try {
      const uploadedFiles: { url: string; name: string }[] = [];
      for (const fl of files) {
        const fileResponse = await uploadFile(fl);
        const fileMetadata = await fileResponse.json();
        uploadedFiles.concat({
          name: fl.name,
          url: fileMetadata.downloadPage,
        });
      }

      const response = await createAssignment(kelas.id, {
        ...values,
        attachments: uploadedFiles,
      });

      if (response.ok) {
        const assignment = assignmentSchema.parse(await response.json());

        updateKelas({
          ...kelas,
          assignment: (kelas.assignment ?? []).concat(assignment),
        });
        setOpen(false);
        toast("Assignment has been added successfully");
        form.reset();
      } else {
        throw new Error("Response not ok");
      }
    } catch (error) {
      toast.error("There is an error while trying to create assignment");
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Create Assignment <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
          <DialogDescription>
            Create an assignment for your class
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Title</FormLabel>
                    <FormControl>
                      <Input placeholder="New Assignment" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your assignment title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your assignment description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Assignment Deadline</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the assignment deadline
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FileUpload
                value={files}
                onValueChange={setFiles}
                className="w-full max-w-md"
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
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Browse files
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {files.map((file, index) => (
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

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-fit hover:cursor-pointer">
                  Create Assignment
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ClassPageDashboard() {
  const { kelas, updateKelas } = useKelasStore((state) => state);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    async function fetchClass() {
      const response = await getClass(Number(id));
      const kelas = await response.json();
      updateKelas(kelasSchema.parse(kelas));
    }

    fetchClass();
  }, [id, updateKelas]);

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{kelas?.name || "Class"}</CardTitle>
        </CardHeader>
      </Card>
      <div className="flex gap-2 md:gap-4">
        <div>
          <Card className="max-w-2xs min-w-3xs">
            <CardHeader>
              <CardTitle>Members List</CardTitle>
              <CardDescription>
                These are the members of the class
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2 md:space-y-4">
              <div>
                <h2 className="font-semibold">Professor</h2>
                <div>{kelas?.professor?.profile?.name}</div>
              </div>
              <div>
                <h2 className="font-semibold">Students</h2>
                <div className="space-y-1 md:space-y-2">
                  {kelas?.student?.map((student) => (
                    <div key={student.profile?.name}>
                      {student.profile?.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 space-y-2 md:space-y-4">
          <Card>
            <CardContent className="flex justify-end gap-2 md:gap-4">
              <Button>
                Copy Class Code <Copy />
              </Button>
              <CreatePostModal />
              <CreateAssignmentModal />
            </CardContent>
          </Card>
          <div className="space-y-2 md:space-y-4">
            {getKelasContent(kelas).map((content, idx) => {
              const formatted = content.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              if (isAssignment(content)) {
                return (
                  <Card key={`assignment-${content.title}-${idx}`}>
                    <CardHeader className="flex items-center gap-1 md:gap-2">
                      <PencilLine className="size-5" />
                      <div>
                        <CardTitle>{content.title}</CardTitle>
                        <CardDescription>{content.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex items-center gap-1">
                        <Clock className="text-muted-foreground size-3" />
                        <small className="text-muted-foreground text-xs">
                          {formatted}
                        </small>
                      </div>
                    </CardFooter>
                  </Card>
                );
              } else {
                return (
                  <Card key={`post-${content.title}-${idx}`}>
                    <CardHeader className="flex items-center gap-1 md:gap-2">
                      <NotebookText className="size-5" />
                      <div>
                        <CardTitle>{content.title}</CardTitle>
                        <CardDescription>{content.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex items-center gap-1">
                        <Clock className="text-muted-foreground size-3" />
                        <small className="text-muted-foreground text-xs">
                          {formatted}
                        </small>
                      </div>
                    </CardFooter>
                  </Card>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClassPage() {
  return (
    <KelasStoreProvider>
      <ClassPageDashboard />
    </KelasStoreProvider>
  );
}
