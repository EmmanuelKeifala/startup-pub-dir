"use client";
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
      onSubmit={() => {}}
    />
  );
}

export default SignUp;
