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
        profilePicture: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={signUp}
    />
  );
}

export default SignUp;
