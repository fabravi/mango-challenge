"use client";
import Range from "@/ui/Range";

import { useState } from "react";

interface Exercise2Props {
  marks: number[];
}

export default function Exercise2({ marks }: Exercise2Props) {
  const min = marks[0];
  const max = marks.at(-1)!;

  const [value, setValue] = useState({ min, max });

  return (
    <div>
      <Range
        min={min}
        max={max}
        marks={marks}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
