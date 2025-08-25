// src/utils/gsapAnimations.js
export const fadeUpStagger = async (selector, opts = {}) => {
  if (typeof window === 'undefined') return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const defaults = {
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08
  };

  gsap.utils.toArray(selector).forEach((el) => {
    gsap.fromTo(
      el,
      { y: 24, opacity: 1 },                 // start from fully visible (CSS keeps it visible)
      {
        y: 0,
        opacity: 1,
        ...defaults,
        ...opts,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        immediateRender: false               // don't apply start values until trigger
      }
    );
  });
};
