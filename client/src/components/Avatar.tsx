import React from "react";

interface userNameProps {
  username: string;
  color?: string;
  isUser: boolean;
  size?: number;
}
const Avatar = ({ username, size, color, isUser }: userNameProps) => {
  console.log(color);
  const dynamicColorClass = isUser ? `bg-red-600` : "bg-blue-500";
  return (
    <div className="avatar placeholder">
      <div
        className={` text-neutral-content rounded-full  ${
          size ? `h-${size} w-${size}` : "h-7 w-7"
        }  ${dynamicColorClass}   `}
      >
        <span className="text-sm">{username[0].toUpperCase()}</span>
      </div>
    </div>
  );
};

export default Avatar;
