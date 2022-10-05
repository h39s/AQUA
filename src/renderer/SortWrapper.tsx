import {
  useState,
  useLayoutEffect,
  useEffect,
  RefObject,
  ReactElement,
  useMemo,
} from 'react';
import { usePrevious } from './utils/utils';

interface IBoundingBoxMap {
  [key: string]: DOMRect;
}

type CustomElement = ReactElement & { ref?: RefObject<HTMLDivElement | null> };

// codesandbox.io/s/reorder-elements-with-slide-transition-and-react-hooks-flip-forked-wjojyy?file=/src/helpers/calculateBoundingBoxes.js:28-370
export const calculateBoundingBoxes = (
  refs: RefObject<HTMLDivElement | null>[]
) => {
  const boundingBoxes: IBoundingBoxMap = {};

  refs.forEach((ref) => {
    if (ref?.current) {
      const domNode = ref.current;
      const nodeBoundingBox = domNode.getBoundingClientRect();
      boundingBoxes[domNode.id] = nodeBoundingBox;
    }
  });

  return boundingBoxes;
};

const getRefs = (element?: CustomElement) => {
  if (!element) {
    return undefined;
  }

  if (element.ref) {
    return element.ref;
  }

  if (element.props.children) {
    return element.props.children.flatMap((c: CustomElement) => getRefs(c));
  }

  return undefined;
};

const SortWrapper = ({
  children = [],
  wrapperRef,
}: {
  children: CustomElement[];
  wrapperRef: RefObject<HTMLDivElement | null>;
}): JSX.Element => {
  const [boundingBox, setBoundingBox] = useState<IBoundingBoxMap>({});
  const [prevBoundingBox, setPrevBoundingBox] = useState<IBoundingBoxMap>({});

  const refs = useMemo(
    () => children.flatMap((child) => getRefs(child)).filter((c) => c),
    [children]
  );

  const prevRefs = usePrevious(refs);

  useEffect(() => {
    let handler: NodeJS.Timeout;
    const onScroll = () => {
      if (handler) {
        clearTimeout(handler);
      }
      handler = setTimeout(() => {
        // Update bounding boxes when a scroll event ends
        const newBoundingBox = calculateBoundingBoxes(refs);
        if (Object.keys(newBoundingBox).length) {
          setBoundingBox(newBoundingBox);
        }
        // Reset the previous bounding box value to prevent animation due to the scroll
        setPrevBoundingBox(newBoundingBox);
      }, 200); // default 200 ms
    };

    const element = wrapperRef.current;
    element?.addEventListener('scroll', onScroll);
    return () => {
      element?.removeEventListener('scroll', onScroll);
    };
  }, [refs, wrapperRef]);

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(refs);
    if (Object.keys(newBoundingBox).length) {
      setBoundingBox(newBoundingBox);
    }
  }, [refs]);

  useLayoutEffect(() => {
    const prev = calculateBoundingBoxes(prevRefs || []);
    setPrevBoundingBox(prev);
  }, [prevRefs]);

  useEffect(() => {
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;

    if (hasPrevBoundingBox) {
      refs.forEach((ref) => {
        if (ref?.current) {
          const domNode = ref.current;
          const firstBox = prevBoundingBox[domNode.id];
          const lastBox = boundingBox[domNode.id];
          // firstBox will be undefined for new filters
          const changeInX = firstBox ? firstBox.left - lastBox.left : 0;

          if (changeInX) {
            requestAnimationFrame(() => {
              // Before the DOM paints, invert child to old position
              domNode.style.transform = `translateX(${changeInX}px)`;
              domNode.style.transition = 'transform 0s';

              requestAnimationFrame(() => {
                // After the previous frame, remove
                // the transistion to play the animation
                domNode.style.transform = '';
                domNode.style.transition = 'transform 500ms';
              });
            });
          }
        }
      });
    }
  }, [boundingBox, prevBoundingBox, refs]);

  return <>{children}</>;
};

export default SortWrapper;
