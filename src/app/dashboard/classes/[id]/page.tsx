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
  Eye,
  Hourglass,
  NotebookText,
  Pencil,
  PencilLine,
  Plus,
  Trash,
  Upload,
  X,
} from "lucide-react";
import {
  createPostSchema,
  Post,
  postSchema,
  updatePostSchema,
} from "@/api/schemas/post.schema";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/api/services/post.service";
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
  Assignment,
  assignmentSchema,
  createAssignmentSchema,
} from "@/api/schemas/assignment.schema";
import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
} from "@/api/services/assignment.service";
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
import { useUserStore } from "@/providers/user.provider";
import Link from "next/link";
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

function CreatePostModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { kelas, updateKelas } = useKelasStore((state) => state);

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", description: "", attachments: [] },
  });

  async function handleSubmit(values: z.output<typeof createPostSchema>) {
    async function handler() {
      try {
        const uploadedFiles: { url: string; name: string }[] = [];
        for (const fl of files) {
          const fileResponse = await uploadFile(fl);
          const fileMetadata = await fileResponse.json();
          uploadedFiles.push({
            name: fl.name,
            url: fileMetadata.data.downloadPage,
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
          form.reset();
        } else {
          throw new Error("Response not ok");
        }
      } catch (error) {
        console.log(error);
      }
    }

    toast.promise(handler, {
      loading: "Creating post...",
      success: `${values.title} has been posted`,
      error: "There is an error while trying to create post",
    });
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
    async function handler() {
      try {
        const uploadedFiles: { url: string; name: string }[] = [];
        for (const fl of files) {
          const fileResponse = await uploadFile(fl);
          const fileMetadata = await fileResponse.json();
          uploadedFiles.push({
            name: fl.name,
            url: fileMetadata.data.downloadPage,
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
          form.reset();
        } else {
          throw new Error("Response not ok");
        }
      } catch (error) {
        console.log(error);
      }
    }

    toast.promise(handler, {
      loading: "Creating assignment...",
      success: `${values.title} has been posted`,
      error: "There is an error while trying to create assignment",
    });
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

interface UpdatePostModalProps {
  post: Post;
}

function UpdatePostModal({ post }: UpdatePostModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>(
    post.attachments?.map(
      (attachment) => new File([""], attachment.name, { type: "text/plain" }),
    ) ?? [],
  );
  const { kelas, updateKelas } = useKelasStore((state) => state);

  const form = useForm<z.infer<typeof updatePostSchema>>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      attachments: post.attachments ?? [],
    },
  });

  async function handleSubmit(values: z.output<typeof updatePostSchema>) {
    async function handler() {
      try {
        const uploadedFiles: { url: string; name: string }[] = [];
        for (const fl of files) {
          const exists = post.attachments?.some(
            (attachment) => attachment.name === fl.name,
          );
          if (exists) continue;

          const fileResponse = await uploadFile(fl);
          const fileMetadata = await fileResponse.json();

          console.log(fileMetadata.data.downloadPage);

          uploadedFiles.push({
            name: fl.name,
            url: fileMetadata.data.downloadPage,
          });
        }

        const response = await updatePost(post.id, kelas.id, {
          ...values,
          attachments: uploadedFiles,
        });
        if (response.ok) {
          const updatedPost = postSchema.parse(await response.json());
          updateKelas({
            ...kelas,
            post: kelas.post?.map((pst) => {
              if (pst.id !== post.id) {
                return pst;
              } else {
                return updatedPost;
              }
            }),
          });
          setOpen(false);
          form.reset();
        } else {
          throw new Error("Response not ok");
        }
      } catch (error) {
        console.log(error);
      }
    }

    toast.promise(handler, {
      loading: "Updating post...",
      success: `${values.title} has been updated`,
      error: "There is an error while trying to update post",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Update Post</DialogTitle>
          <DialogDescription>Update a post</DialogDescription>
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

interface UpdateAssignmentModalProps {
  assignment: Assignment;
}

function UpdateAssignmentModal({ assignment }: UpdateAssignmentModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>(
    assignment.attachments?.map(
      (attachment) => new File([""], attachment.name, { type: "text/plain" }),
    ) ?? [],
  );
  const { kelas, updateKelas } = useKelasStore((state) => state);

  const form = useForm<z.infer<typeof createAssignmentSchema>>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline,
      attachments: assignment.attachments ?? [],
    },
  });

  async function handleSubmit(values: z.output<typeof createAssignmentSchema>) {
    async function handler() {
      try {
        const uploadedFiles: { url: string; name: string }[] = [];
        for (const fl of files) {
          const exists = assignment.attachments?.some(
            (attachment) => attachment.name === fl.name,
          );
          if (exists) continue;

          const fileResponse = await uploadFile(fl);
          const fileMetadata = await fileResponse.json();
          uploadedFiles.push({
            name: fl.name,
            url: fileMetadata.data.downloadPage,
          });
        }

        const response = await updateAssignment(assignment.id, kelas.id, {
          ...values,
          attachments: uploadedFiles,
        });

        if (response.ok) {
          const updatedAssignment = assignmentSchema.parse(
            await response.json(),
          );

          setOpen(false);
          updateKelas({
            ...kelas,
            assignment: kelas.assignment?.map((asg) => {
              if (asg.id !== assignment.id) {
                return asg;
              } else {
                return updatedAssignment;
              }
            }),
          });
          form.reset();
        } else {
          throw new Error("Response not ok");
        }
      } catch (error) {
        console.log(error);
      }
    }

    toast.promise(handler, {
      loading: "Updating assignment...",
      success: `Assignment has been updated`,
      error: "There is an error while trying to update assignment",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Update Assignment</DialogTitle>
          <DialogDescription>Update an assignment</DialogDescription>
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
                  Update Assignment
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
  const { profile } = useUserStore((state) => state);
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

  function onCopyClassCode() {
    navigator.clipboard.writeText(kelas.id.toString());
    toast("Class code has been copied");
  }

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
                  {kelas?.student?.map((student, idx) => (
                    <div key={`${student.profile?.name}-${idx}`}>
                      {student.profile?.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 space-y-2 md:space-y-4">
          {profile.isProfessor && (
            <Card>
              <CardContent className="flex justify-end gap-2 md:gap-4">
                <Button onClick={onCopyClassCode}>
                  Copy Class Code <Copy />
                </Button>
                <CreatePostModal />
                <CreateAssignmentModal />
              </CardContent>
            </Card>
          )}
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
                const deadline = content.deadline.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                async function handleDelete() {
                  async function handler() {
                    try {
                      const response = await deleteAssignment(
                        content.id,
                        kelas.id,
                      );
                      if (response.ok) {
                        updateKelas({
                          ...kelas,
                          assignment: kelas.assignment?.filter((assignment) => {
                            return assignment.id !== content.id;
                          }),
                        });
                      } else {
                        throw new Error(
                          "There is an error while trying to delete assignment",
                        );
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }

                  toast.promise(handler, {
                    loading: "Deleting assignment...",
                    success: "Assignment has been deleted",
                    error:
                      "There is an error while trying to delete assignment",
                  });
                }

                return (
                  <Card key={`assignment-${content.title}-${idx}`}>
                    <CardHeader className="flex items-center gap-1 md:gap-2">
                      <PencilLine className="size-5" />
                      <div>
                        <CardTitle>{content.title}</CardTitle>
                        <CardDescription>{content.description}</CardDescription>
                      </div>
                      <div className="flex-1" />
                      {profile.isProfessor && (
                        <>
                          <UpdateAssignmentModal assignment={content} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="destructive">
                                <Trash />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this
                                  assignment?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will delete the assignment. All
                                  data will be lost
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}

                      <Button asChild size="icon">
                        <Link
                          href={`/dashboard/classes/${kelas.id}/assignments/${content.id}`}
                        >
                          <Eye />
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex items-center gap-1">
                        <Clock className="text-muted-foreground size-3" />
                        <small className="text-muted-foreground text-xs">
                          {formatted}
                        </small>
                        <Hourglass className="text-muted-foreground ml-4 size-3" />
                        <small className="text-muted-foreground text-xs">
                          {deadline}
                        </small>
                      </div>
                    </CardFooter>
                  </Card>
                );
              } else {
                async function handleDelete() {
                  async function handler() {
                    try {
                      const response = await deletePost(content.id, kelas.id);
                      if (response.ok) {
                        updateKelas({
                          ...kelas,
                          post: kelas.post?.filter((post) => {
                            return post.id !== content.id;
                          }),
                        });
                      } else {
                        throw new Error(
                          "There is an error while trying to delete post",
                        );
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }

                  toast.promise(handler, {
                    loading: "Deleting post...",
                    success: "Post has been deleted",
                    error: "There is an error while trying to delete post",
                  });
                }

                return (
                  <Card key={`post-${content.title}-${idx}`}>
                    <CardHeader className="flex items-center gap-1 md:gap-2">
                      <NotebookText className="size-5" />
                      <div>
                        <CardTitle>{content.title}</CardTitle>
                        <CardDescription>{content.description}</CardDescription>
                      </div>
                      <div className="flex-1" />
                      {profile.isProfessor && (
                        <>
                          <UpdatePostModal post={content} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="destructive">
                                <Trash />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this post?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will delete the post. All data
                                  will be lost
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}

                      <Button asChild>
                        <Link
                          href={`/dashboard/classes/${kelas.id}/posts/${content.id}`}
                        >
                          <Eye />
                        </Link>
                      </Button>
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
