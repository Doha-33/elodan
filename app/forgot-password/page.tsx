
"use client";

import { useState } from "react";
// Correcting useRouter import to use next/navigation for Next.js App Router
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const result = await requestPasswordReset(email);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/reset-password");
      }, 2000);
    }
  };

  return (
    <AuthLayout
      title="Forget your Password"
      subtitle="Enter your account email address and we will send you a link to reset your password"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full h-[50px] py-3
    text-white rounded-lg text-[14px] font-medium
    bg-gradient-to-r from-[#5A0A0A] to-[#110C0C]
    hover:opacity-90
    transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : success ? "Email sent!" : "Submit"}
        </button>
      </form>

      {/* Back to Sign In Link */}
      <p className="text-center text-[16px] mt-8">
        <Link
          href="/signin"
          className="
      font-medium
      flex items-center justify-center gap-1
      bg-gradient-to-r from-[#110C0C] to-[#5A0A0A]
      bg-clip-text text-transparent
    "
        >
          <span className="no-underline">←</span>
          <span className="underline">Back to Sign in</span>
        </Link>
      </p>
    </AuthLayout>
  );
}