export interface PresetAvatar {
  id: string;
  name: string;
  category: 'cute_nature' | 'sweet_animals' | 'daily_life';
  emoji: string;
  dataUrl: string;
}

// Generate high quality SVG data URLs with pastel gradients and cute emojis
const createSvgAvatar = (emoji: string, bg1: string, bg2: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="35" fill="url(#g)"/>
    <text x="50%" y="54%" font-size="52" dominant-baseline="central" text-anchor="middle">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'sakura',
    name: 'Hoa Anh Đào',
    category: 'cute_nature',
    emoji: '🌸',
    dataUrl: createSvgAvatar('🌸', '#fbcfe8', '#f472b6'),
  },
  {
    id: 'cat',
    name: 'Mèo Con Mắt Biếc',
    category: 'sweet_animals',
    emoji: '🐱',
    dataUrl: createSvgAvatar('🐱', '#fed7aa', '#f97316'),
  },
  {
    id: 'sun',
    name: 'Mặt Trời Tươi Vui',
    category: 'cute_nature',
    emoji: '☀️',
    dataUrl: createSvgAvatar('☀️', '#fef08a', '#eab308'),
  },
  {
    id: 'coffee',
    name: 'Tách Cà Phê Chill',
    category: 'daily_life',
    emoji: '☕',
    dataUrl: createSvgAvatar('☕', '#fed7aa', '#d97706'),
  },
  {
    id: 'cloud',
    name: 'Đám Mây Mộng Mơ',
    category: 'cute_nature',
    emoji: '☁️',
    dataUrl: createSvgAvatar('☁️', '#bae6fd', '#38bdf8'),
  },
  {
    id: 'panda',
    name: 'Gấu Trúc Dễ Thương',
    category: 'sweet_animals',
    emoji: '🐼',
    dataUrl: createSvgAvatar('🐼', '#e2e8f0', '#94a3b8'),
  },
  {
    id: 'star',
    name: 'Ngôi Sao May Mắn',
    category: 'cute_nature',
    emoji: '✨',
    dataUrl: createSvgAvatar('✨', '#fef08a', '#fbbf24'),
  },
  {
    id: 'clover',
    name: 'Cỏ Bốn Lá Bình An',
    category: 'cute_nature',
    emoji: '🍀',
    dataUrl: createSvgAvatar('🍀', '#a7f3d0', '#10b981'),
  },
  {
    id: 'penguin',
    name: 'Chim Cánh Cụt Nhỏ',
    category: 'sweet_animals',
    emoji: '🐧',
    dataUrl: createSvgAvatar('🐧', '#bae6fd', '#60a5fa'),
  },
  {
    id: 'bunny',
    name: 'Thỏ Trắng Tai Dài',
    category: 'sweet_animals',
    emoji: '🐰',
    dataUrl: createSvgAvatar('🐰', '#fce7f3', '#ec4899'),
  },
  {
    id: 'strawberry',
    name: 'Dâu Tây Ngọt Lịm',
    category: 'daily_life',
    emoji: '🍓',
    dataUrl: createSvgAvatar('🍓', '#fecdd3', '#f43f5e'),
  },
  {
    id: 'rainbow',
    name: 'Cầu Vồng Hy Vọng',
    category: 'cute_nature',
    emoji: '🌈',
    dataUrl: createSvgAvatar('🌈', '#ddd6fe', '#8b5cf6'),
  },
];
