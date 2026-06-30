/**
 * Custom smooth scroll to a target vertical position with customizable duration and cubic-bezier-like easing.
 * This makes the scrolling behavior much gentler and highly controlled compared to standard browser scrollIntoView.
 */
export const smoothScrollTo = (targetY: number, duration: number = 800) => {
  if (typeof window === "undefined") return;
  
  const getScrollTop = () => {
    return (
      window.scrollY !== undefined ? window.scrollY :
      window.pageYOffset !== undefined ? window.pageYOffset :
      (document.documentElement || {}).scrollTop !== undefined ? (document.documentElement || {}).scrollTop :
      (document.body || {}).scrollTop || 0
    );
  };

  const getNow = () => {
    return (typeof performance !== "undefined" && typeof performance.now === "function") 
      ? performance.now() 
      : Date.now();
  };

  const startY = getScrollTop();
  const difference = targetY - startY;
  const startTime = getNow();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const raf = (typeof window !== "undefined" && (
    window.requestAnimationFrame || 
    (window as any).webkitRequestAnimationFrame || 
    (window as any).mozRequestAnimationFrame || 
    function(callback: FrameRequestCallback) { return setTimeout(() => callback(getNow()), 16); }
  ));

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + difference * easeProgress);

    if (progress < 1) {
      raf(step);
    }
  };

  raf(step);
};

/**
 * Smoothly scrolls an element into view.
 * @param element The HTML element to scroll to
 * @param block Alignment position: "start" (top) or "center"
 * @param duration Animation duration in milliseconds (default 850ms)
 */
export const smoothScrollElementIntoView = (
  element: HTMLElement,
  block: "start" | "center" = "start",
  duration: number = 850
) => {
  if (!element || typeof element.getBoundingClientRect !== "function") return;
  const rect = element.getBoundingClientRect();
  const scrollTop = (
    window.scrollY !== undefined ? window.scrollY :
    window.pageYOffset !== undefined ? window.pageYOffset :
    (document.documentElement || {}).scrollTop !== undefined ? (document.documentElement || {}).scrollTop :
    (document.body || {}).scrollTop || 0
  );
  
  let targetY = scrollTop + rect.top;
  
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 768;
  
  if (block === "center") {
    targetY = scrollTop + rect.top - (viewportHeight / 2) + (rect.height / 2);
  } else if (block === "start") {
    // Offset slightly so it doesn't touch the top boundary awkwardly
    targetY = scrollTop + rect.top - 20;
  }
  
  // Clamp targetY within document bounds
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  const maxScrollY = docHeight - viewportHeight;
  const finalTargetY = Math.max(0, Math.min(targetY, maxScrollY));
  
  smoothScrollTo(finalTargetY, duration);
};
