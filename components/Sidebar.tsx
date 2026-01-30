
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import { chatService } from "@/lib/services/chat.service";
import { ChatSession } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useConfirm } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { MoreHorizontal, Search, Pin as PinIcon, Trash2, Edit3, Palette, X, Check } from "lucide-react";

const navigationItems = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Chat", href: "/start-chat", icon: "chat" },
  { name: "Image", href: "/image", icon: "image" },
  { name: "Video", href: "/video", icon: "video" },
  { name: "Voice", href: "/voice", icon: "voice" },
  { name: "Template", href: "/template", icon: "template" },
];

const iconMap = {
  home: "/assets/icons/ui/SVGRepo_iconCarrier-10.svg",
  chat: "/assets/icons/ui/SVGRepo_iconCarrier-9.svg",
  image: "/assets/icons/ui/image-1.svg",
  video: "/assets/icons/ui/image.svg",
  voice: "/assets/icons/ui/voice.svg",
  template: "/assets/icons/ui/effect.svg",
};

const PRESET_COLORS = ["#5A0A0A", "#110C0C", "#9A57FF", "#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#EC4899"];

export default function Sidebar({ isOpen = true, onClose, isCollapsed = false, onToggleCollapse }: any) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [search, setSearch] = useState("");
  
  const [renameId, setRenameId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [colorPickerId, setColorPickerId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("#110C0C");

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      if (!isAuthLoading && !isAuthenticated) setSessions([]);
      return;
    }
    const loadSessions = async () => {
      try {
        const data = await chatService.getSessions();
        setSessions(data);
      } catch (err) {}
    };
    loadSessions();
  }, [pathname, isAuthenticated, isAuthLoading]);

  const handleDeleteSession = async (id: string) => {
    const ok = await confirm({
      title: 'Delete conversation',
      message: 'You will no longer see this conversation here',
      confirmText: 'Delete',
      confirmStyle: 'danger',
    });

    if (!ok) return;

    try {
      await chatService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      showToast("Conversation deleted", "success");
    } catch (e) {
      showToast("Failed to delete conversation", "error");
    }
  };

  const saveRename = async () => {
    if (!renameId) return;
    try {
      const updated = await chatService.updateSession(renameId, { title: tempTitle });
      setSessions(prev => prev.map(s => s.id === renameId ? { ...s, ...updated } : s));
      setRenameId(null);
    } catch (e) {}
  };

  const handlePin = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
  };

  const handleApplyColor = async () => {
    if (!colorPickerId) return;
    try {
      const updated = await chatService.updateSession(colorPickerId, { color: selectedColor });
      setSessions(prev => prev.map(s => s.id === colorPickerId ? { ...s, ...updated } : s));
      setColorPickerId(null);
    } catch (e) {}
  };

  const groupedSessions = useMemo(() => {
    const filtered = sessions.filter(s => (s.title?.toLowerCase() || "").includes(search.toLowerCase()));
    
    const sorted = [...filtered].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    return sorted.reduce((acc: any, session) => {
      const date = new Date(session.createdAt); date.setHours(0, 0, 0, 0);
      if (date.getTime() === today.getTime()) acc.today.push(session);
      else if (date.getTime() === yesterday.getTime()) acc.yesterday.push(session);
      else acc.older.push(session);
      return acc;
    }, { today: [], yesterday: [], older: [] });
  }, [sessions, search]);

  return (
    <>
      {isOpen && onClose && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn("bg-white text-[#110C0C] flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 lg:translate-x-0 border-r border-[#E5E5E8] overflow-x-hidden font-[Inter] elegant-scroll", isCollapsed ? "w-[72px]" : "w-[245px]", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className={cn("pt-5 px-5 flex items-center gap-3 h-[70px]", isCollapsed ? "justify-center" : "justify-start")}>
          <button onClick={onToggleCollapse} className="p-1 hover:bg-gray-100 rounded-md">
            <Image src="/assets/icons/ui/SVGRepo_iconCarrier-11.svg" alt="Menu" width={28} height={28} />
          </button>
          {!isCollapsed && <Link href="/" className="text-[26px] font-bold text-[#110C0C]"> Elodan </Link>}
        </div>

        <nav className={cn("flex-1 space-y-1 overflow-y-auto pt-4", isCollapsed ? "px-3" : "px-4")}>
          <div className="mb-4">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1", pathname === item.href ? "bg-[#F0F0F0] font-semibold" : "hover:bg-gray-50", isCollapsed && "justify-center px-0")}>
                <Image src={iconMap[item.icon as keyof typeof iconMap]} alt="" width={22} height={22} className={pathname === item.href ? "opacity-100" : "opacity-60"} />
                {!isCollapsed && <span className="text-[15px]">{item.name}</span>}
              </Link>
            ))}
          </div>

          {!isCollapsed && (
            <div className="mt-8 pt-4 border-t border-[#E5E5E8]">
              <div className="relative px-3 mb-6">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E5E8] rounded-xl text-[14px] focus:ring-1 focus:ring-[#110C0C] outline-none" />
              </div>

              {["today", "yesterday", "older"].map(key => (groupedSessions[key].length > 0 && (
                <div key={key} className="mb-6">
                  <h3 className="text-[13px] font-medium text-[#8A8A8A] mb-2 px-3 capitalize">{key}</h3>
                  {groupedSessions[key].map((s: any) => (
                    <SessionItem 
                      key={s.id} 
                      session={s} 
                      pathname={pathname} 
                      onDelete={handleDeleteSession} 
                      onRename={() => { setRenameId(s.id); setTempTitle(s.title); }} 
                      onPin={() => handlePin(s.id)} 
                      onOpenColor={() => { setColorPickerId(s.id); setSelectedColor(s.color || "#110C0C"); }} 
                    />
                  ))}
                </div>
              )))}
            </div>
          )}
        </nav>

        {renameId && (
          <div className="px-4 pb-6 animate-in slide-in-from-bottom">
            <div className="bg-[#F8F8F8] border border-[#E5E5E8] rounded-xl p-3 flex flex-col gap-2 shadow-lg">
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">Rename Chat</span>
              <div className="flex items-center gap-2">
                <input type="text" value={tempTitle} onChange={(e) => setTempTitle((e.target as HTMLInputElement).value)} onKeyDown={(e) => e.key === 'Enter' && saveRename()} className="flex-1 bg-transparent border-none text-[14px] outline-none" autoFocus />
                <button onClick={saveRename} className="text-green-600 p-1 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                <button onClick={() => setRenameId(null)} className="text-red-500 p-1 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {colorPickerId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[2px]" onClick={() => setColorPickerId(null)}>
          <div className="bg-white p-6 rounded-[28px] shadow-2xl border w-[340px] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h4 className="text-[16px] font-bold mb-4 text-center">Chat Accent Color</h4>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {PRESET_COLORS.map(c => (
                <button 
                  key={c} 
                  onClick={() => setSelectedColor(c)} 
                  className={cn("w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center", selectedColor === c ? "border-black shadow-md" : "border-transparent")} 
                  style={{ backgroundColor: c }}
                >
                  {selectedColor === c && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setColorPickerId(null)} className="flex-1 py-2.5 border rounded-xl text-[14px] font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleApplyColor} className="flex-1 py-2.5 bg-[#110C0C] text-white rounded-xl text-[14px] font-bold hover:bg-black transition-colors">Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SessionItem({ session, pathname, onDelete, onRename, onPin, onOpenColor }: any) {
  const isActive = pathname === `/chat/${session.id}`;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false); };
    if (showMenu) document.addEventListener('mousedown', clickOut);
    return () => document.removeEventListener('mousedown', clickOut);
  }, [showMenu]);

  return (
    <div className="relative group px-1">
      <Link href={`/chat/${session.id}`} className={cn("block px-3 py-2.5 rounded-xl transition-all relative overflow-hidden", isActive ? "bg-gray-100" : "hover:bg-gray-50")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: session.color || '#E5E5E8' }} />
            <span className="truncate text-[14px] font-medium transition-colors" style={{ color: session.color || '#110C0C' }}>
              {session.title || "Untitled Chat"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 h-4">
            {session.isPinned && <PinIcon className="w-3 h-3 text-[#8A8A8A] fill-current" />}
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 rounded">
              <MoreHorizontal className="w-4 h-4 text-[#8A8A8A]" />
            </button>
          </div>
        </div>
      </Link>

      {showMenu && (
        <div ref={menuRef} className="absolute right-0 top-full mt-1 w-[160px] bg-white rounded-2xl shadow-2xl border py-2 z-[70] animate-in fade-in zoom-in-95 duration-150">
          <button onClick={(e) => { e.preventDefault(); onRename(); setShowMenu(false); }} className="w-full px-4 py-2 flex items-center gap-3 text-[13px] hover:bg-gray-50"><Edit3 className="w-3.5 h-3.5 opacity-60" /> Rename</button>
          <button onClick={(e) => { e.preventDefault(); onPin(); setShowMenu(false); }} className="w-full px-4 py-2 flex items-center gap-3 text-[13px] hover:bg-gray-50"><PinIcon className="w-3.5 h-3.5 opacity-60" /> {session.isPinned ? 'Unpin chat' : 'Pin chat'}</button>
          <button onClick={(e) => { e.preventDefault(); onOpenColor(); setShowMenu(false); }} className="w-full px-4 py-2 flex items-center gap-3 text-[13px] hover:bg-gray-50"><Palette className="w-3.5 h-3.5 opacity-60" /> Color</button>
          <div className="my-1 border-t" />
          <button onClick={(e) => { e.preventDefault(); onDelete(session.id); setShowMenu(false); }} className="w-full px-4 py-2 flex items-center gap-3 text-[13px] text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 opacity-60" /> Delete</button>
        </div>
      )}
    </div>
  )
}
