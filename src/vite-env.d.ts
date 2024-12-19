/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CORUT_API_SERVER_URL: string
  readonly VITE_TENNINS_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
