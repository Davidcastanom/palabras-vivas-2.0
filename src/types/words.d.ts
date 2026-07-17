export interface Word {
  id: number;
  word: string;
  syllables: string;
  img: string;
}

export interface Category {
  words: Word[];
}

export interface CategoryMeta {
  name: string;
  icon: string;
  cssColor: string;
}

export const categories: Record<string, Category>;
export const categoryMeta: Record<string, CategoryMeta>;
export const audioBaseUrl: string;

export function getWordsForCategory(categoryId: string): Word[];
