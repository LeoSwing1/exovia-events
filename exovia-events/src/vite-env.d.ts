/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_SITE_URL?: string; readonly VITE_WHATSAPP_NUMBER?: string; readonly VITE_GA_ID?: string; readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_FACEBOOK_URL?: string;
  readonly VITE_YOUTUBE_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
