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

  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const prevScrollLeftRef = useRef<number>(0);

  const [scrollWidth, setScrollWidth] = useState<number>(0);
  const prevScrollWidthRef = useRef<number>(0);

  const refs: RefObject<HTMLDivElement | null>[] = useMemo(
    () => children.flatMap((child) => getRefs(child)),
    [children]
  );

  useLayoutEffect(() => {
    // Update current children position information on first rerender thus triggering a second rerender
    // Note that this information will not be updated in other useEffects until a second rerender
    const newPositions = calculateBoundingBoxes(refs);
    if (Object.keys(newPositions).length) {
      setBoundingBoxes(newPositions);
    }
  }, [refs, wrapperRef]);

  useEffect(() => {
    // Compute and update the scrollLeft value of the wrapperRef
    // Can only do this in a useEffect and not a useLayoutEffect because the wrapper element needs to have rendered first
    const currentScroll = wrapperRef.current?.scrollLeft || 0;
    setScrollLeft(currentScroll);
    setScrollWidth(wrapperRef.current?.scrollWidth || 650);

    const prevBoundingBoxes = prevBoundingBoxesRef?.current || {};

    const sliderDeleted =
      Object.keys(boundingBoxes).length -
        Object.keys(prevBoundingBoxes).length <
      0;

    const rightSideOverflow = wrapperRef.current
      ? prevScrollWidthRef.current -
        (wrapperRef.current.scrollLeft + wrapperRef.current.clientWidth)
      : 0;

    // Don't animate if the bounding box values haven't changed
    // First rerender will trigger this useEffect because refs changed, but this check will return false
    if (isBoundingBoxDifferent(prevBoundingBoxes, boundingBoxes)) {
      const scrollLeftDiff = currentScroll - prevScrollLeftRef.current;
      refs.forEach((ref) => {
        if (ref?.current) {
          const domNode = ref.current;
          const firstBox = prevBoundingBoxes[domNode.id];
          const lastBox = boundingBoxes[domNode.id];
          // firstBox will be undefined for new filters
          let changeInX = firstBox
            ? firstBox.left - (lastBox.left + scrollLeftDiff)
            : 0;

          if (sliderDeleted && rightSideOverflow < 120) {
            changeInX = changeInX === 0 ? -100 : 0;
          }

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

  useEffect(() => {
    // Update previous scroll width information on second rerender
    prevScrollWidthRef.current = scrollWidth;
  }, [scrollWidth]);

  return <>{children}</>;
};

export default SortWrapper;
