// // Locomotive Scroll Init with smoothed settings
// const locoScroll = new LocomotiveScroll({
//   el: document.querySelector(".main"),
//   smooth: true,
//   lerp: 0.08, // This interpolation setting handles the buttery smoothness
//   multiplier: 1, // Standard speed
//   smartphone: { smooth: true },
//   tablet: { smooth: true },
// });

// //gsap.registerPlugin(ScrollTrigger);
// locoScroll.on("scroll", ScrollTrigger.update);

// ScrollTrigger.scrollerProxy(".main", {
//   scrollTop(value) {
//     return arguments.length
//       ? locoScroll.scrollTo(value, 0, 0)
//       : locoScroll.scroll.instance.scroll.y;
//   },
//   getBoundingClientRect() {
//     return {
//       top: 0,
//       left: 0,
//       width: window.innerWidth,
//       height: window.innerHeight,
//     };
//   },
//   pinType: document.querySelector(".main").style.transform
//     ? "transform"
//     : "fixed",
// });
let h2data = document.querySelectorAll(".text h2");
h2data.forEach((item) => {
  let textdata = item.textContent;
  let splittext = textdata.split("");
  let data = "";
  splittext.forEach((char) => {
    data += `<span>${char}</span>`;
  });
  item.innerHTML = data;
});

gsap.to(".text h2 span", {
  color: "#050507",
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".page2",
    scroll: ".main",
    start: "top top",
    end: "+=240%",

    pin: true,
    scrub: 1.5,
  },
});

gsap.from(".page_1 h1", {
  y: 100,
  opacity: 0,
  duration: 1.5,
  delay: 0.2,
  skewY: 5,
  stagger: 0.15,
});

//gsap.to(".page2", {
//backgroundColor: "#",
//scrollTrigger: {
//trigger: ".page2",
//start: "top 75%",
//end: "top 25%",
//scrub: true,
//markers: true,
//},
//});

ScrollTrigger.create({
  trigger: ".page2",
  scroll: ".main",
  start: "top top",
  end: "bottom -150%",
  scrub: 1,
  markers: true,
  onEnter: () => gsap.to(".main", { backgroundColor: "#fff", duration: 1 }),
  onLeave: () => gsap.to(".main", { backgroundColor: "#0F0D0D", duration: 1 }),
  onEnterBack: () => gsap.to(".main", { backgroundColor: "#fff", duration: 1 }),
  onLeaveBack: () =>
    gsap.to(".main", { backgroundColor: "#0F0D0D", duration: 1 }),
});
console.log("hi");
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
// scrollTrigger.addEventListener("refresh", () => locoScroll.update());
// scrollTrigger.refresh();
