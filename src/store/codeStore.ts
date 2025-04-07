import { create } from 'zustand';

interface CodeState {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
}

export const useCodeStore = create<CodeState>(set => ({
  htmlCode: '',
  cssCode: '',
  jsCode: '',
  setHtmlCode: code => set({ htmlCode: code }),
  setCssCode: code => set({ cssCode: code }),
  setJsCode: code => set({ jsCode: code })
}));
