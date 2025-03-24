"use client";
import React from "react";
import { AuthForm } from "@/components/app-components/index";
import { signInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/actions/auth-action";

function SignIn() {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={async (data) => {
        const result = await signInWithCredentials(data);
        return result || { success: false, error: "Invalid email or password" };
      }}
    />
  );
}

export default SignIn;
