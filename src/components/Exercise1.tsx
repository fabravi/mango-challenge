"use client";
import Range from "@/ui/Range";

import { useState } from "react";

interface Exercise1Props {
  min: number;
  max: number;
}

export default function Exercise1({ min, max }: Exercise1Props) {
  const [value, setValue] = useState({ min, max });

  return (
    <div>
      <Range min={min} max={max} value={value} onChange={setValue} />
    </div>
  );
}
