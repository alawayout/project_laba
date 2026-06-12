import { Avatar } from "@/components/ui";
import type { CurrentUser } from "@/lib/types";

interface ProfileChipProps {
  user: CurrentUser;
}

/** Signed-in user: name + role + avatar (text hidden on mobile). */
export function ProfileChip({ user }: ProfileChipProps) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="hidden text-right md:block">
        <div className="text-md">{user.name}</div>
        <div className="text-sm text-fg-secondary">{user.roleLabel}</div>
      </div>
      <Avatar src={user.avatarUrl} alt={user.name} size={56} />
    </div>
  );
}
