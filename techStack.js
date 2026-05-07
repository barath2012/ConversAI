const frontend = document.querySelector("#frontEnd");
const backend = document.querySelector("#backEnd");
const frontendlogos = document.querySelector("#frontend");
const backendlogos = document.querySelector("#backend");

const activeClass = ["bg-[#d4af37]", "text-[#030305]"];
const InactiveClass = ["bg-transparent", "text-white/60", "hover:text-white"];

function SwitchTab(activeButton, InactiveButton, showContainer, hideContainer) {
  console.log("hi");
  activeButton.classList.add(...activeClass);
  activeButton.classList.remove(...InactiveClass);
  InactiveButton.classList.add(...InactiveClass);
  InactiveButton.classList.remove(...activeClass);
  showContainer.style.display = "flex";
  hideContainer.style.display = "none";
}
frontend.addEventListener("click", () =>
  SwitchTab(frontend, backend, frontendlogos, backendlogos)
);
backend.addEventListener("click", () =>
  SwitchTab(backend, frontend, backendlogos, frontendlogos)
);
