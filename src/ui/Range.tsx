"use client";

import RangeMark from "@/ui/RangeMark";
import RangeRail from "@/ui/RangeRail";
import RangeThumb from "@/ui/RangeThumb";
import RangeTrack from "@/ui/RangeTrack";
import RangeInput from "@/ui/RangeInput";

import styles from "./range.module.scss";
import useRange from "@/hooks/useRange";

interface Value {
  min: number;
  max: number;
}

interface RangeProps {
  min: number;
  max: number;
  value: Value;
  marks?: number[];
  onChange: (value: Value) => void;
}

export default function Range({
  min,
  max,
  value: initialValue,
  marks = [],
  onChange,
}: RangeProps) {
  const {
    rangeRef,
    value,
    activeThumb,
    setActive,
    onInputChange,
    getPosition,
  } = useRange(initialValue, min, max, marks, onChange);

  const readOnly = marks.length > 0;
  const positionMin = getPosition(value.min);
  const positionMax = getPosition(value.max);

  return (
    <div className={styles.container}>
      <RangeInput
        name="min"
        min={min}
        max={value.max}
        value={value.min}
        onChange={(min: number) => onInputChange("min", min)}
        readOnly={readOnly}
      />
      <div className={styles.range} ref={rangeRef}>
        <RangeRail />
        <RangeTrack left={positionMin} width={positionMax - positionMin} />
        <RangeThumb
          left={positionMin}
          isActive={activeThumb === "min"}
          setActive={(state) => setActive(state ? "min" : null)}
        />
        <RangeThumb
          left={positionMax}
          isActive={activeThumb === "max"}
          setActive={(state) => setActive(state ? "max" : null)}
        />
        {marks.map((mark) => (
          <RangeMark key={mark} left={getPosition(mark)} />
        ))}
      </div>
      <RangeInput
        name="max"
        min={value.min}
        max={max}
        value={value.max}
        onChange={(max: number) => onInputChange("max", max)}
        readOnly={readOnly}
      />
    </div>
  );
}
