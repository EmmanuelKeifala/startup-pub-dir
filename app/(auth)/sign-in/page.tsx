"use client";
import React from "react";
import { AuthForm } from "@/components/app-components/index";
import { signInSchema } from "@/lib/validations";

function SignIn() {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={() => {}}
    />
  );
}

export default SignIn;
