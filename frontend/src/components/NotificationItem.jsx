import React from "react";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

const NotificationItem = ({ notification, darkMode, onMarkAsRead }) => {
  const iconMap = {
    warning: AlertCircle,
    reminder: Calendar,
    success: CheckCircle,
    transaction: DollarSign,
    tip: TrendingUp,
  };

  const colorMap = {
    warning: { bg: "bg-yellow-500/20", text: "text-yellow-500" },
    reminder: { bg: "bg-blue-500/20", text: "text-blue-500" },
    success: { bg: "bg-green-500/20", text: "text-green-500" },
    transaction: { bg: "bg-purple-500/20", text: "text-purple-500" },
    tip: { bg: "bg-pink-500/20", text: "text-pink-500" },
    default: { bg: "bg-gray-500/20", text: "text-gray-500" },
  };

  const Icon = iconMap[notification.type] || AlertCircle;
  const color = colorMap[notification.type] || colorMap.default;

  const unreadBg = !notification.read
    ? darkMode
      ? "bg-gray-800/50"
      : "bg-blue-50/50"
    : "";

  return (
    <div className={`p-4 hover:bg-gray-700/30 transition-colors ${unreadBg}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${color.bg}`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {notification.title}
              </h4>

              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {notification.message}
              </p>
            </div>

            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
            )}
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500">{notification.time}</span>

            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors
                  ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
