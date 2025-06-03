"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProfileSchema } from "@/api/schemas/profile.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createProfile, getMe } from "@/api/services/profile.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function OnboardingPage() {
  const form = useForm<z.infer<typeof createProfileSchema>>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      name: "",
      isProfessor: false,
    },
  });
  const router = useRouter();

  useEffect(() => {
    async function initialOnboarding() {
      try {
        const response = await getMe();
        if (response.ok) {
          return router.push("/dashboard");
        } else {
          throw new Error();
        }
      } catch {
        return;
      }
    }

    initialOnboarding();
  }, [router]);

  async function onSubmit(values: z.infer<typeof createProfileSchema>) {
    try {
      const response = await createProfile(values);
      await response.json();
      toast.success(`Welcome ${values.name}`);
      if (values.isProfessor) {
        return router.push("/onboarding/professor");
      }
      return router.push("/onboarding/student");
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
            <h1 className="text-2xl font-bold">Onboarding</h1>
            <p className="text-muted-foreground text-balance">
              Let us know more about you
            </p>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Diddy" {...field} />
                </FormControl>
                <FormDescription>This is your full name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isProfessor"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Are you a professor?</FormLabel>
                  <FormDescription>
                    You cannot change this setting later
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full hover:cursor-pointer">
            Create Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
