import React from "react";

type CrossProps = {
  className?: string;
};

export default function Cross({ className }: CrossProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M14.1667 5.83337L5.83334 14.1667M5.83334 5.83337L14.1667 14.1667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
