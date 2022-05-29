import { useEffect, useRef } from 'react';

// eslint-disable-next-line
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

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
