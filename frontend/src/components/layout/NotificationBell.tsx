import { Bell } from "lucide-react";

interface NotificationBellProps {
  hasUnread?: boolean;
  onClick?: () => void;
}

/** Round notification button with an unread dot. */
export function NotificationBell({
  hasUnread = false,
  onClick,
}: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Уведомления"
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-surface-1 text-fg-tertiary transition hover:bg-surface-4"
    >
      <Bell className="h-7 w-7" />
      {hasUnread && (
        <span className="absolute right-4 top-3.5 h-2.5 w-2.5 rounded-full border-2 border-surface-1 bg-brand-red-alt" />
      )}
    </button>
  );
}
