import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./rangeinput.module.scss";

interface RangeInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}

export default function RangeInput({
  name,
  value: valueProp,
  min,
  max,
  onChange,
  readOnly,
}: RangeInputProps) {
  const [value, setValue] = useState(valueProp?.toFixed(2));
  const [error, setError] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setValue(valueProp?.toFixed(2));
  }, [valueProp]);

  const isValid = useCallback(
    (newValue: string) => {
      const num = parseFloat(newValue);
      return !isNaN(num) && num >= min && num <= max;
    },
    [min, max],
  );

  const updateValue = (newValue: string) => {
    if (timeout.current) clearTimeout(timeout.current);
    setError(false);
    setValue(newValue);

    timeout.current = setTimeout(() => {
      const num = parseFloat(newValue);
      if (!isValid(newValue)) {
        setError(true);
        return;
      }
      onChange(num);
    }, 300);
  };

  const onBlur = () => {
    if (value === "") {
      setValue(valueProp?.toFixed(2));
      setError(!isValid(valueProp?.toFixed(2)));
    }
  };

  const readOnlyProps = useMemo(() => {
    return readOnly
      ? {
          readOnly: true,
          tabIndex: -1,
        }
      : {};
  }, [readOnly]);

  return (
    <fieldset className={styles.fieldset}>
      <label htmlFor={name} className={error ? styles.error : ""}>
        €
      </label>
      <input
        type="number"
        id={name}
        data-testid={name}
        className={`${styles.input} ${error ? styles.error : ""}`}
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          updateValue(event.target.value);
        }}
        onFocus={(event) => event.target.select()}
        onBlur={() => onBlur()}
        {...readOnlyProps}
      />
    </fieldset>
  );
}
