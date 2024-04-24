"use client";

import { use, useEffect, useRef, useState } from "react";
import RangeMark from "./RangeMark";
import RangeRail from "./RangeRail";
import RangeThumb from "./RangeThumb";
import RangeTrack from "./RangeTrack";
import styles from "./range.module.scss";
import RangeClass from "@/domain/Range";

interface Value {
  min: number;
  max: number;
}

interface RangeProps {
  min: number;
  max: number;
  value: Value;
  marks: number[];
  onChange?: (value: Value) => void;
}

export default function Range({
  min,
  max,
  value: initialValue,
  marks = [],
  onChange,
}: RangeProps) {
  const range = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<Value>(initialValue);
  const [rangePositions, setRangePositions] = useState<any>();
  const isDraggingRef = useRef(false);
  const [activeThumb, setActiveThumb] = useState<string | null>(null);

  const rangeRef = useRef<RangeClass>(
    new RangeClass(min, max, initialValue, marks),
  ).current;

  const transformPositionToValue = (
    left: number,
    width: number,
    position: number,
  ) => {
    // move to class
    return Math.min(Math.max(((position - left) / width) * max, min), max);
  };

  const transformValueToPosition = (value: number) => {
    console.log(
      "transformValueToPosition",
      value,
      min,
      max,
      (value / (max - min)) * 100,
    );
    return ((value - min) / (max - min)) * 100;
  };

  useEffect(() => {
    if (!range.current) return;

    const { current } = range;

    const left = current.getBoundingClientRect().left;
    const width = current.getBoundingClientRect().width;

    current.addEventListener("mousedown", (event) => {
      const val = transformPositionToValue(left, width, event.clientX);
      rangeRef.setCloserThumbActive(val);
      rangeRef.setThumbValue(val);
      console.log("mousedown", rangeRef.activeThumb, rangeRef.value);
      setValue({ ...rangeRef.value });

      event.preventDefault();
      document.body.style.cursor = "grabbing";
      current.style.cursor = "grabbing";
    });

    current.addEventListener("mousemove", (event) => {
      const val = transformPositionToValue(left, width, event.clientX);
      const activeThumb = rangeRef.getCloserThumb(val);
      setActiveThumb(activeThumb);
    });

    current.addEventListener("mouseleave", (event) => {
      setActiveThumb(null);
    });

    document.addEventListener("mousemove", (event) => {
      const val = transformPositionToValue(left, width, event.clientX);
      rangeRef.setThumbValue(val);
      console.log("mousedown", rangeRef.activeThumb, rangeRef.value);
      setValue({ ...rangeRef.value });
    });

    document.addEventListener("mouseup", (event) => {
      rangeRef.activeThumb = null;
      document.body.style.cursor = "auto";
      current.style.cursor = "pointer";
    });

    setRangePositions({ left, width });
  }, []);

  return (
    <>
      <div className={styles.range} ref={range}>
        <RangeRail />
        <RangeTrack
          left={transformValueToPosition(value.min)}
          width={
            transformValueToPosition(value.max) -
            transformValueToPosition(value.min)
          }
        />
        <RangeThumb
          left={transformValueToPosition(value.min)}
          isActive={activeThumb === "min"}
        />
        <RangeThumb
          left={transformValueToPosition(value.max)}
          isActive={activeThumb === "max"}
        />
        {marks.map((mark) => (
          <RangeMark
            key={mark}
            left={transformValueToPosition(mark)}
            value={mark}
          />
        ))}
      </div>
      <pre>{JSON.stringify({ min, max, value }, null, 2)}</pre>
      <pre>{JSON.stringify(rangePositions, null, 2)}</pre>
    </>
  );
}
