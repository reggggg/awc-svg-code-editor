import { setEvents } from "../events";
import { renderHomePage } from "../pages/home";
import { renderLoginPage } from "../pages/login";

export function router() {
  const hash = window.location.hash.slice(1);
  const [route, param] = hash.split('/');

  // Check for token
  if (!localStorage.getItem('token')) {
    return renderLoginPage();
  } 

  // Default to home page if no route is provided
  if (!route) {
    return renderHomePage();
  }

  switch (route) {
    case 'home':
      renderHomePage();
      break;
    case 'login':
      renderLoginPage();
      break;
    case 'events':
      renderHomePage(); // Render the same UI as home
      if (param) {
        setEvents(param); // Call additional functions specific to the event
      }
      break;
    default:
      document.getElementById('app').innerHTML = '<h1>404</h1><p>Page not found.</p>';
      break;
  }
}