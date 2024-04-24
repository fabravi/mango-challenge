"use client";

import { useEffect, useRef, useState } from "react";

import RangeClass from "@/domain/Range";

import RangeMark from "@/ui/RangeMark";
import RangeRail from "@/ui/RangeRail";
import RangeThumb from "@/ui/RangeThumb";
import RangeTrack from "@/ui/RangeTrack";
import RangeInput from "@/ui/RangeInput";

import styles from "./range.module.scss";
import { flushSync } from "react-dom";

interface Value {
  min: number;
  max: number;
}

interface RangeProps {
  min: number;
  max: number;
  value: Value;
  marks?: number[];
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

  const addTransitionStyles = () => {
    if (!range.current) return;
    const { current } = range;
    current
      .querySelector("[role='slider-track']")
      ?.classList.add("transitions-active");
    current
      .querySelectorAll("[role='slider-thumb']")
      .forEach((item) => item?.classList.add("transitions-active"));
  };

  const removeTransitionStyles = () => {
    if (!range.current) return;
    const { current } = range;
    current
      .querySelector("[role='slider-track']")
      ?.classList.remove("transitions-active");
    current
      .querySelectorAll("[role='slider-thumb']")
      .forEach((item) => item?.classList.remove("transitions-active"));
  };

  useEffect(() => {
    if (!range.current) return;

    const { current } = range;

    const left = current.getBoundingClientRect().left;
    const width = current.getBoundingClientRect().width;

    const handlers = {
      range: {
        mousedown: (event: MouseEvent) => {
          const val = transformPositionToValue(left, width, event.clientX);
          rangeRef.setCloserThumbActive(val);
          rangeRef.setThumbValue(val);
          setValue({ ...rangeRef.value });
          addTransitionStyles();
          event.preventDefault();
          document.body.style.cursor = "grabbing";
          current.style.cursor = "grabbing";
        },
        mousemove: (event: MouseEvent) => {
          const val = transformPositionToValue(left, width, event.clientX);
          const activeThumb = rangeRef.getCloserThumb(val);
          setActiveThumb(activeThumb);
          removeTransitionStyles();
        },
        mouseleave: (event: MouseEvent) => {
          setActiveThumb(null);
        },
      },
      document: {
        mousemove: (event: MouseEvent) => {
          const val = transformPositionToValue(left, width, event.clientX);
          rangeRef.setThumbValue(val);
          if (rangeRef.activeThumb === null) return;
          setValue({ ...rangeRef.value });
        },
        mouseup: (event: MouseEvent) => {
          rangeRef.activeThumb = null;
          document.body.style.cursor = "auto";
          current.style.cursor = "pointer";
        },
        keydown: (event: KeyboardEvent) => {
          const activeThumb = rangeRef.activeThumb;
          console.log("keydown", rangeRef.value, rangeRef.activeThumb);
          if (activeThumb === null) return;
          if (event.key === "ArrowUp" || event.key === "ArrowRight") {
            console.log("setThumbValue", rangeRef.value);
            rangeRef.setThumbValue(rangeRef.value[activeThumb] + 1);
            setValue({ ...rangeRef.value });
          }
          if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
            console.log("setThumbValue", rangeRef.value);
            rangeRef.setThumbValue(rangeRef.value[activeThumb] - 1);
            setValue({ ...rangeRef.value });
          }
        },
      },
    };

    for (const [key, value] of Object.entries(handlers.range)) {
      console.log("addEventListener", key);
      current.addEventListener(key, value as EventListener);
    }

    for (const [key, value] of Object.entries(handlers.document)) {
      document.addEventListener(key, value as EventListener);
    }

    return () => {
      for (const [key, value] of Object.entries(handlers.range)) {
        current.removeEventListener(key, value as EventListener);
      }

      for (const [key, value] of Object.entries(handlers.document)) {
        document.removeEventListener(key, value as EventListener);
      }
    };
  }, []);

  const setActive = (activeThumb: "min" | "max" | null) => {
    rangeRef.setActiveThumb(activeThumb);
  };

  const readOnly = marks.length > 0;

  return (
    <div className={styles.container}>
      <RangeInput
        name="min"
        min={min}
        max={value.max}
        value={value.min}
        onChange={(min: number) => setValue((prev) => ({ ...prev, min }))}
        readOnly={readOnly}
      />
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
          setActive={(state) => setActive(state ? "min" : null)}
        />
        <RangeThumb
          left={transformValueToPosition(value.max)}
          isActive={activeThumb === "max"}
          setActive={(state) => setActive(state ? "max" : null)}
        />
        {marks.map((mark) => (
          <RangeMark
            key={mark}
            left={transformValueToPosition(mark)}
            value={mark}
          />
        ))}
      </div>
      <RangeInput
        name="max"
        min={value.min}
        max={max}
        value={value.max}
        onChange={(max: number) => setValue((prev) => ({ ...prev, max }))}
        readOnly={readOnly}
      />
    </div>
  );
}
