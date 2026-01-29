
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
// Correcting useRouter import to use next/navigation for Next.js App Router
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { useAuth } from '@/hooks/useAuth'

const GOOGLE_LOGO = "/assets/icons/social/Logo Google.svg"
const APPLE_LOGO = "/assets/images/backgrounds/apple.png"

export default function SignUpPage() {
  const router = useRouter()
  const { register, isLoading, error } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters')
      return
    }

    const result = await register({
      name: fullName,
      email,
      password,
    })

    if (result.success) {
      router.push('/')
    } else {
      setValidationError(result.error || 'Registration failed')
    }
  }

  return (
    <AuthLayout
      title="Welcome to Elodan"
      subtitle="create an account to get started"
    >
      {/* Social Sign Up */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button className="flex items-center justify-center w-[125px] h-[36px] gap-2 py-2.5 bg-white border border-[#D3D3D3] rounded-3xl hover:bg-gray-50 transition-all">
          <Image
            src={GOOGLE_LOGO}
            alt="Google"
            width={20}
            height={20}
            unoptimized
          />
          <span className="text-[14px] font-medium text-[#110C0C]">Google</span>
        </button>
        <button className="flex items-center justify-center bg-white w-[42px] h-[42px] border border-[#D3D3D3] rounded-full hover:bg-gray-50 transition-all">
          <Image
            src={APPLE_LOGO}
            alt="Apple"
            width={20}
            height={20}
            unoptimized
          />
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E5E8]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-[16px] text-[#8A8A8A]">or</span>
        </div>
      </div>

      {/* Error Messages */}
      {(error || validationError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-[12px] text-red-600">{error || validationError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50"
            required
          />
        </div>

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

        {/* Password */}
        <div>
          <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 8 characters)"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[12px] font-normal text-[#110C0C] mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-[#110C0C] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 focus:border-[#110C0C] transition-all disabled:opacity-50"
            required
          />
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[50px] py-3 bg-[#110C0C] text-white rounded-lg text-[14px] font-medium hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-[16px] text-[#110C0C] mt-6">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium underline
    bg-gradient-to-r from-[#5A0A0A] to-[#110C0C]
    bg-clip-text text-transparent underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}