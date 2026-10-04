import React, { useState } from 'react';
import { Lightbulb, Plus, ArrowRight, Trash2, Tag, Sparkles, BookOpen, Briefcase, Compass, User, CheckCircle2 } from 'lucide-react';
import { Idea } from '../types/todo';
import { useTheme } from '../context/ThemeContext';

interface IdeasViewProps {
  ideas: Idea[];
  onAddIdea: (title: string, category: Idea['category'], notes?: string) => void;
  onConvertIdeaToTask: (idea: Idea) => void;
  onDeleteIdea: (id: string) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  ideas,
  onAddIdea,
  onConvertIdeaToTask,
  onDeleteIdea,
}) => {
  const { themeConfig } = useTheme();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Idea['category']>('personal');
  const [notes, setNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categoryMeta: Record<
    Idea['category'],
    { label: string; icon: React.ReactNode; badgeClass: string; activeChipClass: string }
  > = {
    personal: {
      label: 'Cá nhân',
      icon: <User className="w-3.5 h-3.5" />,
      badgeClass: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      activeChipClass: 'bg-pink-500 text-white shadow-xs border-pink-500',
    },
    study: {
      label: 'Học tập',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      activeChipClass: 'bg-indigo-500 text-white shadow-xs border-indigo-500',
    },
    work: {
      label: 'Công việc',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      activeChipClass: 'bg-amber-500 text-white shadow-xs border-amber-500',
    },
    future: {
      label: 'Tương lai',
      icon: <Compass className="w-3.5 h-3.5" />,
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      activeChipClass: 'bg-emerald-500 text-white shadow-xs border-emerald-500',
    },
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddIdea(title.trim(), category, notes.trim());
    setTitle('');
    setNotes('');
  };

  const filteredIdeas =
    filterCategory === 'all'
      ? ideas
      : ideas.filter((i) => i.category === filterCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Prominent Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/70 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Góc Ý tưởng & Dự định</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  {ideas.length} ý tưởng
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Nơi ghi chép mọi suy nghĩ, dự định học hỏi hoặc ước mơ chưa cần làm ngay.
              </p>
            </div>
          </div>
        </div>

        {/* Input Form: Enhanced responsive layout with high-visibility input & submit button */}
        <form onSubmit={handleAdd} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập ý tưởng mới... (ví dụ: Học tiếng Nhật N3, Mua quà sinh nhật mẹ, Lập kế hoạch đi Đà Lạt)"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Idea['category'])}
                className="h-11 sm:h-auto px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-pink-500 cursor-pointer shrink-0"
              >
                <option value="personal">👤 Cá nhân</option>
                <option value="study">📚 Học tập</option>
                <option value="work">💼 Công việc</option>
                <option value="future">🧭 Tương lai</option>
              </select>

              <button
                type="submit"
                className={`h-11 sm:h-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r ${themeConfig.gradientClass}`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">Lưu ý tưởng</span>
              </button>
            </div>
          </div>
        </form>

        {/* 2. Refined Filter Chips with smooth scrolling & clear selected states */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {/* Tất cả */}
            <button
              onClick={() => setFilterCategory('all')}
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                filterCategory === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100'
              }`}
            >
              <span>✨</span>
              <span>Tất cả</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterCategory === 'all' ? 'bg-white/20 dark:bg-slate-800 text-white dark:text-slate-100' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {ideas.length}
              </span>
            </button>

            {/* Category Chips: Cá nhân, Học tập, Công việc, Tương lai */}
            {(Object.keys(categoryMeta) as Idea['category'][]).map((catKey) => {
              const meta = categoryMeta[catKey];
              const count = ideas.filter((i) => i.category === catKey).length;
              const isSelected = filterCategory === catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => setFilterCategory(catKey)}
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 border ${
                    isSelected
                      ? meta.activeChipClass
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center space-y-2">
            <Lightbulb className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Chưa có ý tưởng nào trong mục này.
            </p>
            <p className="text-xs text-slate-400">
              Hãy nhập suy nghĩ của bạn ở khung phía trên để lưu giữ lại nhé!
            </p>
          </div>
        ) : (
          filteredIdeas.map((idea) => {
            const meta = categoryMeta[idea.category] || categoryMeta.personal;
            return (
              <div
                key={idea.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group hover:border-pink-300 dark:hover:border-pink-800/80"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${meta.badgeClass}`}>
                      {meta.icon}
                      <span>{meta.label}</span>
                    </span>

                    <button
                      onClick={() => onDeleteIdea(idea.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                      title="Xóa ý tưởng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {idea.title}
                  </h4>

                  {idea.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {idea.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    {new Date(idea.createdAt).toLocaleDateString('vi-VN')}
                  </span>

                  <button
                    onClick={() => onConvertIdeaToTask(idea)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/60 border border-pink-200 dark:border-pink-800/60 transition-all flex items-center gap-1 cursor-pointer"
                    title="Chuyển ý tưởng này thành công việc cần làm hôm nay"
                  >
                    <span>Làm việc này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
