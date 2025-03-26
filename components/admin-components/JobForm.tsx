"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader } from "lucide-react";
import { format } from "date-fns";
import { jobFormSchema } from "@/lib/validations";
import { motion } from "framer-motion";
import { addJob } from "@/actions/jobs";
import { toast } from "sonner";

type JobFormValues = z.infer<typeof jobFormSchema>;

const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];

export default function JobPostingForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      salary: "",
      jobType: "",
      location: "",
      contactEmail: "",
      expiresAt: undefined,
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    setIsLoading(true);
    const response = await addJob(data);
    if (response?.success) {
      toast.success("Job Listed Successfully");
      form.reset();
      setIsLoading(false);
    }
    if (response?.error) {
      toast.error(response.error);
      setIsLoading(false);
    }
    setIsLoading(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Post a New Job
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white rounded-xl shadow-lg p-8 border border-gray-200"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter job title"
                      className="bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Job Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter job description"
                      className="min-h-[120px] bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Requirements */}
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter job requirements"
                      className="min-h-[120px] bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Salary */}
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Salary</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example: $5000 - $7000/month"
                      className="bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Job Type */}
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Job Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-gray-300 text-gray-900">
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter job location"
                      className="bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Contact Email */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact email"
                      className="bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Expiration Date */}
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Expiration Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-300">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>Post Job</>
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
