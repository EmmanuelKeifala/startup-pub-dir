"use client";
import { User, Mail, Lock, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { profileFormSchema } from "@/lib/validations";
import { useSession } from "next-auth/react";
import { useState } from "react";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfilePage() {
  const { data: session } = useSession();
  const defaultValues: ProfileFormValues = {
    name: session?.user.fullName as string,
    email: session?.user.email as string,
    avatar: session?.user.profilePicture as string,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log("result: ", result);

      if (!response.ok) {
        toast.error(result.error || "Failed to update profile");
      }

      toast.success(result.message);
    } catch (error: unknown) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold mt-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Edit Profile
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-300">
                          <User className="h-4 w-4 text-indigo-400" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-gray-700/50 border-gray-600 focus:border-indigo-500 text-white"
                            placeholder="Your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-300">
                          <Mail className="h-4 w-4 text-indigo-400" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="bg-gray-700/50 border-gray-600 focus:border-indigo-500 text-white"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Password Section */}
                  <div className="space-y-4 pt-4">
                    <h3 className="flex items-center gap-2 text-gray-300 font-medium">
                      <Lock className="h-4 w-4 text-indigo-400" />
                      Change Password
                    </h3>

                    {/* Current Password */}
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">
                            Current Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="bg-gray-700/50 border-gray-600 focus:border-indigo-500 text-white"
                              placeholder="••••••••"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* New Password */}
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="bg-gray-700/50 border-gray-600 focus:border-indigo-500 text-white"
                              placeholder="••••••••"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="bg-gray-700/50 border-gray-600 focus:border-indigo-500 text-white"
                              placeholder="••••••••"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <CardFooter className="flex justify-end gap-2 px-0 pb-0 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700 px-8 py-6 rounded-lg font-medium text-base flex items-center gap-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-lg font-medium text-base flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="animate-spin h-5 w-5" />
                          Processing...
                        </>
                      ) : (
                        <>Save Changes</>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;
