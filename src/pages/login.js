import { strapi } from '../client';
import { toast } from '../toast';
export class LoginPage {
  constructor() {
    this.html = `
      <div class="container-fluid" style="max-width: 360px">
        <h1 class="mt-5 h2">Floorplan Uploader</h1>
        <form id="login-form">
          <div class="form-group mt-2">
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Enter username">
          </div>
          <div class="form-group mt-2">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Enter Password">
          </div>
          <button id="login-save" type="submit" class="btn btn-primary mt-4">Login</button>
        </form>
      </div>  
    `;
  }

  init() {
    const form = document.getElementById('login-form'); 

    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const loginBtn = document.getElementById('login-save');
  
      if (!username || !password) return;
  
      try {
        loginBtn.disabled = true;
        
        const response = await strapi.post('/auth/local', {
          identifier: username,
          password
        });
  
        localStorage.setItem('token', response.data?.jwt);
        window.router.goTo('/');
      } catch (err) {
        toast.error(err.response.data?.data[0]?.messages[0].message);
        form.reset();
      } finally {
        loginBtn.disabled = false;
      }
    });
  }
}