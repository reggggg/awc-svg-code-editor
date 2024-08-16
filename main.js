import './style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { router } from './src/js/router';

// Listen for history changes
window.addEventListener('popstate', router);

// Initialize the app
router();
