const projects = {
  legacy: {
    title: "Legacy Wealth Creation Hub",
    url: "https://legacycreationhub.vercel.app/",
    domain: "legacycreationhub.vercel.app",
    type: "Client project",
    category: "Wealth education",
    description:
      "A conversion-focused wealth education platform built around programme discovery, audience fit, a digital legacy guide and WhatsApp-led registration enquiries."
  },
  iwga: {
    title: "International Women’s Global Academy",
    url: "https://internationalwomensglobalacademy.com/",
    domain: "internationalwomensglobalacademy.com",
    type: "Client project",
    category: "Global academy",
    description:
      "A professional platform for a global women’s academy, presenting its mission, leadership, learning pillars and programmes through a clear, credibility-focused experience."
  },
  ogbayagi: {
    title: "Ogbayagi Bitters",
    url: "https://ogbayagibitters.vercel.app/",
    domain: "ogbayagibitters.vercel.app",
    type: "Client project",
    category: "Wellness product",
    description:
      "A mobile-friendly product website with product education, usage guidance, locations, testimonials, FAQs and direct WhatsApp ordering for a herbal wellness brand."
  },
  aura: {
    title: "Aura Interiors",
    url: "https://aura-interiors-five.vercel.app/",
    domain: "aura-interiors-five.vercel.app",
    type: "Demo concept",
    category: "Interior design",
    description:
      "A refined luxury interior design demo featuring project galleries, service positioning, process storytelling and consultation-focused calls to action."
  },
  elan: {
    title: "Élan Beauty Studio",
    url: "https://elan-beauty-saloon.vercel.app/",
    domain: "elan-beauty-saloon.vercel.app",
    type: "Demo concept",
    category: "Salon & beauty",
    description:
      "A premium beauty-salon demo with service menus, artist profiles, editorial galleries, testimonials and appointment booking paths designed around a luxury customer journey."
  }
};

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const projectTabs = document.querySelectorAll(".project-tab");
const deviceButtons = document.querySelectorAll(".device-btn");
const frame = document.getElementById("project-frame");
const iframeStage = document.querySelector(".iframe-stage");
const loadingLabel = document.getElementById("iframe-loading");
const browserUrl = document.getElementById("browser-url");
const projectType = document.getElementById("project-type");
const projectCategory = document.getElementById("project-category");
const projectTitle = document.getElementById("project-title");
const projectDescription = document.getElementById("project-description");
const projectLink = document.getElementById("project-link");
const packageSelect = document.getElementById("package-select");
const packageButtons = document.querySelectorAll("[data-package]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// Sticky-header state
const syncHeader = () => header?.classList.toggle("scrolled", window.scrollY > 18);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

// Mobile navigation
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  nav.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

// Live project browser
function loadProject(key) {
  const project = projects[key];
  if (!project) return;

  projectTabs.forEach((tab) => {
    const active = tab.dataset.project === key;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  loadingLabel.textContent = "Loading live preview…";
  frame.style.opacity = "0";
  frame.title = `Live preview of ${project.title}`;
  frame.src = project.url;
  browserUrl.textContent = project.domain;
  projectType.textContent = project.type;
  projectCategory.textContent = project.category;
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;
  projectLink.href = project.url;
}

projectTabs.forEach((tab) => {
  tab.addEventListener("click", () => loadProject(tab.dataset.project));
});

frame?.addEventListener("load", () => {
  frame.style.opacity = "1";
  loadingLabel.textContent = "";
});

// Device-width preview controls
deviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const device = button.dataset.device;
    iframeStage.dataset.device = device;
    deviceButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
  });
});

// Package buttons pre-fill the contact form
packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.package;
    const matchingOption = [...packageSelect.options].find((option) => option.text === value);
    if (matchingOption) packageSelect.value = matchingOption.text;
  });
});

// Contact-form UX. FormSubmit handles the actual delivery.
contactForm?.addEventListener("submit", (event) => {
  if (!contactForm.checkValidity()) {
    event.preventDefault();
    formStatus.textContent = "Please complete the required fields before sending.";
    contactForm.reportValidity();
    return;
  }

  const submitButton = contactForm.querySelector(".submit-btn");
  submitButton.disabled = true;
  submitButton.textContent = "Sending enquiry…";
  formStatus.textContent = "Your message is being securely submitted.";
});

// Scroll-reveal animation
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Dynamic copyright year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
