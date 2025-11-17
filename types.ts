
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  images?: { name: string }[];
}

export interface UploadedFile {
  file: File;
  name: string;
  dataUrl: string;
}

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
}
