export interface ToastOptions {
  title?: string;
  message?: string;
  duration?: number;
  showProgressBar?: boolean;
  closeButton?: boolean;
  tapToDismiss?: boolean;
  enableHtml?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export interface ErrorConfig {
  showToast?: boolean;
  customMessage?: string;
  redirectTo?: string;
  logError?: boolean;
}