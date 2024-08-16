import { getSelectedEventId } from '../events';
import { renderHomePage } from '../pages/home';
import { renderLoginPage } from '../pages/login';

export function router() {
  const path = window.location.pathname;

  if (!localStorage.getItem('token') && path !== '/login') {
    window.history.replaceState({}, '', '/login');
    renderLoginPage();
  } else if (path === '/' || path === '/home') {
    renderHomePage();
  } else if (path.startsWith('/events/')) {
    // Extract event ID from path
    const eventId = path.split('/').pop();
    renderHomePage(); // Ensure this updates based on eventId
    // Make sure renderHomePage handles eventId correctly
  } else {
    if (localStorage.getItem('token')) {
      window.history.replaceState({}, '', '/');
      renderHomePage();
    } else {
      window.history.replaceState({}, '', '/login');
      renderLoginPage();
    }
  }
}