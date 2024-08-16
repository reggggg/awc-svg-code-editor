import './style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { router } from './src/js/router';

// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial load
window.addEventListener('load', router);