import './style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import VanillaJSRouter from '@daleighan/vanilla-js-router';
import { LoginPage } from './src/pages/login';
import { HomePage } from './src/pages/home';
import { Events } from './src/events';

function getHomePageConstructor(eventId) {
  const home = new HomePage();
  const events = new Events();
  const container = document.createElement('div');
  container.innerHTML = home.html;
  // If there is no jwt, go redirect to login
  if (!localStorage.getItem('token')) {
    requestAnimationFrame(() => {
      window.router.goTo('/login');
    })
  } else {
    requestAnimationFrame(() => {
      home.init();
      events.setEvents(eventId);
      
    });
  }
  return container;
}

const routes = {
	'/': () => getHomePageConstructor(),
  '/events/:id': ({ params }) => getHomePageConstructor(params.id),
	'/login': () => {
    const login = new LoginPage();
    const container = document.createElement('div');
    container.innerHTML = login.html;
    requestAnimationFrame(() => {
      login.init();
    });
    return container;
  },
}

const options = {
  errorHTML: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
          <h1 class="display-4">404</h1>
          <p class="lead">Page Not Found</p>
          <a href="/" class="router-link btn btn-primary">Go to Homepage</a>
        </div>
      </div>
    `;
    return container;
  },
};

new VanillaJSRouter('app', routes, options);