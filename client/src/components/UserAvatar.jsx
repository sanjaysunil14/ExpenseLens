import { useState } from "react";

const UserAvatar = ({ name = "User", size = 36 }) => {
  const [imageError, setImageError] = useState(false);

  // Generate a consistent, clean SVG avatar based on the user's name
  const seed = encodeURIComponent(name.trim() || "User");
  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=0ea5e9,6366f1,8b5cf6,10b981,f59e0b&shapeColor=ffffff`;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="user-avatar-wrapper" style={{ width: size, height: size }}>
      {!imageError ? (
        <img
          src={avatarUrl}
          alt={name}
          className="user-avatar-img"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="user-avatar-fallback">
          {initials}
        </div>
      )}
      <span className="user-status-dot" title="Active Session" />
    </div>
  );
};

export default UserAvatar;
