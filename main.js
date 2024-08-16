import { renderHomePage } from "./pages/home";
import { renderLoginPage } from "./pages/login";

// Basic Router
function router() {
  if (!localStorage.getItem('token') || window.location.pathname.split('/')[1] === 'login') {
    renderLoginPage();
  } else {
    renderHomePage();
  }
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Initialize the app
router();