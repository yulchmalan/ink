import React from "react";

type TrashProps = {
  className?: string;
};

export default function Trash({ className }: TrashProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 24"
      fill="none"
      className={className}
    >
      <path
        d="M13 3H19M7 6H25M23 6L22.2987 16.5193C22.1935 18.0975 22.1409 18.8867 21.8 19.485C21.4999 20.0118 21.0472 20.4353 20.5017 20.6997C19.882 21 19.0911 21 17.5093 21H14.4907C12.9089 21 12.118 21 11.4983 20.6997C10.9528 20.4353 10.5001 20.0118 10.2 19.485C9.85911 18.8867 9.8065 18.0975 9.70129 16.5193L9 6M14 10.5V15.5M18 10.5V15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
