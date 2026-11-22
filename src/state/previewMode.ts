/// <reference types="vite/client" />

export const previewMode = import.meta.env.DEV
  && typeof window !== 'undefined'
  && new URLSearchParams(window.location.search).get('debug') === '1';

