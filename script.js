const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
});

// fermer menu au clic
document.querySelectorAll(".menu-full a").forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("active");
        hamburger.classList.remove("active");
    });
});



const heroTitle = document.querySelector(".hero-title");

heroTitle.addEventListener("pointerdown", () => {

    heroTitle.classList.remove("active"); // reset
    void heroTitle.offsetWidth; // 🔥 force restart animation

    heroTitle.classList.add("active");
});



const projects = document.querySelectorAll('.project');

projects.forEach(project => {
    project.addEventListener('click', () => {
        project.classList.toggle('active');
    });
});




const pupilles = document.querySelectorAll(".pupille");

let mouseX = 0;
let mouseY = 0;

// positions actuelles (inertie)
const positions = [];

pupilles.forEach(() => {
  positions.push({ x: 0, y: 0 });
});

// souris
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// mobile
document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  mouseX = touch.clientX;
  mouseY = touch.clientY;
});

function animate() {
  pupilles.forEach((pupille, index) => {

    const oeil = pupille.parentElement;
    const rect = oeil.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 👉 TON sens original (important)
    const dx = centerX - mouseX;
    const dy = centerY - mouseY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // 🔥 rayon SAFE (corrigé proprement)
    const eyeRadius = rect.width / 2;
    const pupilRadius = pupille.offsetWidth / 2;

    const maxMove = eyeRadius - pupilRadius - 4; // 👈 ajuste ici seulement

    const limitedDistance = Math.min(distance, maxMove);

    let targetX = Math.cos(angle) * limitedDistance;
let targetY = Math.sin(angle) * limitedDistance;

// 🔥 corrections intelligentes
if (targetY > 0) { 
  targetY *= 0.3; // limite uniquement vers le bas
}

if (targetX < 0) { 
  targetX *= 0.65; // limite légèrement vers la droite
}

    // 🎯 INERTIE
    positions[index].x += (targetX - positions[index].x) * 0.1;
    positions[index].y += (targetY - positions[index].y) * 0.1;

    pupille.style.transform =
      `translate(-50%, -50%) translate(${positions[index].x}px, ${positions[index].y}px)`;
  });

  requestAnimationFrame(animate);
}

animate();




const roleElements = document.querySelectorAll(".role");

roleElements.forEach(roleElement => {

  const words = JSON.parse(roleElement.dataset.words);
  let currentIndex = 0;

  let startY = 0;
  let isSwiping = false;

  // INIT
  roleElement.textContent = `[${words[currentIndex]}]`;

  // TOUCH START
  roleElement.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    isSwiping = true;
  }, { passive: true });

  // TOUCH MOVE
  roleElement.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;

    let currentY = e.touches[0].clientY;
    let diff = Math.abs(startY - currentY);

    if (diff > 10) {
      e.preventDefault();
    }
  }, { passive: false });

  // TOUCH END
  roleElement.addEventListener("touchend", (e) => {
    isSwiping = false;

    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;

    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        currentIndex = (currentIndex + 1) % words.length;
        changeRole(roleElement, words, currentIndex, -1);
      } else {
        currentIndex = (currentIndex - 1 + words.length) % words.length;
        changeRole(roleElement, words, currentIndex, 1);
      }
    }
  });

});

function changeRole(element, words, index, direction) {
  element.style.transition = "transform 0.25s ease, opacity 0.25s ease";
  element.style.transform = `translateY(${direction * 10}px)`;
  element.style.opacity = 0;

  setTimeout(() => {
    element.textContent = `[${words[index]}]`; // 👈 parenthèses carrées

    element.style.transition = "none";
    element.style.transform = `translateY(${direction * -10}px)`;

    requestAnimationFrame(() => {
      element.style.transition = "transform 0.25s ease, opacity 0.25s ease";
      element.style.transform = "translateY(0)";
      element.style.opacity = 1;
    });
  }, 120);
}

const aboutSection = document.querySelector("#about");
const hints = document.querySelectorAll(".hint, .hintBubble");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      hints.forEach(hint => {
        hint.classList.add("show");
      });

      observer.disconnect(); // 🔥 ne joue qu’une seule fois
    }
  });
}, {
  threshold: 0.4 // déclenche quand ~40% visible
});

observer.observe(aboutSection);



