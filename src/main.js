import { displayDomain, fetchProjects } from './projects.js';

let projects = [];
let selectedProjectId = null;

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const projectSidebar = document.getElementById('project-sidebar');
const frame = document.getElementById('project-frame');
const iframeStage = document.querySelector('.iframe-stage');
const loadingLabel = document.getElementById('iframe-loading');
const browserUrl = document.getElementById('browser-url');
const projectType = document.getElementById('project-type');
const projectCategory = document.getElementById('project-category');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectLink = document.getElementById('project-link');
const projectBrowser = document.getElementById('project-browser');
const expandPreview = document.getElementById('expand-preview');
const featuredCount = document.getElementById('featured-count');
const clientCount = document.getElementById('client-count');
const demoCount = document.getElementById('demo-count');
const packageSelect = document.getElementById('package-select');
const packageButtons = document.querySelectorAll('[data-package]');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function finishLoading() {
  const loader = document.getElementById('site-loader');

  if (!loader) {
    document.body.classList.remove('is-loading');
    return;
  }

  setTimeout(() => {
    // The main CSS/JS is ready at this point.
    document.body.classList.remove('is-loading');

    requestAnimationFrame(() => {
      loader.classList.add('loaded');
    });

    setTimeout(() => {
      loader.remove();
    }, 650);
  }, 850);
}
if (document.readyState === 'complete') finishLoading();
else window.addEventListener('load', finishLoading, { once: true });

const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  });
});

// Hidden entry point only: authentication is still required on the admin page.
document.querySelector('.admin-trigger')?.addEventListener('dblclick', (event) => {
  event.preventDefault();
  window.location.href = '/admin.html';
});

function updateCounts() {
  if (featuredCount) featuredCount.textContent = String(projects.length);
  if (clientCount) clientCount.textContent = String(projects.filter((p) => p.type === 'Client project').length);
  if (demoCount) demoCount.textContent = String(projects.filter((p) => p.type === 'Demo concept').length);
}

function renderProjectTabs() {
  if (!projectSidebar) return;
  projectSidebar.innerHTML = '';
  if (!projects.length) {
    projectSidebar.innerHTML = '<div class="empty-projects">No projects are currently published.</div>';
    return;
  }

  projects.forEach((project, index) => {
    const tab = document.createElement('button');
    const active = project.id === selectedProjectId;
    tab.className = `project-tab${active ? ' active' : ''}`;
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(active));
    tab.dataset.project = project.id;
    tab.innerHTML = `
      <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
      <span><strong></strong><small></small></span>`;
    tab.querySelector('strong').textContent = project.title;
    tab.querySelector('small').textContent = `${project.type} · ${project.category}`;
    tab.addEventListener('click', () => loadProject(project.id));
    projectSidebar.appendChild(tab);
  });
}

function showEmptyProjectState() {
  selectedProjectId = null;
  if (loadingLabel) loadingLabel.textContent = 'No project is currently selected.';
  if (frame) {
    frame.src = 'about:blank';
    frame.style.opacity = '0';
  }
  if (browserUrl) browserUrl.textContent = 'No website selected';
  if (projectType) projectType.textContent = 'Project';
  if (projectCategory) projectCategory.textContent = 'Category';
  if (projectTitle) projectTitle.textContent = 'No projects yet';
  if (projectDescription) projectDescription.textContent = 'New projects can be published from the secured admin dashboard.';
  if (projectLink) {
    projectLink.href = '#';
    projectLink.setAttribute('aria-disabled', 'true');
    projectLink.classList.add('disabled');
  }
}

function loadProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) {
    showEmptyProjectState();
    return;
  }
  selectedProjectId = project.id;
  renderProjectTabs();
  if (loadingLabel) loadingLabel.textContent = 'Loading live preview…';
  if (frame) {
    frame.style.opacity = '0';
    frame.title = `Live preview of ${project.title}`;
    frame.src = project.url;
  }
  if (browserUrl) browserUrl.textContent = displayDomain(project.url);
  if (projectType) projectType.textContent = project.type;
  if (projectCategory) projectCategory.textContent = project.category;
  if (projectTitle) projectTitle.textContent = project.title;
  if (projectDescription) projectDescription.textContent = project.description || `${project.title} — ${project.category}.`;
  if (projectLink) {
    projectLink.href = project.url;
    projectLink.removeAttribute('aria-disabled');
    projectLink.classList.remove('disabled');
  }
}

frame?.addEventListener('load', () => {
  if (frame.src === 'about:blank') return;
  frame.style.opacity = '1';
  if (loadingLabel) loadingLabel.textContent = '';
});

async function syncProjects() {
  try {
    projects = await fetchProjects();

    if (
      !projects.some(
        (project) =>
          project.id === selectedProjectId
      )
    ) {
      selectedProjectId =
        projects[0]?.id ?? null;
    }

    updateCounts();
    renderProjectTabs();

    if (selectedProjectId) {
      loadProject(selectedProjectId);
    } else {
      showEmptyProjectState();
    }

  } catch (error) {
    console.error(
      'Could not load portfolio projects:',
      error
    );

    projects = [];
    selectedProjectId = null;

    updateCounts();
    renderProjectTabs();
    showEmptyProjectState();
  }
}

const deviceButtons = document.querySelectorAll('.device-btn');
deviceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (iframeStage) iframeStage.dataset.device = button.dataset.device;
    deviceButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
  });
});

async function togglePreviewExpansion() {
  if (!projectBrowser) return;
  try {
    if (document.fullscreenElement === projectBrowser) await document.exitFullscreen();
    else if (projectBrowser.requestFullscreen) await projectBrowser.requestFullscreen();
    else projectBrowser.classList.toggle('expanded-fallback');
  } catch {
    projectBrowser.classList.toggle('expanded-fallback');
  }
}
expandPreview?.addEventListener('click', togglePreviewExpansion);

document.addEventListener('fullscreenchange', () => {
  const expanded = document.fullscreenElement === projectBrowser;
  if (expandPreview) {
    expandPreview.textContent = expanded ? '↙' : '↗';
    expandPreview.setAttribute('aria-label', expanded ? 'Collapse website preview' : 'Expand website preview');
    expandPreview.title = expanded ? 'Collapse preview' : 'Expand preview';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && projectBrowser?.classList.contains('expanded-fallback')) {
    projectBrowser.classList.remove('expanded-fallback');
  }
});

packageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!packageSelect) return;
    const value = button.dataset.package;
    const matchingOption = [...packageSelect.options].find((option) => option.text === value);
    if (matchingOption) packageSelect.value = matchingOption.text;
  });
});

contactForm?.addEventListener('submit', (event) => {
  if (!contactForm.checkValidity()) {
    event.preventDefault();
    if (formStatus) formStatus.textContent = 'Please complete the required fields before sending.';
    contactForm.reportValidity();
    return;
  }
  const submitButton = contactForm.querySelector('.submit-btn');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending enquiry…';
  if (formStatus) formStatus.textContent = 'Your message is being securely submitted.';
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

syncProjects();
