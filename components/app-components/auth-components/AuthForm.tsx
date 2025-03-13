"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z, ZodType } from "zod";

interface Props<T extends FieldValues> {
  type: "SIGN_UP" | "SIGN_IN";
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}
function AuthForm<T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) {
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    onSubmit(data);
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {type === "SIGN_UP" ? "Sign Up" : "Sign In"}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
        ></form>
      </Form>
      <p className="text-center text-base font-medium">
        {type === "SIGN_UP"
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <Link
          href={type === "SIGN_IN" ? "/sign-up" : "/sign-in"}
          className="text-bold text-primary"
        >
          {type === "SIGN_UP" ? "Sign In" : "Sign Up"}
        </Link>
      </p>
    </div>
  );
}

export default AuthForm;
