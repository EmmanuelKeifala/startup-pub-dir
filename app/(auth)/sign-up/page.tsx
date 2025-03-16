"use client";
import { signUp } from "@/actions/auth-action";
import { AuthForm } from "@/components/app-components/index";
import { signUpSchema } from "@/lib/validations";
import React from "react";

function SignUp() {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        fullName: "",
        email: "",
        role: "user",
        profilePicture: "", // Ensure this matches the expected type
        password: "",
        confirmPassword: "", // Remove this if it's not part of AuthCredentials
      }}
      onSubmit={async (data) => {
        const result = await signUp(data);
        return result || { success: false, error: "An unknown error occurred" };
      }}
    />
  );
}

export default SignUp;
