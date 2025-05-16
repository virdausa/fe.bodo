"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/api/schemas/profile.schema";
import { Card, CardContent } from "@/components/ui/card";
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
import Image from "next/image";

export default function OnboardingPage() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
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

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      const response = await createProfile(values);
      await response.json();
      toast.success(`Welcome ${values.name}`);
      router.push("/dashboard");
    } catch (error) {
      toast.error("There is an error while creating your profile");
      console.log(error);
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden py-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 md:p-8"
                >
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
                            <Input
                              placeholder="Muhammad Dimas Prasetyo"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your full name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full hover:cursor-pointer"
                    >
                      Create Profile
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="bg-muted relative hidden md:block">
                <Image
                  src="/images/college.webp"
                  alt="Image"
                  width={2400}
                  height={1600}
                  className="absolute inset-0 h-full w-full object-cover brightness-75"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
