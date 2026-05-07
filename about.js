gsap.registerPlugin(ScrollTrigger);
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),

  smooth: true,

  multiplier: 1,

  class: "is-revealed",
});

// Sync Locomotive Scroll with GSAP ScrollTrigger

locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy("[data-scroll-container]", {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },

  getBoundingClientRect() {
    return {
      top: 0,

      left: 0,

      width: window.innerWidth,

      height: window.innerHeight,
    };
  },

  // Locomotive Scroll handles pinning via transforms, so we set pinType accordingly

  pinType: document.querySelector("[data-scroll-container]").style.transform
    ? "transform"
    : "fixed",
});

gsap.from(".about1 .reveal-item ", {
  y: 60,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out",
  stagger: 0.15,
});
gsap.set(".about2", {
  yPercent: 100,
  scale: 0.85,
  borderRadius: "120px",
});
const pagesTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".stack",
    scroller: "[data-scroll-container]",
    start: "top top",
    end: "+=150%",
    scrub: 1,
    pin: true,
  },
});
pagesTL.to(
  ".about1",
  {
    scale: 0.9,
    opacity: 0.4,
    filter: "blur(8px)",
    ease: "none",
  },
  0
);
pagesTL.to(
  ".about2",
  {
    yPercent: 0,
    scale: 1,
    borderRadius: "0px",
    ease: "none",
  },
  0
);

// After setting everything up, let ScrollTrigger know about Locomotive

ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

ScrollTrigger.refresh();

// Ensure calculations are absolutely correct after images load

window.addEventListener("load", () => {
  locoScroll.update();

  ScrollTrigger.refresh();
});

// Handle window resize properly

window.addEventListener("resize", () => {
  locoScroll.update();

  ScrollTrigger.refresh();
});
