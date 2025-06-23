"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Kelas,
  createKelasSchema,
  joinClassSchema,
  updateKelasSchema,
} from "@/api/schemas/kelas.schema";
import {
  createClass,
  deleteClass,
  getAllClass,
  joinClass,
  updateClass,
} from "@/api/services/kelas.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserStore } from "@/providers/user.provider";
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
import Link from "next/link";

interface CreateClassModalProps {
  setClasses: Dispatch<SetStateAction<Kelas[]>>;
}

function CreateClassModal({ setClasses }: CreateClassModalProps) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof createKelasSchema>>({
    resolver: zodResolver(createKelasSchema),
    defaultValues: { name: "" },
  });

  async function handleSubmit(values: z.output<typeof createKelasSchema>) {
    try {
      const response = await createClass(values);
      if (response.ok) {
        const createdClass = await response.json();
        form.reset();
        setClasses((classes) => [...classes, createdClass]);
        setOpen(false);
        toast("Class has been added successfully");
      } else {
        throw new Error("Response not ok");
      }
    } catch (error) {
      toast.error("There is an error while trying to create class");
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Create a Class <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>
            Create a class for your students
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Engineering Class year 2025"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your class name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-fit hover:cursor-pointer">
                  Create Class
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface UpdateClassModalProps {
  kelas: Kelas;
  setClasses: Dispatch<SetStateAction<Kelas[]>>;
}

function UpdateClassModal({ kelas, setClasses }: UpdateClassModalProps) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateKelasSchema>>({
    resolver: zodResolver(updateKelasSchema),
    defaultValues: { name: kelas.name },
  });

  async function handleSubmit(values: z.output<typeof updateKelasSchema>) {
    try {
      const response = await updateClass(kelas.id, values);
      if (response.ok) {
        const updatedClass = await response.json();
        form.reset();
        setClasses((classes) =>
          classes.map((cls) => {
            if (cls.id !== kelas.id) return cls;
            return {
              ...cls,
              ...updatedClass,
            };
          }),
        );
        setOpen(false);
        toast("Class has been updated successfully");
      } else {
        throw new Error("Response not ok");
      }
    } catch (error) {
      toast.error("There is an error while trying to update class");
      console.log(error);
    }
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
          <DialogTitle>Update {kelas.name}</DialogTitle>
          <DialogDescription>Update {kelas.name} class</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Engineering Class year 2025"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your class name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-fit hover:cursor-pointer">
                  Update Class
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface JoinClassModalProps {
  setClasses: Dispatch<SetStateAction<Kelas[]>>;
}

function JoinClassModal({ setClasses }: JoinClassModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { profile } = useUserStore((state) => state);

  const form = useForm<z.infer<typeof joinClassSchema>>({
    resolver: zodResolver(joinClassSchema),
    defaultValues: { classId: "" },
  });

  async function handleSubmit(values: z.output<typeof joinClassSchema>) {
    try {
      const response = await joinClass(values, profile.student?.id || 0);
      if (response.ok) {
        const joinedClass = await response.json();
        form.reset();
        setClasses((classes) => [...classes, joinedClass]);
        setOpen(false);
        toast("Class has been joined successfully");
      } else {
        throw new Error("Response not ok");
      }
    } catch (error) {
      toast.error("There is an error while trying to join class");
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Join a Class <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Join Class</DialogTitle>
          <DialogDescription>
            Join a class made by your professor
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Code</FormLabel>
                    <FormControl>
                      <Input placeholder="5" {...field} />
                    </FormControl>
                    <FormDescription>This is the class code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-fit hover:cursor-pointer">
                  Join Class
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface ClassCardProps {
  kelas: Kelas;
  setClasses: Dispatch<SetStateAction<Kelas[]>>;
}

function ClassCard({ kelas, setClasses }: ClassCardProps) {
  const { profile } = useUserStore((state) => state);

  async function handleDelete() {
    try {
      await deleteClass(kelas.id);
      setClasses((classes) => classes.filter((cls) => cls.id !== kelas.id));
      toast(`Class ${kelas.name} has been deleted`);
    } catch (error) {
      toast.error("There is an error while trying to delete class");
      console.log(error);
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center">
        <h2 className="text-lg font-bold md:text-xl">{kelas.name}</h2>
        <div className="flex flex-1 justify-end gap-2">
          {profile.isProfessor && (
            <>
              <UpdateClassModal kelas={kelas} setClasses={setClasses} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="destructive">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete {kelas.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete the class. All data will be lost
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
          <Button>
            <Link href={`/dashboard/classes/${kelas.id}`}>Enter Class</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [classes, setClasses] = useState<Kelas[]>([]);
  const { profile, isInitialized } = useUserStore((state) => state);

  useEffect(() => {
    async function fetchClass() {
      const response = await getAllClass(
        profile.isProfessor ? "professor" : "student",
      );
      if (response.ok) {
        const classes = await response.json();
        setClasses(classes);
      } else {
        toast.error("There is an error while trying to fetch classes");
      }
    }

    if (isInitialized) {
      fetchClass();
    }
  }, [profile, isInitialized]);

  return (
    <div className="space-y-2 md:space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Class</CardTitle>
          <CardDescription>Manage your class</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex justify-end space-y-2 md:space-y-4">
          {profile.isProfessor ? (
            <CreateClassModal setClasses={setClasses} />
          ) : (
            <JoinClassModal setClasses={setClasses} />
          )}
        </CardContent>
      </Card>
      {classes.map((kelas, idx) => (
        <ClassCard
          key={`class-${kelas.name}-${idx}`}
          kelas={kelas}
          setClasses={setClasses}
        />
      ))}
    </div>
  );
}
