window.addEventListener("DOMContentLoaded", () => {
  // === Criar SVG radial ===
  const svgMarkup = `
    <svg viewBox="0 0 100 100" class="click-svg" xmlns="http://www.w3.org/2000/svg"
         style="position: fixed; left: 0; top: 0; pointer-events: none; z-index: 9999;
                transform: translate(-50%, -50%); width: 60px; height: 60px;">
      ${Array.from({ length: 8 }).map((_, i) => {
  const angle = (2 * Math.PI / 8) * i;
  const length = 30;
  const r1 = 10; // distância do centro onde começa a linha
const r2 = 20; // distância onde termina a linha

const x1 = 50 + r1 * Math.cos(angle);
const y1 = 50 + r1 * Math.sin(angle);
const x2 = 50 + r2 * Math.cos(angle);
const y2 = 50 + r2 * Math.sin(angle);

return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="rgba(255, 255, 255, 0.414)" stroke-width="3" />`;

}).join('')}

    </svg>
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgMarkup;
  const svgElement = wrapper.firstElementChild;
  document.body.appendChild(svgElement);

  // === Criar texto "Press to start the audio experience" ===
  const instruction = document.createElement("div");
   instruction.innerHTML = "press to start<br>the audio experience";
  instruction.style.position = "fixed";
  instruction.style.left = "0";
  instruction.style.top = "0";
  instruction.style.textAlign = "center";
  instruction.style.transform = "translate(-50%, -50%)";
  instruction.style.color = "rgba(255, 255, 255, 0.414)";
  instruction.style.fontSize = "1.2rem";
  instruction.style.fontFamily = "'Libre Caslon Text', serif";
  instruction.style.textShadow = "0 0 10px black";
  instruction.style.zIndex = "9999";
  instruction.style.pointerEvents = "none";
   
  document.body.appendChild(instruction);

  // === Seguir rato com SVG + Texto ===
  document.addEventListener("mousemove", (e) => {
    svgElement.style.left = `${e.clientX}px`;
    svgElement.style.top = `${e.clientY}px`;

    instruction.style.left = `${e.clientX}px`;
    instruction.style.top = `${e.clientY + -60}px`; // 40px abaixo do cursor
  });

  // === Remover SVG + Texto ao clicar ===
  document.addEventListener("click", () => {
    svgElement.remove();
    instruction.remove();
  }, { once: true });
});
