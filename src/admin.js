import './styles.css';
import './admin.css';

import {
  displayDomain,
  normalizeUrl,
  titleFromUrl
} from './projects.js';

import { supabase } from './supabase.js';

let projects = [];
let toastTimer;

const authShell = document.getElementById('admin-auth-shell');
const adminApp = document.getElementById('admin-app');
const loginForm = document.getElementById('admin-login-form');
const loginButton = document.getElementById('admin-login-button');
const emailInput = document.getElementById('admin-email');
const passwordInput = document.getElementById('admin-password');
const togglePassword = document.getElementById('toggle-password');
const loginMessage = document.getElementById('login-message');
const logoutButton = document.getElementById('admin-logout');
const form = document.getElementById('project-form');
const urlInput = document.getElementById('website-url');
const nameInput = document.getElementById('project-name');
const typeInput = document.getElementById('project-kind');
const categoryInput = document.getElementById('project-category-input');
const descriptionInput = document.getElementById('project-description-input');
const message = document.getElementById('admin-form-message');
const list = document.getElementById('admin-project-list');
const totalCount = document.getElementById('admin-total');
const clientCount = document.getElementById('admin-client');
const demoCount = document.getElementById('admin-demo');
const countLabel = document.getElementById('project-count-label');
const toast = document.getElementById('admin-toast');

function finishLoading() {
  const loader = document.getElementById('site-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 650);
  }, 450);
}

function notify(text) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function setMessage(target, text = '', isError = false) {
  if (!target) return;
  target.textContent = text;
  target.classList.toggle('error', isError);
}

function showLogin(messageText = '', isError = false) {
  adminApp.hidden = true;
  authShell.hidden = false;
  setMessage(loginMessage, messageText, isError);
  setTimeout(() => emailInput?.focus(), 50);
}

function showAdmin() {
  authShell.hidden = true;
  adminApp.hidden = false;
}


async function checkSession() {
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      showLogin();
      return;
    }

    showAdmin();
    await loadProjects();

  } catch (error) {
    console.error(error);

    showLogin(
      'Unable to verify your admin session.',
      true
    );

  } finally {
    finishLoading();
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  setMessage(loginMessage);

  loginButton.disabled = true;
  loginButton.textContent = 'Signing in…';

  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Login failed.');
    }

    passwordInput.value = '';

    showAdmin();

    await loadProjects();

    notify('Secure admin session started.');

  } catch (error) {
    console.error(error);

    setMessage(
      loginMessage,
      error.message || 'Incorrect email or password.',
      true
    );

  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Sign in securely';
  }
});

togglePassword?.addEventListener('click', () => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  togglePassword.textContent = showing ? 'Show' : 'Hide';
  togglePassword.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});

logoutButton?.addEventListener('click', async () => {
  logoutButton.disabled = true;

  try {
    const { error } = await supabase.auth.signOut({
      scope: 'local'
    });

    if (error) {
      throw error;
    }

    projects = [];

    showLogin('You have been logged out.');

    notify('Admin session ended.');

  } catch (error) {
    console.error(error);

    notify('Could not log out.');

  } finally {
    logoutButton.disabled = false;
  }
});

function updateStats() {
  if (totalCount) totalCount.textContent = String(projects.length);
  if (clientCount) clientCount.textContent = String(projects.filter((project) => project.type === 'Client project').length);
  if (demoCount) demoCount.textContent = String(projects.filter((project) => project.type === 'Demo concept').length);
  if (countLabel) countLabel.textContent = `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`;
}

async function loadProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', {
      ascending: false
    });

  if (error) {
    throw error;
  }

  projects = data || [];

  renderProjects();
}

