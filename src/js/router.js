import { renderHomePage } from "../pages/home";
import { renderLoginPage } from "../pages/login";

export function router() {
  const content = document.getElementById('app');
  const hash = window.location.hash.slice(1);
  const [route, param] = hash.split('/');

  if (!localStorage.getItem('token')) {
    return renderLoginPage();
  } 

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
    default:
      content.innerHTML = '<h1>404</h1><p>Page not found.</p>';
      break;
  }
}


