// src/components/Notification.jsx
import { useEffect, useState, createContext, useContext } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
  Trash2,
} from "lucide-react";

// Context untuk Notification Manager
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

// Notification Component untuk toast notifications
const ToastNotification = ({
  id,
  message,
  type = "info",
  duration = 4000,
  onClose,
  title,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 100 / (duration / 50);
      });
    }, 50);

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(id), 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose, id]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      icon: "text-green-500 dark:text-green-400",
      progress: "bg-green-500 dark:bg-green-400",
      title: "text-green-800 dark:text-green-200",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      icon: "text-red-500 dark:text-red-400",
      progress: "bg-red-500 dark:bg-red-400",
      title: "text-red-800 dark:text-red-200",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      icon: "text-yellow-500 dark:text-yellow-400",
      progress: "bg-yellow-500 dark:bg-yellow-400",
      title: "text-yellow-800 dark:text-yellow-200",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      icon: "text-blue-500 dark:text-blue-400",
      progress: "bg-blue-500 dark:bg-blue-400",
      title: "text-blue-800 dark:text-blue-200",
    },
  };

  const currentColor = colors[type];

  if (!isVisible) return null;

  return (
    <div className="max-w-sm w-full animate-slideIn">
      <div
        className={`${currentColor.bg} ${currentColor.border} border-2 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 overflow-hidden backdrop-blur-sm backdrop-filter`}
      >
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-200/50 dark:bg-gray-700/50">
          <div
            className={`h-full ${currentColor.progress} transition-all duration-50 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Notification Content */}
        <div className="p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`${currentColor.icon} flex-shrink-0 mt-0.5`}>
              {icons[type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold ${currentColor.title} text-sm`}>
                {title || type.charAt(0).toUpperCase() + type.slice(1)}
              </p>
              <p className={`text-sm ${currentColor.text} mt-1 break-words`}>
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(id), 300);
            }}
            className={`ml-2 flex-shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors ${currentColor.text}`}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, config }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 300);
  };

  if (!isOpen && !isVisible) return null;

  const {
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning",
    icon = <AlertTriangle className="w-6 h-6" />,
    confirmButtonColor = "",
    confirmButtonText = "",
  } = config || {};

  const typeColors = {
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: "text-yellow-500 dark:text-yellow-400",
      button:
        "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white",
      ring: "ring-yellow-500/20",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-900/30",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-500 dark:text-red-400",
      button:
        "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white",
      ring: "ring-red-500/20",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-500 dark:text-blue-400",
      button:
        "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white",
      ring: "ring-blue-500/20",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800",
      icon: "text-green-500 dark:text-green-400",
      button:
        "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
      ring: "ring-green-500/20",
    },
  };

  const colors = typeColors[type];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
          isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
        }`}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={`fixed inset-0 z-[201] flex items-center justify-center p-4 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`${colors.bg} ${
            colors.border
          } border rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${colors.icon} bg-white/50 dark:bg-black/20`}
                >
                  {icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Message */}
          <div className="px-6 py-2">
            <p className="text-gray-700 dark:text-gray-300">{message}</p>
          </div>

          {/* Actions */}
          <div className="p-6 pt-4 flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all hover:shadow-lg ${
                confirmButtonColor || colors.button
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                colors.ring
              }`}
            >
              {confirmButtonText || confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [dialog, setDialog] = useState({
    isOpen: false,
    config: null,
    onConfirm: null,
  });

  // Fungsi untuk menambah toast notification
  const showNotification = (message, type = "info", duration = 4000, title) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      message,
      type,
      duration,
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after duration + buffer
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration + 500);

    return id;
  };

  // Fungsi untuk menghapus notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fungsi untuk show confirmation dialog
  const showConfirmation = (config) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        config,
        onConfirm: (result) => {
          setDialog({ isOpen: false, config: null, onConfirm: null });
          resolve(result);
        },
      });
    });
  };

  // Fungsi khusus untuk delete transaction
  const confirmDelete = async (onDelete, itemName = "transaction") => {
    const result = await showConfirmation({
      title: `Delete ${itemName}`,
      message: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
      type: "danger",
      icon: <Trash2 className="w-6 h-6" />,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmButtonText: "Yes, Delete",
    });

    if (result) {
      try {
        await onDelete();
        showNotification(
          `${
            itemName.charAt(0).toUpperCase() + itemName.slice(1)
          } deleted successfully`,
          "success",
          4000,
          "Success"
        );
        return true;
      } catch (error) {
        showNotification(
          `Failed to delete ${itemName}`,
          "error",
          4000,
          "Error"
        );
        return false;
      }
    }
    return false;
  };

  // Handle dialog confirm
  const handleDialogConfirm = () => {
    dialog.onConfirm?.(true);
  };

  // Handle dialog cancel
  const handleDialogClose = () => {
    dialog.onConfirm?.(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        removeNotification,
        showConfirmation,
        confirmDelete,
      }}
    >
      {children}

      {/* Toast Notifications Container */}
      <div className="fixed top-6 right-6 z-[100] space-y-3 max-w-sm">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="animate-slideIn"
            style={{
              animationDelay: `${index * 50}ms`,
              animationDuration: "0.3s",
            }}
          >
            <ToastNotification
              id={notification.id}
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              title={notification.title}
              onClose={removeNotification}
            />
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialog.isOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        config={dialog.config}
      />
    </NotificationContext.Provider>
  );
};

// Hook untuk penggunaan yang mudah
export const useNotificationHook = () => {
  const { showNotification, confirmDelete } = useNotification();

  return {
    // Toast notifications
    success: (message, duration = 4000) =>
      showNotification(message, "success", duration, "Success"),
    error: (message, duration = 4000) =>
      showNotification(message, "error", duration, "Error"),
    warning: (message, duration = 4000) =>
      showNotification(message, "warning", duration, "Warning"),
    info: (message, duration = 4000) =>
      showNotification(message, "info", duration, "Info"),

    // Confirmation
    confirmDelete,
  };
};

// Komponen utama untuk export default
const Notification = () => {
  return null; // Komponen ini hanya sebagai wrapper
};

export default Notification;
