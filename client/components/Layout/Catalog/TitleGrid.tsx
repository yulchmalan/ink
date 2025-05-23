"use client";

import TitleCard from "./TitleCard";

interface Props {
  titles: {
    id: string;
    name: string;
    alt_names?: { lang: string; value: string }[];
  }[];
}

export default function TitleGrid({ titles }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {titles?.map((title) => (
        <TitleCard
          key={title.id}
          id={title.id}
          name={title.name}
          alt_names={title.alt_names}
        />
      ))}
    </div>
  );
}
