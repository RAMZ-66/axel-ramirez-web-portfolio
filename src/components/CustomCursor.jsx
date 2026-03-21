import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let hovering = false;
    let scale = 1;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label';

    const addListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    // Re-attach on DOM mutations (dynamic elements)
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    window.addEventListener('mousemove', onMove);

    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const tick = () => {
      // Dot snaps instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      // Ring position lags behind
      ringX = lerp(ringX, mouseX, 0.5);
      ringY = lerp(ringY, mouseY, 0.5);

      // Scale eases in-out via JS
      const targetScale = hovering ? 0.5 : 1;
      scale = lerp(scale, targetScale, easeInOut(0.1));

      ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${scale})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      document.querySelectorAll(interactiveSelector).forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'white',
          pointerEvents: 'none',
          zIndex: 99999,
          translate: '-50% -50%',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid white',
          pointerEvents: 'none',
          zIndex: 99998,
          translate: '-50% -50%',
          willChange: 'transform',
        }}
      />
    </>
  );
}
