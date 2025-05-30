"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createStudentSchema } from "@/api/schemas/student.schema";
import { createStudent } from "@/api/services/student.service";

export default function StudentOnboardingPage() {
  const form = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof createStudentSchema>) {
    try {
      const response = await createStudent(values);
      await response.json();
      if (response.ok) {
        toast("Student profile has been created successfully");
        return router.push("/dashboard");
      } else {
        throw new Error(
          "There is an error while trying to create student profile",
        );
      }
    } catch (error) {
      toast.error("There is an error while creating your profile");
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Create Student Profile</h1>
            <p className="text-muted-foreground text-balance">
              Let us know more about you
            </p>
          </div>

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Number</FormLabel>
                <FormControl>
                  <Input placeholder="24250200261" {...field} />
                </FormControl>
                <FormDescription>This is your student number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
                <FormDescription>This is your major</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Input placeholder="2" {...field} />
                </FormControl>
                <FormDescription>This is your class</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full hover:cursor-pointer">
            Create Student Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
