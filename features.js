// Locomotive Scroll Init with smoothed settings

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".main"),

  smooth: true,

  lerp: 0.08,

  multiplier: 1,

  smartphone: { smooth: true },

  tablet: { smooth: true },
});

gsap.registerPlugin(ScrollTrigger);

locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(".main", {
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

  pinType: document.querySelector(".main").style.transform
    ? "transform"
    : "fixed",
});

//Navbar Scroll Effect

const navbar = document.querySelector(".navbar");

locoScroll.on("scroll", (args) => {
  if (args.scroll.y > 50) {
    navbar.classList.remove("top-0", "w-full");

    navbar.classList.add("top-4", "w-[95%]", "rounded-full", "m-auto");
  } else {
    // When at the top: Revert to full width

    navbar.classList.add("top-0", "w-full");

    navbar.classList.remove("top-4", "w-[95%]", "rounded-full");
  }
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();

  locoScroll.update();
});
