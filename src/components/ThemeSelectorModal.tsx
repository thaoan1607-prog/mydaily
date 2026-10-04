import React from 'react';
import { X, Sun, Moon, Laptop, Palette, Check, Sparkles, Sliders } from 'lucide-react';
import { useTheme, PASTEL_THEMES, PastelTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullPersonalization?: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  onOpenFullPersonalization,
}) => {
  const { pastelTheme, setPastelTheme, themeMode, setThemeMode, themeConfig } = useTheme();

  if (!isOpen) return null;

  const modeOptions: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'light',
      label: 'Giao diện sáng',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      desc: 'Nền sáng pastel dịu mắt, tươi tắn',
    },
    {
      id: 'dark',
      label: 'Giao diện tối',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
      desc: 'Nền tối êm dịu, bảo vệ mắt ban đêm',
    },
    {
      id: 'system',
      label: 'Theo hệ thống',
      icon: <Laptop className="w-4 h-4 text-slate-400" />,
      desc: 'Tự động đồng bộ theo thiết bị',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95">
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between bg-gradient-to-r ${themeConfig.gradientClass}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">Bộ Chủ Đề & Màu Sắc Pastel</h3>
              <p className="text-xs text-white/90">
                5 sắc thái Pastel dịu ngọt & chế độ hiển thị Sáng/Tối
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

        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Light / Dark Mode Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Chế độ hiển thị:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {modeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setThemeMode(opt.id)}
                  type="button"
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    themeMode === opt.id
                      ? 'bg-pink-50/80 dark:bg-pink-950/40 border-pink-400 dark:border-pink-600 text-pink-900 dark:text-pink-200 shadow-2xs font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    {opt.icon}
                    {themeMode === opt.id && <Check className="w-4 h-4 text-pink-600 dark:text-pink-400 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold leading-tight">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: 5 Pastel Themes (Sakura, Matcha, Ocean, Lavender, Sunset) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>5 Bộ màu Pastel theo sở thích:</span>
              </label>
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400">
                {PASTEL_THEMES[pastelTheme]?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(PASTEL_THEMES) as PastelTheme[]).map((themeKey) => {
                const item = PASTEL_THEMES[themeKey];
                const isSelected = pastelTheme === themeKey;

                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => setPastelTheme(themeKey)}
                    className={`p-3.5 rounded-2xl border transition-all text-left group overflow-hidden ${
                      isSelected
                        ? 'border-slate-900 dark:border-white shadow-md ring-2 ring-pink-400/40 bg-white dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Gradient preview */}
                    <div
                      className={`h-2.5 rounded-full w-full mb-2 bg-gradient-to-r ${item.gradientClass} shadow-2xs`}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg select-none">{item.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {onOpenFullPersonalization ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullPersonalization();
              }}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Đổi avatar, biệt danh & widget...</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-colors"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
