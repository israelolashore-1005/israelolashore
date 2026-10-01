import { supabase } from './supabase.js';

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', {
      ascending: false
    });

  if (error) {
    console.error(
      'Could not load portfolio projects:',
      error
    );

    throw error;
  }

  return data || [];
}

export function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) throw new Error('Enter a website link.');
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Use an http or https website link.');
  return url.toString();
}

export function titleFromUrl(urlValue) {
  try {
    const { hostname } = new URL(urlValue);
    const root = hostname.replace(/^www\./, '').split('.')[0];
    return root
      .split(/[-_]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || hostname;
  } catch {
    return 'New Website';
  }
}

export function displayDomain(urlValue) {
  try {
    return new URL(urlValue).hostname.replace(/^www\./, '');
  } catch {
    return urlValue;
  }
}
