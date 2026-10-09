/** Where the visitor's light/dark choice is stored. Read before paint in app/layout.tsx. */
export const THEME_KEY='pamsika-theme';
export type Theme='light'|'dark';
/** Browser chrome colour per theme (meta theme-color). */
export const THEME_COLOR:Record<Theme,string>={dark:'#05080f',light:'#f4f6f9'};
