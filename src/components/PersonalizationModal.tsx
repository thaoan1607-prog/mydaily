import React, { useState, useRef } from 'react';
import {
  X,
  Palette,
  User as UserIcon,
  Upload,
  Check,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Smile,
  Sliders,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Quote,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, PASTEL_THEMES, PastelTheme, ThemeMode } from '../context/ThemeContext';
import { PRESET_AVATARS } from '../data/presetAvatars';
import { MOTIVATIONAL_QUOTES } from '../data/motivationalQuotes';
import { DashboardWidgetSetting } from '../types/todo';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardWidgets: DashboardWidgetSetting[];
  onUpdateDashboardWidgets: (widgets: DashboardWidgetSetting[]) => void;
  initialTab?: 'avatar' | 'theme' | 'name' | 'dashboard';
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  dashboardWidgets,
  onUpdateDashboardWidgets,
  initialTab = 'avatar',
}) => {
  const { currentUser, updateProfile } = useAuth();
  const { pastelTheme, setPastelTheme, themeMode, setThemeMode, themeConfig } = useTheme();

  const [activeTab, setActiveTab] = useState<'avatar' | 'theme' | 'name' | 'dashboard'>(initialTab);

  // Profile fields state
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentUser.avatar || '');
  const [name, setName] = useState<string>(currentUser.name || '');
  const [nickname, setNickname] = useState<string>(currentUser.nickname || '');
  const [quote, setQuote] = useState<string>(
    currentUser.motivationalQuote || '“Có việc gì nghĩ ra thì ghi ngay – AI giúp bạn nhớ và sắp xếp.”'
  );
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Compress & crop uploaded image to 256x256 via canvas to save cleanly in LocalStorage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có kích thước dưới 5MB để tối ưu dung lượng.');
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

        // Draw centered and cover cropped
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setSelectedAvatar(compressedDataUrl);
        updateProfile({ avatar: compressedDataUrl });
        triggerToast('✓ Đã cập nhật ảnh đại diện mới thành công!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (dataUrl: string) => {
    setSelectedAvatar(dataUrl);
    updateProfile({ avatar: dataUrl });
    triggerToast('✓ Đã đổi sang biểu tượng đáng yêu!');
  };

  const handleSaveNameAndQuote = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || currentUser.name,
      nickname: nickname.trim(),
      motivationalQuote: quote.trim(),
    });
    triggerToast('✓ Đã lưu tên xưng hô & châm ngôn sống!');
  };

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Dashboard widget reordering
  const handleToggleWidget = (id: string) => {
    const updated = dashboardWidgets.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
    onUpdateDashboardWidgets(updated);
  };

  const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dashboardWidgets.length) return;

    const list = [...dashboardWidgets];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    onUpdateDashboardWidgets(list);
  };

  const handleResetWidgets = () => {
    const defaults: DashboardWidgetSetting[] = [
      {
        id: 'progress',
        label: 'Tiến độ công việc',
        description: 'Thanh tiến độ % hoàn thành việc trong ngày',
        icon: '📊',
        enabled: true,
      },
      {
        id: 'countdown',
        label: 'Đồng hồ đếm ngược Pomodoro',
        description: 'Hỗ trợ đếm ngược tập trung 25 phút',
        icon: '⏱️',
        enabled: true,
      },
      {
        id: 'quickAdd',
        label: 'Góc nhập nhanh công việc & ý tưởng',
        description: 'Ô nhập và tự động phân loại nhiệm vụ',
        icon: '✍️',
        enabled: true,
      },
      {
        id: 'aiAssistant',
        label: 'Khung Trợ lý AI My Daily',
        description: 'Gợi ý sắp xếp ngày làm việc thông minh',
        icon: '🤖',
        enabled: true,
      },
    ];
    onUpdateDashboardWidgets(defaults);
    triggerToast('✓ Đã khôi phục cài đặt widget mặc định!');
  };

  const displayNamePreview = nickname.trim() || name.trim() || currentUser.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-4 sm:p-5 text-white flex items-center justify-between bg-gradient-to-r ${themeConfig.gradientClass} shrink-0`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">Cá Nhân Hóa "My Daily"</h3>
              <p className="text-xs text-white/90">
                Tùy biến avatar, màu sắc Pastel, tên xưng hô và tiện ích trang chủ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-3 bg-slate-50/80 dark:bg-slate-900/80 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'avatar'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-800/80'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>🌸</span>
            <span>Ảnh đại diện</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-800/80'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>🎨</span>
            <span>Bộ màu Pastel</span>
          </button>

          <button
            onClick={() => setActiveTab('name')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'name'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-800/80'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>💬</span>
            <span>Tên xưng hô & Châm ngôn</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-800/80'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>🎛️</span>
            <span>Tiện ích trang chủ</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Toast alert feedback */}
          {saveToast && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{saveToast}</span>
            </div>
          )}

          {/* TAB 1: AVATAR CUSTOMIZATION */}
          {activeTab === 'avatar' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Current Avatar & Upload Row */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  {selectedAvatar ? (
                    <img
                      src={selectedAvatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-pink-400 dark:border-pink-500 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center text-3xl font-black shadow-md">
                      {name.charAt(0).toUpperCase() || '🌸'}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-pink-500 text-white shadow-xs">
                    Hiện tại
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                    {displayNamePreview}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ảnh đại diện sẽ hiển thị tức thì trên thanh Header và góc trên của Sidebar.
                  </p>
                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 bg-gradient-to-r ${themeConfig.gradientClass}`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy lên</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Avatars Library */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-pink-500" />
                    <span>Bộ sưu tập Avatar Pastel đáng yêu:</span>
                  </label>
                  <span className="text-[11px] text-slate-400">({PRESET_AVATARS.length} mẫu)</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {PRESET_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.dataUrl;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(avatar.dataUrl)}
                        className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 group relative hover:scale-105 active:scale-95 ${
                          isSelected
                            ? 'bg-pink-50 dark:bg-pink-950/50 border-pink-500 dark:border-pink-400 ring-2 ring-pink-400/40 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-pink-300'
                        }`}
                      >
                        <img
                          src={avatar.dataUrl}
                          alt={avatar.name}
                          className="w-12 h-12 rounded-xl object-contain"
                        />
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                          {avatar.name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEME CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Dark / Light Mode Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
                  Chế độ hiển thị Giao diện:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'light' as ThemeMode,
                      label: 'Giao diện Sáng',
                      icon: <Sun className="w-4 h-4 text-amber-500" />,
                      desc: 'Tươi tắn, rõ nét ban ngày',
                    },
                    {
                      id: 'dark' as ThemeMode,
                      label: 'Giao diện Tối',
                      icon: <Moon className="w-4 h-4 text-indigo-400" />,
                      desc: 'Dịu mắt, êm ái ban đêm',
                    },
                    {
                      id: 'system' as ThemeMode,
                      label: 'Theo hệ thống',
                      icon: <Laptop className="w-4 h-4 text-slate-400" />,
                      desc: 'Tự động theo thiết bị',
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setThemeMode(m.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        themeMode === m.id
                          ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 dark:border-pink-400 text-pink-900 dark:text-pink-100 shadow-2xs font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        {m.icon}
                        {themeMode === m.id && <Check className="w-4 h-4 text-pink-500 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold">{m.label}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5 Specific Pastel Themes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
                  5 Bộ Màu Sắc Pastel (Theme Customizer):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(PASTEL_THEMES) as PastelTheme[]).map((themeKey) => {
                    const item = PASTEL_THEMES[themeKey];
                    const isSelected = pastelTheme === themeKey;

                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => {
                          setPastelTheme(themeKey);
                          triggerToast(`✓ Đã kích hoạt chủ đề ${item.name}!`);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                          isSelected
                            ? 'border-slate-900 dark:border-white shadow-md ring-2 ring-pink-400/40 bg-white dark:bg-slate-800'
                            : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* Gradient strip */}
                        <div
                          className={`h-3 rounded-full w-full mb-2.5 bg-gradient-to-r ${item.gradientClass} shadow-xs`}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl select-none">{item.emoji}</span>
                            <div>
                              <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NICKNAME & MOTIVATIONAL QUOTE */}
          {activeTab === 'name' && (
            <form onSubmit={handleSaveNameAndQuote} className="space-y-5 animate-in fade-in duration-200">
              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-amber-50/80 dark:from-pink-950/30 dark:via-purple-950/20 dark:to-amber-950/20 border border-pink-200 dark:border-pink-800/60 space-y-1.5 text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-pink-600 dark:text-pink-400">
                  Xem trước lời chào cá nhân:
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-slate-50">
                  Chào {displayNamePreview}! Hôm nay bạn muốn làm gì?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium">
                  {quote || '“Có việc gì nghĩ ra thì ghi ngay – AI giúp bạn nhớ và sắp xếp.”'}
                </p>
              </div>

              {/* Form inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Biệt danh hiển thị (Nickname)
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ví dụ: Thảo An, Bé Bắp, Bạn thân mến..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-pink-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tên này sẽ xuất hiện trong câu chào mở đầu mỗi ngày của ứng dụng.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên đầy đủ tài khoản
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Câu châm ngôn sống (Motivational Quote)
                    </label>
                    <span className="text-[10px] text-slate-400">Tùy ý nhập hoặc chọn mẫu bên dưới</span>
                  </div>
                  <textarea
                    rows={2}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Nhập câu châm ngôn truyền cảm hứng cho bạn mỗi ngày..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Preset quotes */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Gợi ý câu châm ngôn hay:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {MOTIVATIONAL_QUOTES.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuote(q)}
                        className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-slate-700 dark:text-slate-300 hover:text-pink-600 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all bg-gradient-to-r ${themeConfig.gradientClass}`}
                  >
                    Lưu tên xưng hô & Châm ngôn
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 4: CUSTOMIZABLE DASHBOARD WIDGETS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Bật / Tắt & Sắp xếp Widget Trang chủ
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dùng nút Lên / Xuống để tùy chỉnh thứ tự xuất hiện trên màn hình chính
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetWidgets}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  title="Khôi phục mặc định"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mặc định</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {dashboardWidgets.map((widget, index) => (
                  <div
                    key={widget.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      widget.enabled
                        ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 shadow-2xs'
                        : 'bg-slate-50/70 dark:bg-slate-900/60 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl select-none">{widget.icon}</span>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{widget.label}</span>
                          {!widget.enabled && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold">
                              Đã ẩn
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {widget.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Move up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveWidget(index, 'up')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Di chuyển lên"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move down */}
                      <button
                        type="button"
                        disabled={index === dashboardWidgets.length - 1}
                        onClick={() => handleMoveWidget(index, 'down')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle On/Off switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleWidget(widget.id)}
                        className={`p-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          widget.enabled
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                        title={widget.enabled ? 'Bấm để ẩn widget' : 'Bấm để hiện widget'}
                      >
                        {widget.enabled ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hiện</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Ẩn</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Tất cả cài đặt cá nhân hóa được tự động lưu vào LocalStorage.
          </span>
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-colors"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