function renderProjects() {
  updateStats();
  if (!list) return;
  list.innerHTML = '';

  if (!projects.length) {
    list.innerHTML = `
      <div class="admin-empty">
        <img src="/assets/logo.png" alt="" />
        <h3>No websites published</h3>
        <p>Add a website with the form and it will immediately become available in the public portfolio project browser.</p>
      </div>`;
    return;
  }

  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'admin-project-card';
    card.dataset.id = project.id;
    card.innerHTML = `
      <div class="admin-project-summary">
        <div class="admin-project-number">${String(index + 1).padStart(2, '0')}</div>
        <div class="admin-project-copy"><h3></h3><p></p></div>
        <div class="admin-card-actions">
          <button type="button" class="admin-mini-btn preview-toggle">Preview</button>
          <button type="button" class="admin-mini-btn danger delete-btn">Delete</button>
        </div>
      </div>
      <div class="admin-project-preview">
        <div class="admin-preview-bar">
          <span class="admin-preview-domain"></span>
          <a class="admin-open-site" href="#" target="_blank" rel="noopener noreferrer">Open site ↗</a>
        </div>
        <div class="admin-preview-frame">
          <iframe title="Website preview" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
        </div>
        <div class="admin-preview-meta"><span></span><span></span></div>
        <p class="admin-preview-description"></p>
      </div>
      <div class="delete-confirm">
        <p>Delete this website from the portfolio?</p>
        <div class="delete-confirm-actions">
          <button type="button" class="admin-mini-btn cancel-delete">Cancel</button>
          <button type="button" class="admin-mini-btn confirm-delete">Yes, delete</button>
        </div>
      </div>`;

    card.querySelector('.admin-project-copy h3').textContent = project.title;
    card.querySelector('.admin-project-copy p').textContent = `${project.type} · ${project.category} · ${displayDomain(project.url)}`;
    card.querySelector('.admin-preview-domain').textContent = displayDomain(project.url);
    card.querySelector('.admin-open-site').href = project.url;
    const meta = card.querySelectorAll('.admin-preview-meta span');
    meta[0].textContent = project.type;
    meta[1].textContent = project.category;
    card.querySelector('.admin-preview-description').textContent = project.description || `${project.title} — ${project.category}.`;

    const previewToggle = card.querySelector('.preview-toggle');
    const iframe = card.querySelector('iframe');
    iframe.title = `Preview of ${project.title}`;
    previewToggle.addEventListener('click', () => {
      const opening = !card.classList.contains('preview-open');
      card.classList.toggle('preview-open', opening);
      previewToggle.textContent = opening ? 'Collapse' : 'Preview';
      if (opening && iframe.dataset.loaded !== 'true') {
        iframe.src = project.url;
        iframe.dataset.loaded = 'true';
      }
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      document.querySelectorAll('.admin-project-card.delete-pending').forEach((item) => {
        if (item !== card) item.classList.remove('delete-pending');
      });
      card.classList.add('delete-pending');
    });
    card.querySelector('.cancel-delete').addEventListener('click', () => card.classList.remove('delete-pending'));
    card.querySelector('.confirm-delete').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Deleting…';
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', project.id);

        if (error) {
          throw error;
        }
        await loadProjects();
        notify(`${project.title} was deleted.`);
      } catch (error) {
        button.disabled = false;
        button.textContent = 'Yes, delete';
        notify(error.message || 'Could not delete that project.');
      }
    });
    list.appendChild(card);
  });
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(message);
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Publishing…';
  try {
    const url = normalizeUrl(urlInput.value);
    const title = nameInput.value.trim() || titleFromUrl(url);
    const category = categoryInput.value.trim();
    if (!category) throw new Error('Enter a project category.');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        url,
        title,
        type: typeInput.value,
        category,
        description: descriptionInput.value.trim()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const project = data;
    form.reset();
    typeInput.value = 'Client project';
    await loadProjects();
    setMessage(message, `${project.title} has been added.`);
    notify(`${project.title} is now live in the portfolio.`);
  } catch (error) {
    setMessage(message, error.message || 'Could not add that website.', true);
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Add to portfolio <span aria-hidden="true">↗</span>';
  }
});

urlInput?.addEventListener('blur', () => {
  if (!urlInput.value.trim() || nameInput.value.trim()) return;
  try {
    const normalized = normalizeUrl(urlInput.value);
    nameInput.placeholder = `Suggested: ${titleFromUrl(normalized)}`;
  } catch {
    nameInput.placeholder = 'Optional — generated from the domain';
  }
});

checkSession();
