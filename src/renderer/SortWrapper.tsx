import {
  useState,
  useEffect,
  RefObject,
  ReactElement,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react';

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

const getRefs = (
  element?: CustomElement
): RefObject<HTMLDivElement | null>[] | RefObject<HTMLDivElement | null> => {
  if (!element) {
    return [];
  }

  if (element.ref) {
    return element.ref;
  }

  if (element.props.children) {
    return element.props.children.flatMap((c: CustomElement) => getRefs(c));
  }

  return [];
};

const isBoundingBoxDifferent = (
  boundMap1: IBoundingBoxMap,
  boundMap2: IBoundingBoxMap
) => {
  const keys1 = Object.keys(boundMap1);
  const keys2 = Object.keys(boundMap2);

  if (keys1.length !== keys2.length) {
    return true;
  }

  for (let i = 0; i < keys1.length; i += 1) {
    if (
      keys1[i] !== keys2[i] ||
      boundMap1[keys1[i]].left !== boundMap2[keys1[i]].left
    ) {
      return true;
    }
  }
  return false;
};

const SortWrapper = ({
  children = [],
  wrapperRef,
}: {
  children: CustomElement[];
  wrapperRef: RefObject<HTMLDivElement>;
}): JSX.Element => {
  const [boundingBoxes, setBoundingBoxes] = useState<IBoundingBoxMap>({});
  const prevBoundingBoxesRef = useRef<IBoundingBoxMap>({});

  // Latest scrollLeft snapshot. Snapshots are taken everytime children changes.
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  // The current scrollLeft value. This is NOT a snapshot. This updates everytime the user scrolls.
  const interScrollLeft = useRef<number>(0);
  // The previous scrollLeft snapshot.
  const prevScrollLeftRef = useRef<number>(0);

  const refs: RefObject<HTMLDivElement | null>[] = useMemo(
    () => children.flatMap((child) => getRefs(child)),
    [children]
  );

  useEffect(() => {
    let handler: NodeJS.Timeout;
    const onScroll = () => {
      if (handler) {
        clearTimeout(handler);
      }
      handler = setTimeout(() => {
        interScrollLeft.current = wrapperRef.current?.scrollLeft || 0;
      }, 100);
    };

    const element = wrapperRef.current;
    element?.addEventListener('scroll', onScroll);
    return () => {
      element?.removeEventListener('scroll', onScroll);
    };
  }, [wrapperRef]);

  useLayoutEffect(() => {
    // Update current children position information on first rerender thus triggering a second rerender
    // Note that this information will not be updated in other useEffects until a second rerender
    const newPositions = calculateBoundingBoxes(refs);
    if (Object.keys(newPositions).length) {
      setBoundingBoxes(newPositions);
    }
  }, [refs, wrapperRef]);

  useEffect(() => {
    // Take a snapshot of the scrollLeft value of the wrapperRef
    // Can only do this in a useEffect and not a useLayoutEffect because the wrapper element needs to have rendered first
    setScrollLeft(wrapperRef.current?.scrollLeft || 0);

    const prevBoundingBoxes = prevBoundingBoxesRef?.current || {};

    // Don't animate if the bounding box values haven't changed
    // First rerender will trigger this useEffect because refs changed, but this check will return false
    if (isBoundingBoxDifferent(prevBoundingBoxes, boundingBoxes)) {
      // Most of the time, wrapperRef.scrollLeft is equal to interScrollLeft, but in the special case
      // where the user scrolls all the way to the right and deletes a slider, wrapperRef.scrollLeft
      // will have been reduced because wrapperRef.scrollWidth was reduced.
      // Since we have no way of knowing if wrapperRef.scrollLeft was reduced from a
      // reduced scrollWidth without tracking interScrollLeft, we will use interScrollLeft.
      const scrollLeftDiff =
        interScrollLeft.current - prevScrollLeftRef.current;
      refs.forEach((ref) => {
        if (ref?.current) {
          const domNode = ref.current;
          const firstBox = prevBoundingBoxes[domNode.id];
          const lastBox = boundingBoxes[domNode.id];
          // firstBox will be undefined for new filters
          const changeInX = firstBox
            ? firstBox.left - (lastBox.left + scrollLeftDiff)
            : 0;

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
  }, [boundingBoxes, refs, wrapperRef]);

  useEffect(() => {
    // Update previous children position information on second rerender
    prevBoundingBoxesRef.current = boundingBoxes;
  }, [boundingBoxes]);

  useEffect(() => {
    // Update previous scrollLeft information on second rerender
    prevScrollLeftRef.current = scrollLeft;
  }, [scrollLeft]);

  return <>{children}</>;
};

export default SortWrapper;
