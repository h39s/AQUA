import {
  useState,
  useLayoutEffect,
  useEffect,
  RefObject,
  ReactElement,
  useMemo,
  useRef,
} from 'react';
import { usePrevious } from './utils/utils';

interface IBoundingBoxMap {
  [key: string]: DOMRect;
}

interface IChildPositions {
  bounds: IBoundingBoxMap;
  scrollLeft: number;
}

type CustomElement = ReactElement & { ref?: RefObject<HTMLDivElement | null> };

// codesandbox.io/s/reorder-elements-with-slide-transition-and-react-hooks-flip-forked-wjojyy?file=/src/helpers/calculateBoundingBoxes.js:28-370
export const calculateChildPositions = (
  refs: RefObject<HTMLDivElement | null>[],
  wrapperRef: RefObject<HTMLDivElement>
) => {
  const boundingBoxes: IBoundingBoxMap = {};

  refs.forEach((ref) => {
    if (ref?.current) {
      const domNode = ref.current;
      const nodeBoundingBox = domNode.getBoundingClientRect();
      boundingBoxes[domNode.id] = nodeBoundingBox;
    }
  });
  const positions: IChildPositions = {
    bounds: { ...boundingBoxes },
    scrollLeft: wrapperRef.current ? wrapperRef.current.scrollLeft : 0,
  };

  return positions;
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
  wrapperRef: RefObject<HTMLDivElement>;
}): JSX.Element => {
  const [childPositions, setChildPositions] = useState<IChildPositions>({
    bounds: {},
    scrollLeft: 0,
  });
  const [prevChildPositions, setPrevChildPositions] = useState<IChildPositions>(
    { bounds: {}, scrollLeft: 0 }
  );

  const refs = useMemo(
    () => children.flatMap((child) => getRefs(child)).filter((c) => c),
    [children]
  );

  const prevChildrenRef = useRef<any[]>();

  useEffect(() => {
    const newPositions = calculateChildPositions(refs, wrapperRef);
    if (Object.keys(newPositions.bounds).length) {
      setChildPositions(newPositions);
    }

    const prev = calculateChildPositions(
      prevChildrenRef.current || [],
      wrapperRef
    );
    setPrevChildPositions(prev);
  }, [refs, wrapperRef]);

  useEffect(() => {
    const hasPrevBoundingBox = Object.keys(prevChildPositions.bounds).length;

    if (hasPrevBoundingBox) {
      const scrollLeftDiff =
        childPositions.scrollLeft - prevChildPositions.scrollLeft;
      refs.forEach((ref) => {
        if (ref?.current) {
          const domNode = ref.current;
          const firstBox = prevChildPositions.bounds[domNode.id];
          const lastBox = childPositions.bounds[domNode.id];
          // firstBox will be undefined for new filters
          const changeInX = firstBox
            ? firstBox.left - (lastBox.left + scrollLeftDiff)
            : 0;

          if (changeInX) {
            requestAnimationFrame(() => {
              // Before the DOM paints, invert child to old position
              domNode.style.transform = `translateX(${changeInX}px)`;
              domNode.style.transition = 'transform 0s';

              setTimeout(
                () =>
                  requestAnimationFrame(() => {
                    // After the previous frame, remove
                    // the transistion to play the animation
                    domNode.style.transform = '';
                    domNode.style.transition = 'transform 5s';
                  }),
                2000
              );
            });
          }
        }
      });
    }
  }, [childPositions, prevChildPositions, refs]);

  useEffect(() => {
    prevChildrenRef.current = refs;
  }, [refs]);

  return <>{children}</>;
};

export default SortWrapper;
