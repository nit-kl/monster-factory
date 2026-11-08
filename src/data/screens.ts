export const screens = [
  { id: 'factory', label: '工場', description: '培養から出荷まで、ここが私たちの仕事場。' },
  { id: 'design', label: '設計', description: '身体・攻撃器官・防御器官の組み合わせを考える。' },
  { id: 'battle', label: '戦闘', description: '製造したモンスターの働きを、自動戦闘で見届ける。' },
  { id: 'story', label: '物語', description: '工場で働く仲間たちの声を聞く。' },
] as const;
export type ScreenId = typeof screens[number]['id'];
