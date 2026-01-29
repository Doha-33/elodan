
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmPasswordReset, isLoading } = useAuth();

  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    const result = await confirmPasswordReset(token, newPassword);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } else {
      setValidationError(result.error || "Password reset failed");
    }
  };

  const handleCancel = () => {
    router.push("/signin");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
          Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          disabled={isLoading || success}
          className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50"
          required
        />
      </div>

      <div>
        <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          disabled={isLoading || success}
          className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50"
          required
        />
      </div>

      {validationError && <p className="text-red-500 text-xs">{validationError}</p>}

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full h-[50px] py-3
  text-white rounded-lg text-[14px] font-medium
  bg-gradient-to-r from-[#5A0A0A] to-[#110C0C]
  hover:opacity-90
  transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Saving..."
            : success
            ? "Password reset!"
            : "Save changes"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading || success}
          className="w-full py-3 bg-white border border-[#D3D3D3] text-[#110C0C] rounded-lg text-[14px] font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your Password"
      subtitle="Choose a new and secure password to protect your account"
    >
      <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
