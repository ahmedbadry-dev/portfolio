import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  ReactElement,
  ReactNode,
  RefObject,
  useLayoutEffect,
  useMemo,
  useRef
} from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  dropOffset?: number;
  position?:
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  onActiveCardChange?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 1200,
  height = 500,
  dropOffset = 260,
  position = 'center',
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveCardChange,
  skewAmount = 4,
  easing = 'elastic',
  children
}) => {
  const config = useMemo(
    () =>
      easing === 'elastic'
        ? {
          // Keep the same visual "bounce" feel with a cheaper easing.
          ease: 'back.out(1.25)',
          durDrop: 0.9,
          durMove: 0.95,
          durReturn: 1.1,
          promoteOverlap: 0.7,
          returnDelay: 0.18
        }
        : {
          ease: 'power3.inOut',
          durDrop: 0.65,
          durMove: 0.7,
          durReturn: 0.75,
          promoteOverlap: 0.55,
          returnDelay: 0.2
        },
    [easing]
  );

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr]);
  const slots = useMemo(
    () => refs.map((_, i) => makeSlot(i, cardDistance, verticalDistance, refs.length)),
    [cardDistance, verticalDistance, refs]
  );

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const inViewRef = useRef<boolean>(false);
  const tabVisibleRef = useRef<boolean>(true);
  const hoverPausedRef = useRef<boolean>(false);

  const swapTlRef = useRef<gsap.core.Timeline | null>(null);
  const loopCallRef = useRef<gsap.core.Tween | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const canRun = () => inViewRef.current && tabVisibleRef.current && (!pauseOnHover || !hoverPausedRef.current);
    const killLoopCall = () => {
      loopCallRef.current?.kill();
      loopCallRef.current = null;
    };
    const scheduleNextSwap = (runSwap: () => void) => {
      killLoopCall();
      loopCallRef.current = gsap.delayedCall(delay / 1000, runSwap);
    };

    const total = slots.length;
    order.current = Array.from({ length: total }, (_, i) => i);
    refs.forEach((r, i) => placeNow(r.current!, slots[i], skewAmount));
    onActiveCardChange?.(order.current[0] ?? 0);

    const swap = () => {
      if (order.current.length < 2 || !canRun()) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = swapTlRef.current ?? gsap.timeline({ paused: true });
      swapTlRef.current = tl;
      tl.clear();

      tl.to(elFront, {
        y: `+=${dropOffset}`,
        rotateZ: -5,
        scale: 0.965,
        opacity: 0.9,
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = slots[i];
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = slots[refs.length - 1];
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          rotateZ: 0,
          scale: 1,
          opacity: 1,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
        onActiveCardChange?.(order.current[0] ?? 0);
        scheduleNextSwap(swap);
      });

      tl.play(0);
    };

    const updatePlayback = () => {
      const tl = swapTlRef.current;
      if (canRun()) {
        if (tl && tl.paused() && tl.progress() > 0 && tl.progress() < 1) {
          tl.resume();
          return;
        }
        if (loopCallRef.current?.paused()) {
          loopCallRef.current.resume();
          return;
        }
        if (!loopCallRef.current && !(tl?.isActive())) {
          scheduleNextSwap(swap);
        }
        return;
      }

      tl?.pause();
      loopCallRef.current?.pause();
    };

    const node = container.current;
    const onMouseEnter = () => {
      hoverPausedRef.current = true;
      updatePlayback();
    };
    const onMouseLeave = () => {
      hoverPausedRef.current = false;
      updatePlayback();
    };
    const onVisibilityChange = () => {
      tabVisibleRef.current = document.visibilityState === 'visible';
      updatePlayback();
    };

    const observer = new IntersectionObserver(
      entries => {
        inViewRef.current = entries.some(entry => entry.isIntersecting);
        updatePlayback();
      },
      { threshold: 0.15 }
    );

    if (node) {
      observer.observe(node);
      if (pauseOnHover) {
        node.addEventListener('mouseenter', onMouseEnter);
        node.addEventListener('mouseleave', onMouseLeave);
      }
    }

    tabVisibleRef.current = document.visibilityState === 'visible';
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (node && pauseOnHover) {
        node.removeEventListener('mouseenter', onMouseEnter);
        node.removeEventListener('mouseleave', onMouseLeave);
      }
      killLoopCall();
      swapTlRef.current?.kill();
      swapTlRef.current = null;
    };
  }, [delay, dropOffset, pauseOnHover, skewAmount, config, refs, slots, onActiveCardChange]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
        key: i,
        ref: refs[i],
        style: { width, height, ...(child.props.style ?? {}) },
        onClick: e => {
          child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
          onCardClick?.(i);
        }
      } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  const positionClasses: Record<NonNullable<CardSwapProps['position']>, string> = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'top-right': 'top-0 right-0',
    'center-left': 'top-1/2 left-0 -translate-y-1/2',
    'center-right': 'top-1/2 right-0 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-0 right-0'
  };

  return (
    <div
      ref={container}
      className={`absolute perspective-[900px] overflow-visible ${positionClasses[position]}`}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default memo(CardSwap);
