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
  onChange: (value: Value) => void;
}

export default function Range({ min, max, value, onChange }: RangeProps) {
  return (
    <div className={styles.range}>
      <RangeRail />
      <RangeTrack />
      <RangeThumb />
      <RangeThumb />
      <RangeMark />
    </div>
  );
}
