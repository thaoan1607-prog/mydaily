import React from 'react';
import { Calendar, Bell, BellOff, Sparkles, BarChart3, Palette, Menu, Hourglass, User as UserIcon, CheckCircle2, ChevronRight, Sliders } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  completedCount: number;
  totalTodayCount: number;
  notificationsEnabled: boolean;
  onToggleNotification: () => void;
  onOpenSummary: () => void;
  onOpenAssistant: () => void;
  onOpenThemeModal: () => void;
  onOpenTimer: () => void;
  onOpenMobileMenu: () => void;
  onOpenAuthModal?: () => void;
  onOpenPersonalization?: (tab?: 'avatar' | 'theme' | 'name' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedCount,
  totalTodayCount,
  notificationsEnabled,
  onToggleNotification,
  onOpenSummary,
  onOpenAssistant,
  onOpenThemeModal,
  onOpenTimer,
  onOpenMobileMenu,
  onOpenAuthModal,
  onOpenPersonalization,
}) => {
  const { themeConfig } = useTheme();
  const { currentUser, isGuest, isAdmin } = useAuth();

  // Format current date in Vietnamese
  const today = new Date();
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = daysOfWeek[today.getDay()];
  const dateStr = `${dayName}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const percent = totalTodayCount > 0 ? Math.round((completedCount / totalTodayCount) * 100) : 0;
  const userGreetingName = currentUser.nickname || currentUser.name;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
      {/* Slim guest notice bar at the very top (compact and non-intrusive) */}
      {isGuest && (
        <div className="bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-rose-500/10 border-b border-pink-200/40 dark:border-pink-900/40 px-4 py-1 text-[11px] flex items-center justify-between text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">Đang dùng chế độ Khách</span>
            <span className="hidden md:inline text-slate-400 dark:text-slate-500">— Dữ liệu lưu trên máy này. Đăng ký để đồng bộ đám mây</span>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 flex items-center gap-0.5 underline shrink-0 cursor-pointer"
          >
            <span>Đăng ký / Đăng nhập</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile menu toggle + Brand Logo & Avatar & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMobileMenu}
            type="button"
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {/* Top-Left Avatar / Brand Badge */}
            <div
              onClick={() => onOpenPersonalization?.('avatar')}
              title="Nhấn để đổi ảnh đại diện & cá nhân hóa"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm overflow-hidden cursor-pointer group relative border border-white/60 dark:border-slate-700 bg-gradient-to-tr ${themeConfig.gradientClass}`}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={userGreetingName}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-50 leading-none">
                  My Daily
                </h1>
                <span className="text-xs select-none">{themeConfig.emoji}</span>
                <span className={`hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md ${themeConfig.badgeClass}`}>
                  Smart Tasks
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{dateStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right actions: Scientific grouping with rich hover tooltips */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Tools Group */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {/* Countdown / Pomodoro Timer */}
            <div className="relative group">
              <button
                onClick={onOpenTimer}
                type="button"
                className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center"
                aria-label="Đồng hồ đếm ngược"
              >
                <Hourglass className="w-4 h-4 text-pink-500" />
              </button>
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-50">
                Đồng hồ đếm ngược / Pomodoro
              </div>
            </div>

            {/* Theme & Pastel Palette & Personalization */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (onOpenPersonalization) {
                    onOpenPersonalization('theme');
                  } else {
                    onOpenThemeModal();
                  }
                }}
                type="button"
                className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1"
                aria-label="Tùy biến giao diện"
              >
                <Palette className="w-4 h-4 text-purple-500" />
                <span className="w-2 h-2 rounded-full hidden sm:inline-block" style={{ backgroundColor: themeConfig.previewHex }} />
              </button>
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-50">
                Cá nhân hóa & 5 Màu Pastel ({themeConfig.name})
              </div>
            </div>

            {/* Notification sound toggle */}
            <div className="relative group">
              <button
                onClick={onToggleNotification}
                type="button"
                className={`p-1.5 sm:p-2 rounded-lg transition-all flex items-center ${
                  notificationsEnabled
                    ? 'text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-slate-700'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-700'
                }`}
                aria-label="Nhắc việc"
              >
                {notificationsEnabled ? (
                  <Bell className="w-4 h-4 fill-amber-400/20" />
                ) : (
                  <BellOff className="w-4 h-4" />
                )}
              </button>
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-50">
                {notificationsEnabled ? 'Chuông thông báo: Bật' : 'Bật chuông thông báo'}
              </div>
            </div>

            {/* Daily summary button */}
            <div className="relative group">
              <button
                onClick={onOpenSummary}
                type="button"
                className="px-2 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                aria-label="Tổng kết ngày"
              >
                <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                  {percent}%
                </span>
              </button>
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-50">
                Báo cáo tổng kết ngày ({percent}%)
              </div>
            </div>
          </div>

          {/* User Account / Avatar button */}
          <div className="relative group">
            <button
              onClick={() => {
                if (onOpenPersonalization) {
                  onOpenPersonalization('avatar');
                } else if (onOpenAuthModal) {
                  onOpenAuthModal();
                }
              }}
              type="button"
              className="p-1 sm:px-2 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={userGreetingName}
                  className="w-5 h-5 rounded-full object-cover border border-pink-400"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {userGreetingName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden lg:inline max-w-[75px] truncate text-[11px]">
                {userGreetingName}
              </span>
              {isGuest && (
                <span className="text-[9px] px-1 py-0.2 rounded-sm bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold hidden sm:inline">
                  Khách
                </span>
              )}
              {isAdmin && (
                <span className="text-[9px] px-1 py-0.2 rounded-sm bg-rose-500 text-white font-bold hidden sm:inline">
                  Admin
                </span>
              )}
            </button>
            <div className="pointer-events-none absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-50">
              Hồ sơ: {userGreetingName} (Bấm để đổi avatar)
            </div>
          </div>

          {/* Unified AI Assistant Button */}
          <div className="relative group">
            <button
              onClick={onOpenAssistant}
              type="button"
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5 bg-gradient-to-r ${themeConfig.gradientClass}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span className="hidden sm:inline">Trợ lý AI</span>
            </button>
            <div className="pointer-events-none absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-50">
              Mở Trợ lý AI My Daily
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
