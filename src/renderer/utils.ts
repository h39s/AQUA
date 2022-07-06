import { RefObject, useEffect, useMemo, useRef } from 'react';

export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

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
