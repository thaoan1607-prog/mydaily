import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Bell,
  Palette,
  Sliders,
  Shield,
  Save,
  Check,
  LogOut,
  Trash2,
  Lock,
  Sun,
  Moon,
  Laptop,
  Upload,
  Smile,
  Quote,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, PASTEL_THEMES, PastelTheme, ThemeMode } from '../context/ThemeContext';
import { PRESET_AVATARS } from '../data/presetAvatars';
import { MOTIVATIONAL_QUOTES } from '../data/motivationalQuotes';

interface SettingsViewProps {
  onOpenDashboardCustomizer?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenDashboardCustomizer }) => {
  const { currentUser, userSettings, updateProfile, updateSettings, changePassword, logout } = useAuth();
  const { pastelTheme, setPastelTheme, themeMode, setThemeMode, themeConfig } = useTheme();

  const [name, setName] = useState(currentUser.name);
  const [nickname, setNickname] = useState(currentUser.nickname || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [quote, setQuote] = useState(
    currentUser.motivationalQuote || '“Có việc gì nghĩ ra thì ghi ngay – AI giúp bạn nhớ và sắp xếp.”'
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings
  const [focusMinutes, setFocusMinutes] = useState(userSettings.pomodoroFocusMinutes);
  const [breakMinutes, setBreakMinutes] = useState(userSettings.pomodoroBreakMinutes);
  const [notificationsOn, setNotificationsOn] = useState(userSettings.notificationsEnabled);
  const [defaultReminder, setDefaultReminder] = useState(userSettings.defaultReminderTime);
  const [startOfWeek, setStartOfWeek] = useState(userSettings.startOfWeek);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dung lượng dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);

        setAvatar(compressed);
        updateProfile({ avatar: compressed });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || currentUser.name,
      nickname: nickname.trim(),
      avatar,
      motivationalQuote: quote.trim(),
    });
    updateSettings({
      pomodoroFocusMinutes: focusMinutes,
      pomodoroBreakMinutes: breakMinutes,
      notificationsEnabled: notificationsOn,
      defaultReminderTime: defaultReminder,
      startOfWeek,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPass) return;
    changePassword(newPassword);
    setPassSuccess(true);
    setNewPassword('');
    setConfirmPass('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Cài đặt Cá nhân hóa & Hệ thống</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tùy biến Avatar, tên xưng hô, màu sắc Pastel, châm ngôn sống và tiện ích màn hình chính.
        </p>
      </div>

      {/* 1. Account & Avatar & Nickname Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base">
            <UserIcon className="w-5 h-5 text-indigo-500" />
            <span>👤 Hồ sơ & Ảnh đại diện (Avatar)</span>
          </div>

          {onOpenDashboardCustomizer && (
            <button
              type="button"
              onClick={onOpenDashboardCustomizer}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Chỉnh Widget Trang chủ</span>
            </button>
          )}
        </div>

        {/* Avatar Preview & Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="relative group shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-18 h-18 rounded-2xl object-cover border-2 border-pink-400 shadow-sm"
              />
            ) : (
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center text-2xl font-black shadow-sm">
                {(nickname || name).charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {nickname ? `${nickname} (${name})` : name}
            </div>
            <p className="text-xs text-slate-500">
              Chọn từ bộ sưu tập biểu tượng bên dưới hoặc tải ảnh của bạn lên từ điện thoại / máy tính.
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all bg-gradient-to-r ${themeConfig.gradientClass}`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải ảnh từ máy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preset Avatars Library */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-pink-500" />
            <span>Thư viện biểu tượng Pastel đáng yêu:</span>
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {PRESET_AVATARS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setAvatar(item.dataUrl);
                  updateProfile({ avatar: item.dataUrl });
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all hover:scale-105 ${
                  avatar === item.dataUrl
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 ring-2 ring-pink-400/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <img src={item.dataUrl} alt={item.name} className="w-9 h-9 rounded-lg" />
                <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold truncate w-full text-center">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Biệt danh (Nickname xưng hô)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ví dụ: Thảo An, Bé Bắp..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Xuất hiện trong câu chào: "Chào [Biệt danh]! Hôm nay bạn muốn làm gì?"
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tên đầy đủ tài khoản
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Câu châm ngôn sống (Motivational Quote)
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Nhập câu châm ngôn truyền cảm hứng..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 text-slate-900 dark:text-slate-100"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {MOTIVATIONAL_QUOTES.slice(0, 4).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuote(q)}
                  className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-pink-600"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Loại tài khoản: <strong className="text-slate-700 dark:text-slate-200 uppercase">{currentUser.role}</strong>
            </span>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all bg-gradient-to-r ${themeConfig.gradientClass}`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thông tin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Theme Customizer (5 Pastel Themes & Light/Dark) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base">
          <Palette className="w-5 h-5 text-pink-500" />
          <span>🎨 Cá nhân hóa Bộ màu Pastel (Theme Customizer)</span>
        </div>

        {/* Mode options */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
            Chế độ sáng tối:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light' as ThemeMode, label: 'Giao diện Sáng', icon: <Sun className="w-4 h-4 text-amber-500" /> },
              { id: 'dark' as ThemeMode, label: 'Giao diện Tối', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
              { id: 'system' as ThemeMode, label: 'Theo hệ thống', icon: <Laptop className="w-4 h-4 text-slate-400" /> },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setThemeMode(m.id)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  themeMode === m.id
                    ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-400 text-pink-700 dark:text-pink-300 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5 Pastel Color Themes */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
            5 Bộ màu sắc Pastel:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(PASTEL_THEMES) as PastelTheme[]).map((themeKey) => {
              const item = PASTEL_THEMES[themeKey];
              const isSelected = pastelTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => setPastelTheme(themeKey)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-slate-900 dark:border-white shadow-sm ring-2 ring-pink-400/30 bg-white dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-white'
                  }`}
                >
                  <div className={`h-2 rounded-full w-full mb-2 bg-gradient-to-r ${item.gradientClass}`} />
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Pomodoro & General Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base">
          <Sliders className="w-5 h-5 text-amber-500" />
          <span>⚙️ Tùy chỉnh Pomodoro & Nhắc việc</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Thời gian tập trung Pomodoro (phút)
            </label>
            <input
              type="number"
              min={5}
              max={90}
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nghỉ giải lao (phút)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Thời gian nhắc trước mặc định
            </label>
            <select
              value={defaultReminder}
              onChange={(e) => setDefaultReminder(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-pink-500"
            >
              <option value="at_time">Đúng giờ hẹn</option>
              <option value="5m_before">Trước 5 phút</option>
              <option value="15m_before">Trước 15 phút</option>
              <option value="30m_before">Trước 30 phút</option>
              <option value="1h_before">Trước 1 giờ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ngày bắt đầu tuần
            </label>
            <select
              value={startOfWeek}
              onChange={(e) => setStartOfWeek(e.target.value as 'monday' | 'sunday')}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-pink-500"
            >
              <option value="monday">Thứ Hai (Khuyên dùng)</option>
              <option value="sunday">Chủ Nhật</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={notificationsOn}
              onChange={(e) => setNotificationsOn(e.target.checked)}
              className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Bật thông báo hệ thống nhắc nhở khi đến giờ
            </span>
          </label>
        </div>
      </div>

      {/* 4. Security & Password */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span>🔐 Bảo mật & Đổi mật khẩu</span>
        </div>

        {passSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl text-xs font-bold">
            ✓ Đã cập nhật mật khẩu mới thành công!
          </div>
        )}

        <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất tài khoản</span>
            </button>

            <button
              type="submit"
              disabled={!newPassword || newPassword !== confirmPass}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-40"
            >
              Cập nhật mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
