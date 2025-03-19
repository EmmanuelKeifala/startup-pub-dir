"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import FileUpload from "../FileUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FIELD_NAMES = {
  fullName: "Full Name",
  role: "Role",
  profilePicture: "Profile Picture",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
};

const FIELD_TYPES = {
  fullname: "text",
  email: "email",
  password: "password",
  confirmPassword: "password",
};

// Define the return type for the onSubmit function
interface SubmitResult {
  success: boolean;
  error?: string;
}

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<SubmitResult>;
  type: "SIGN_IN" | "SIGN_UP";
}

function AuthForm<T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) {
  const router = useRouter();
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      const result = await onSubmit(data);

      if (result?.success) {
        toast.success(
          `${
            type === "SIGN_IN"
              ? "You have successfully signed in"
              : "You have successfully signed up"
          }`
        );

        router.push("/");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {type === "SIGN_UP" ? "Sign Up" : "Sign In"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "profilePicture" ? (
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload profile picture"
                        folder="profilePictures"
                        variant="dark"
                        onFileChange={field.onChange}
                      />
                    ) : field.name === "role" ? (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="form-input">
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="startup_owner">
                            Startup Owner
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES] ||
                          "text"
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn" disabled={isLoading}>
            {type === "SIGN_UP" ? "Sign Up" : "Sign In"}
          </Button>
        </form>
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
