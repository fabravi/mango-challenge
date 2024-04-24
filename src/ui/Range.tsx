"use client";

import { use, useEffect, useRef, useState } from "react";
import RangeMark from "./RangeMark";
import RangeRail from "./RangeRail";
import RangeThumb from "./RangeThumb";
import RangeTrack from "./RangeTrack";
import styles from "./range.module.scss";

interface Value {
  min: number;
  max: number;
}

interface RangeProps {
  min: number;
  max: number;
  value: Value;
  onChange?: (value: Value) => void;
}

export default function Range({
  min,
  max,
  value: initialValue,
  onChange,
}: RangeProps) {
  const range = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<Value>(initialValue);
  const [rangePositions, setRangePositions] = useState<any>();
  //   const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const activeThumb = useRef<string>();
  const valueRef = useRef({ ...value }).current;

  const distance = (x1, x2) => {
    return Math.abs(x1 - x2);
  };

  const minDistancePointKey = (x, points: { [key: string]: number }) => {
    const keys = Object.keys(points);
    let minDistance = distance(x, points[keys[0]]);
    let minKey = keys[0];
    let sameDistance = {};

    for (let i = 1; i < keys.length; i++) {
      const key = keys[i];
      const dist = distance(x, points[key]);
      if (dist < minDistance) {
        minDistance = dist;
        minKey = key;
      } else if (dist === minDistance) {
        sameDistance[key] = dist;
        console.log("sameDistance", sameDistance);
      }
    }

    if (Object.keys(sameDistance).length > 0) {
      console.log(
        "sameDistance values",
        x > points.min,
        points.min,
        points.max,
      );
      minKey = x > points.min ? "max" : "min";
    }

    console.log("minDistancePointKey", minKey);
    return minKey;
  };

  useEffect(() => {
    if (!range.current) return;

    const { current } = range;

    const left = current.getBoundingClientRect().left;
    const width = current.getBoundingClientRect().width;

    current.addEventListener("mousedown", (event) => {
      isDraggingRef.current = true;
      event.preventDefault();
      const relativePosition = event.clientX - left;
      const percentageLeft = (relativePosition / width) * 100;

      const minKey = minDistancePointKey(percentageLeft, {
        min: valueRef.min,
        max: valueRef.max,
      });
      document.body.style.cursor = "grabbing";
      current.style.cursor = "grabbing";

      console.log("minKey", minKey);
      activeThumb.current = minKey;

      const pos = Math.max(Math.min(percentageLeft, 100), 0);

      if (activeThumb.current === "min") {
        if (pos >= valueRef.max) {
          console.log("returning");
          return;
        }
      } else {
        if (pos <= valueRef.min) {
          console.log("returning");
        }
      }
      console.log(event.clientX, event);
      valueRef[activeThumb.current as string] = pos;
      setValue((value) => ({
        ...value,
        [activeThumb.current as string]: pos,
      }));
    });

    document.addEventListener("mousemove", (event) => {
      if (!isDraggingRef.current) return;
      event.preventDefault();

      const relativePosition = event.clientX - left;
      const percentageLeft = (relativePosition / width) * 100;
      const pos = Math.max(Math.min(percentageLeft, 100), 0);
      if (activeThumb.current === "min") {
        console.log("check crossing", pos, value.max, value.min);
        if (pos >= valueRef.max) {
          console.log("returning");
          valueRef.min = valueRef.max;
          return setValue((value) => ({
            ...value,
            min: valueRef.max,
          }));
        }
      } else {
        if (pos <= valueRef.min) {
          console.log("returning");
          valueRef.max = valueRef.min;
          return setValue((value) => ({
            ...value,
            max: valueRef.min,
          }));
        }
      }
      console.log(event.clientX, event);
      valueRef[activeThumb.current as string] = pos;
      setValue((value) => ({
        ...value,
        [activeThumb.current as string]: pos,
      }));
    });

    document.addEventListener("mouseup", (event) => {
      document.body.style.cursor = "auto";
      current.style.cursor = "pointer";

      setValue((value) => ({
        ...value,
        [activeThumb.current as string]:
          valueRef[activeThumb.current as string],
      }));

      isDraggingRef.current = false;
    });

    setRangePositions({ left, width });
  }, []);

  return (
    <>
      <div className={styles.range} ref={range}>
        <RangeRail />
        <RangeTrack left={value.min} width={value.max - value.min} />
        <RangeThumb left={value.min} isDragging={isDraggingRef.current} />
        <RangeThumb left={value.max} isDragging={isDraggingRef.current} />
        <RangeMark />
      </div>
      <pre>{JSON.stringify({ min, max, value }, null, 2)}</pre>
      <pre>{JSON.stringify(rangePositions, null, 2)}</pre>
    </>
  );
}
