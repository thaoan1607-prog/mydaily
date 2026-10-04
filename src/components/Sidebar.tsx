import React, { useState } from 'react';
import {
  Home,
  CheckSquare,
  Calendar,
  Lightbulb,
  Bot,
  Bell,
  BarChart3,
  Target,
  Settings,
  User as UserIcon,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Palette,
  CheckCircle2,
  Sparkles,
  ArrowRightLeft,
  Layers,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types/todo';

export type ActiveTab =
  | 'home'
  | 'tasks'
  | 'calendar'
  | 'ideas'
  | 'reminders'
  | 'statistics'
  | 'focus'
  | 'settings'
  | 'account'
  | 'admin';

export type SidebarFilter = 'all' | 'high' | 'medium' | 'quick' | 'someday' | 'schedule';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAssistant: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onOpenThemeModal: () => void;
  tasks: Task[];
  ideasCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenAssistant,
  onOpenAuthModal,
  onOpenThemeModal,
  tasks,
  ideasCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { themeConfig } = useTheme();
  const { currentUser, isGuest, isAdmin, logout, quickLogin } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);

  // Counts
  const todayTasks = tasks.filter((t) => !t.isSomeday);
  const pendingTodayCount = todayTasks.filter((t) => !t.completed).length;
  const remindersCount = tasks.filter((t) => t.reminderTime && t.reminderTime.trim().length > 0 && !t.completed).length;

  // Streamlined Main Navigation Items (Requirements: Trang chủ, Công việc, Lịch, Ý tưởng, Thống kê, Cài đặt)
  const mainNavItems = [
    {
      id: 'home' as ActiveTab,
      label: 'Trang chủ',
      emoji: '🏠',
      icon: <Home className="w-4 h-4 text-pink-500" />,
      count: pendingTodayCount > 0 ? pendingTodayCount : undefined,
      badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300',
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Công việc',
      emoji: '📝',
      icon: <CheckSquare className="w-4 h-4 text-indigo-500" />,
      count: tasks.filter((t) => !t.completed).length,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'Lịch',
      emoji: '📅',
      icon: <Calendar className="w-4 h-4 text-sky-500" />,
    },
    {
      id: 'ideas' as ActiveTab,
      label: 'Ý tưởng',
      emoji: '💡',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      count: ideasCount > 0 ? ideasCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    },
    {
      id: 'statistics' as ActiveTab,
      label: 'Thống kê',
      emoji: '📊',
      icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Cài đặt',
      emoji: '⚙️',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
    },
  ];

  // Secondary Utilities (Focus, Reminders, Account) - easily accessible without cluttering
  const utilityItems = [
    {
      id: 'focus' as ActiveTab,
      label: 'Tập trung Pomodoro',
      emoji: '🎯',
      icon: <Target className="w-4 h-4 text-violet-500" />,
    },
    {
      id: 'reminders' as ActiveTab,
      label: 'Nhắc nhở',
      emoji: '🔔',
      icon: <Bell className="w-4 h-4 text-rose-500" />,
      count: remindersCount > 0 ? remindersCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    },
    {
      id: 'account' as ActiveTab,
      label: 'Tài khoản cá nhân',
      emoji: '👤',
      icon: <UserIcon className="w-4 h-4 text-blue-500" />,
    },
  ];

  const adminItem = {
    id: 'admin' as ActiveTab,
    label: 'Quản trị Admin',
    emoji: '🛠️',
    icon: <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />,
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin';
    if (isGuest) return 'Khách';
    return 'Thành viên';
  };

  const getRoleBadgeStyle = () => {
    if (isAdmin) return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300';
    if (isGuest) return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300';
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300';
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800 transition-all select-none overflow-y-auto">
      {/* Top Header & Brand */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div
            onClick={() => {
              onSelectTab('home');
              onCloseMobile();
            }}
            className={`flex items-center gap-2.5 cursor-pointer overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md bg-gradient-to-tr ${themeConfig.gradientClass}`}
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-black text-base tracking-tight text-slate-900 dark:text-slate-100 block leading-tight">
                  My Daily
                </span>
                <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1">
                  <span>{themeConfig.emoji}</span>
                  <span>{themeConfig.name}</span>
                </span>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle Button (desktop) */}
          <button
            onClick={onToggleCollapse}
            type="button"
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Unified AI Assistant Fast Action */}
        <div className="mb-3">
          <button
            onClick={() => {
              onOpenAssistant();
              onCloseMobile();
            }}
            type="button"
            title="Mở Trợ lý AI My Daily"
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-white shadow-xs transition-all active:scale-95 bg-gradient-to-r ${themeConfig.gradientClass} ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span className="truncate">Trợ lý AI My Daily</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                  Chatbot
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Main Streamlined Navigation List */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Menu chính
            </div>
          )}

          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                type="button"
                title={item.label}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-bold shadow-2xs border border-pink-200/60 dark:border-pink-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <span className="text-base select-none shrink-0">{item.emoji}</span>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.count !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${item.badgeColor}`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Utilities / More section (Pomodoro, Reminders, Account) */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {!isCollapsed && (
            <button
              onClick={() => setShowUtilities(!showUtilities)}
              type="button"
              className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-700"
            >
              <span>Tiện ích khác</span>
              <span className="text-xs">{showUtilities ? '−' : '+'}</span>
            </button>
          )}

          {(showUtilities || isCollapsed || ['focus', 'reminders', 'account'].includes(activeTab)) && (
            <div className="space-y-1 mt-1">
              {utilityItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    type="button"
                    title={item.label}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <span className="text-sm select-none shrink-0">{item.emoji}</span>
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between text-left min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.count !== undefined && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${item.badgeColor}`}>
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Admin Area (if user is Admin) */}
          {isAdmin && (
            <div className="mt-2 pt-2 border-t border-rose-100 dark:border-rose-950">
              <button
                onClick={() => {
                  onSelectTab('admin');
                  onCloseMobile();
                }}
                type="button"
                title="Quản trị Admin"
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-2xs'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <span className="text-base select-none shrink-0">{adminItem.emoji}</span>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">{adminItem.label}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500 text-white">
                      Admin
                    </span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Profile & Theme Quick Access */}
      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* User Card */}
        <div
          className={`rounded-2xl p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 transition-all ${
            isCollapsed ? 'flex flex-col items-center' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 shadow-2xs"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[9px] px-1.5 py-0.1 rounded-full font-bold uppercase tracking-wider ${getRoleBadgeStyle()}`}
                  >
                    {getRoleLabel()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick role switch & Login/Logout row */}
          {!isCollapsed && (
            <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                title="Chuyển đổi vai trò thử nghiệm"
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 px-1 py-0.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Đổi vai trò</span>
              </button>

              {isGuest ? (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Đăng nhập</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Đăng xuất</span>
                </button>
              )}
            </div>
          )}

          {isCollapsed && (
            <div className="mt-1 flex flex-col items-center gap-1">
              {isGuest ? (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  title="Đăng nhập"
                  className="p-1.5 rounded-lg text-pink-600 hover:bg-pink-50"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Role Switcher Popover */}
        {showRoleSwitcher && !isCollapsed && (
          <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg space-y-1 text-xs animate-in fade-in duration-150">
            <div className="text-[10px] font-bold text-slate-400 uppercase px-1">
              Chuyển vai trò:
            </div>
            <button
              onClick={() => {
                quickLogin('guest');
                setShowRoleSwitcher(false);
              }}
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium flex items-center justify-between"
            >
              <span>1. Khách (Guest)</span>
              {isGuest && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
            </button>
            <button
              onClick={() => {
                quickLogin('user');
                setShowRoleSwitcher(false);
              }}
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium flex items-center justify-between"
            >
              <span>2. Người dùng (User)</span>
              {!isGuest && !isAdmin && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
            </button>
            <button
              onClick={() => {
                quickLogin('admin');
                setShowRoleSwitcher(false);
              }}
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between"
            >
              <span>3. Admin</span>
              {isAdmin && <CheckCircle2 className="w-3 h-3 text-rose-500" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-300 z-20 ${
          isCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-full h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
