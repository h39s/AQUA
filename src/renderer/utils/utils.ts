import { IFilter } from 'common/constants';
import { RefObject, useEffect, useMemo, useRef } from 'react';

export const getMaxIntegerDigitCount = (num: number) => {
  const absNum = Math.round(Math.abs(num));
  return absNum > 0 ? Math.floor(Math.log10(absNum)) + 1 : 1;
};

export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

export const sortHelper = (a: IFilter, b: IFilter) => a.frequency - b.frequency;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
export const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback: () => void, delay?: number) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (delay !== undefined) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return () => {};
  }, [delay]);
};

// Based on https://codeforgeek.com/throttle-function-javascript/
export const useThrottle = <Type>(
  fn: (arg: Type) => unknown,
  delay: number
) => {
  const lastCalled = useRef<number>(0);
  return (arg: Type) => {
    const now = new Date().getTime();
    if (now - lastCalled.current < delay) {
      return;
    }
    lastCalled.current = now;
    fn(arg);
  };
};

// https://github.com/teetotum/react-attached-properties/blob/master/examples/useClickOutside.js
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
) => {
  const handleClick = useMemo(() => {
    return (e: globalThis.MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return;
      }

      callback();
    };
  }, [callback, ref]);

  useEffect(() => {
    document.addEventListener('click', handleClick, true);

    return () => document.removeEventListener('click', handleClick, true);
  }, [handleClick]);
};

export const useFocusOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
) => {
  const handleFocus = useMemo(() => {
    return (e: globalThis.FocusEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return;
      }

      callback();
    };
  }, [callback, ref]);

  useEffect(() => {
    document.addEventListener('focusin', handleFocus, true);

    return () => document.removeEventListener('focusin', handleFocus, true);
  }, [handleFocus]);
};

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export const usePrevious = <T>(value: T): T | undefined => {
  const prevChildrenRef = useRef<T | undefined>();

  useEffect(() => {
    prevChildrenRef.current = value;
  }, [value]);

  return prevChildrenRef.current;
};
