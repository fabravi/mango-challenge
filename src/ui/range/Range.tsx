"use client";
import RangeMark from "@/ui/range/rangemark/RangeMark";
import RangeRail from "@/ui/range/rangerail/RangeRail";
import RangeThumb from "@/ui/range/rangethumb/RangeThumb";
import RangeTrack from "@/ui/range/rangetrack/RangeTrack";
import RangeInput from "@/ui/range/rangeinput/RangeInput";

import styles from "./range.module.scss";
import useRange from "@/hooks/useRange";

import { Thumbs } from "@/types/Thumbs";
import { Value } from "@/types/Value";

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
        onChange={(min: number) => onInputChange(Thumbs.MIN, min)}
        readOnly={readOnly}
      />
      <div className={styles.range} ref={rangeRef}>
        <RangeRail />
        <RangeTrack left={positionMin} width={positionMax - positionMin} />
        <RangeThumb
          left={positionMin}
          isActive={activeThumb === "min"}
          setActive={(state) => setActive(state ? Thumbs.MIN : null)}
        />
        <RangeThumb
          left={positionMax}
          isActive={activeThumb === "max"}
          setActive={(state) => setActive(state ? Thumbs.MAX : null)}
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
        onChange={(max: number) => onInputChange(Thumbs.MAX, max)}
        readOnly={readOnly}
      />
    </div>
  );
}
