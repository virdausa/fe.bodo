"use client";

import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUp } from "@/api/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signupSchema } from "@/api/schemas/auth.schema";

function SignupForm() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      await signUp(values);
      toast.success(`Welcome ${values.username}`);
      router.push("/onboarding");
    } catch (error) {
      toast.error("There is an error while signing you in");
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-muted-foreground text-balance">
              Create a Cognito account
            </p>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="265458741" {...field} />
                </FormControl>
                <FormDescription>This is your username</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>This is your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>
                  This is your password confirmation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full hover:cursor-pointer">
            Sign up
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default function SigninPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SignupForm />
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
  );
}
