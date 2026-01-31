"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/lib/services/user.service";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmModal";
import {
  X,
  ChevronLeft,
  Edit3,
  Trash2,
  ShieldCheck,
  Camera,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR = "/assets/images/backgrounds/Ellipse 491.svg";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<"profile" | "password">("profile");
  const [name, setName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleUpdateName = async () => {
    if (!name.trim() || name === user?.name) return;
    setIsUpdating(true);
    try {
      const res = await userService.updateProfile({ name });
      updateUser(res.data);
      showToast("Profile updated successfully", "success");
    } catch (e) {
      showToast("Failed to update profile", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Using currentTarget instead of target for better type safety with input elements in TypeScript
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB", "warning");
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await userService.updateProfile(formData);
      updateUser(res.data);
      showToast("Avatar updated successfully", "success");
    } catch (err) {
      showToast("Failed to upload image", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete account",
      message: "Deleting your account will permanently remove all your data. This action cannot be undone.",
      confirmText: "Confirm",
      confirmStyle: "danger",
      icon: "delete",
    });

    if (ok) {
      try {
        await userService.deleteAccount();
        showToast("Account deleted", "success");
        logout();
        onClose();
      } catch (e) {
        showToast("Failed to delete account", "error");
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out transform font-[Inter]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            {view === "password" ? (
              <button
                onClick={() => setView("profile")}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-[18px] font-bold text-[#110C0C]">
              {view === "profile" ? "Account Settings" : "Security"}
            </h2>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F8F8F8] shadow-lg mb-4 relative">
                  <img
                    src={user?.avatar || DEFAULT_AVATAR}
                    alt="Profile"
                    className={cn(
                      "w-full h-full object-cover transition-opacity",
                      isUploadingAvatar ? "opacity-30" : "opacity-100"
                    )}
                  />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#110C0C] animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Overlay on Hover */}
                {!isUploadingAvatar && (
                  <div className="absolute inset-0 mb-4 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[16px] font-bold text-[#110C0C]">
                {user?.name}
              </p>
              <p className="text-[12px] text-[#8A8A8A]">{user?.email}</p>
            </div>

            {view === "profile" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[12px] font-bold text-[#8A8A8A] mb-2 uppercase tracking-widest">
                    User Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      // FIX: Using currentTarget instead of target for type safety with input elements
                      onChange={(e) => setName(e.currentTarget.value)}
                      className="w-full h-[54px] px-5 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 transition-all"
                    />
                    <Edit3 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#8A8A8A] mb-2 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={user?.email || ""}
                    readOnly
                    className="w-full h-[54px] px-5 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="pt-6 space-y-4">
                  <button
                    onClick={() => setView("password")}
                    className="w-full h-[54px] bg-[#0A0404] text-white rounded-xl text-[14px] font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Reset password
                  </button>

                  {name !== user?.name && (
                    <button
                      onClick={handleUpdateName}
                      disabled={isUpdating}
                      className="w-full h-[54px] bg-white border border-[#D3D3D3] text-[#110C0C] rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-all"
                    >
                      {isUpdating ? "Saving..." : "Save changes"}
                    </button>
                  )}
                </div>

                <div className="pt-10 mt-10 border-t border-gray-100">
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-600 font-bold text-[14px] hover:underline"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete my account
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[12px] font-bold text-[#8A8A8A] mb-2 uppercase tracking-widest">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full h-[54px] px-5 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#8A8A8A] mb-2 uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full h-[54px] px-5 bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/10 transition-all"
                  />
                </div>

                <button className="w-full h-[54px] bg-[#0A0404] text-white rounded-xl text-[14px] font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all mt-6">
                  Save Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
