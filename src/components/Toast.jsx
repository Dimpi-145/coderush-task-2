import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-lg border shadow-lg flex items-start gap-3 bg-white dark:bg-gray-900 transition-all text-xs ${
        isSuccess
          ? 'border-emerald-200 dark:border-emerald-900 text-gray-900 dark:text-gray-100'
          : isError
          ? 'border-red-200 dark:border-red-900 text-gray-900 dark:text-gray-100'
          : 'border-blue-200 dark:border-blue-900 text-gray-900 dark:text-gray-100'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        ) : (
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
          {toast.title}
        </h4>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 leading-normal">
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
        aria-label="Dismiss Notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
