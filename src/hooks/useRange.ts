import { Value } from "@/types/Value";
import { useEffect, useRef, useState } from "react";
import RangeClass from "@/domain/Range";

export default function useRange(
  initialValue: Value,
  min: number,
  max: number,
  marks: number[],
  onChange: (value: Value) => void,
) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<Value>(initialValue);
  const [activeThumb, setActiveThumb] = useState<string | null>(null);

  const rangeInstanceRef = useRef<RangeClass>(
    new RangeClass(min, max, initialValue, marks),
  ).current;

  const transformPositionToValue = (
    left: number,
    width: number,
    position: number,
  ) => {
    return ((position - left) / width) * max;
  };

  const transformValueToPosition = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const addTransitionStyles = () => {
    if (!rangeRef.current) return;
    const { current } = rangeRef;
    current
      .querySelector("[role='slider-track']")
      ?.classList.add("transitions-active");
    current
      .querySelectorAll("[role='slider-thumb']")
      .forEach((item) => item?.classList.add("transitions-active"));
  };

  const removeTransitionStyles = () => {
    if (!rangeRef.current) return;
    const { current } = rangeRef;
    current
      .querySelector("[role='slider-track']")
      ?.classList.remove("transitions-active");
    current
      .querySelectorAll("[role='slider-thumb']")
      .forEach((item) => item?.classList.remove("transitions-active"));
  };

  const updateValue = (value: Value) => {
    setValue(value);
    onChange(value);
  };

  useEffect(() => {
    if (!rangeRef.current) return;

    const { current } = rangeRef;

    const left = current.getBoundingClientRect().left;
    const width = current.getBoundingClientRect().width;

    const handlers = {
      range: {
        mousedown: (event: MouseEvent) => {
          const val = transformPositionToValue(left, width, event.clientX);
          rangeInstanceRef.setCloserThumbActive(val);
          rangeInstanceRef.setThumbValue(val);
          updateValue({ ...rangeInstanceRef.value });
          addTransitionStyles();
          event.preventDefault();
          document.body.style.cursor = "grabbing";
          current.style.cursor = "grabbing";
        },
        mousemove: (event: MouseEvent) => {
          const val = transformPositionToValue(left, width, event.clientX);
          const activeThumb = rangeInstanceRef.getCloserThumb(val);
          setActiveThumb(activeThumb);
          removeTransitionStyles();
        },
        mouseleave: (event: MouseEvent) => {
          setActiveThumb(null);
        },
      },
      document: {
        mousemove: (event: MouseEvent) => {
          if (document.activeElement?.role === "slider-thumb") return;
          const val = transformPositionToValue(left, width, event.clientX);
          rangeInstanceRef.setThumbValue(val);
          if (rangeInstanceRef.activeThumb === null) return;
          updateValue({ ...rangeInstanceRef.value });
        },
        mouseup: (event: MouseEvent) => {
          rangeInstanceRef.activeThumb = null;
          document.body.style.cursor = "auto";
          current.style.cursor = "pointer";
        },
        keydown: (event: KeyboardEvent) => {
          const activeThumb = rangeInstanceRef.activeThumb;
          if (activeThumb === null) return;
          if (event.key === "ArrowUp" || event.key === "ArrowRight") {
            rangeInstanceRef.nudgeThumbValueUp();
            updateValue({ ...rangeInstanceRef.value });
          }
          if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
            rangeInstanceRef.nudgeThumbValueDown();
            updateValue({ ...rangeInstanceRef.value });
          }
        },
      },
    };

    for (const [key, value] of Object.entries(handlers.range)) {
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

  const onInputChange = (name: "min" | "max", value: number) => {
    rangeInstanceRef.activeThumb = name;
    rangeInstanceRef.setThumbValue(value);
    updateValue({ ...rangeInstanceRef.value });
  };

  const setActive = (activeThumb: "min" | "max" | null) => {
    rangeInstanceRef.activeThumb = activeThumb;
  };

  return {
    rangeRef,
    value,
    activeThumb,
    onInputChange,
    setActive,
    getPosition: transformValueToPosition,
  };
}
