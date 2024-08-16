import '../style.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Split from 'split.js';
import { setEvents, getSelectedEventId } from '../src/events.js';
import { initializeMonaco, editor } from '../src/editor.js';
import { saveFloorplan } from '../src/floorplans.js';

export function renderHomePage() {
  document.querySelector('#app').innerHTML = `
    <div>
      <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top px-2">
        <a class="navbar-brand" href="#">Floorplan Uploader</a>

        <div class="d-flex gap-1 w-100 mx-1">
          <select id="event-selector" class="form-control w-auto"></select>
          <button id="upload" class="btn btn-outline-secondary">Upload</button>
          <button id="download" class="btn btn-outline-secondary">Download</button>
          <button id="save" class="btn btn-success">Save</button>
        </div>
        <button id="logout" class="btn btn-danger">Logout</button>
      </nav>

      <input type="file" id="file_upload" accept="image/svg+xml" style="display: none;" />

      <div id="main">
        <div id="editor"></div>
        <div id="output"></div>
      </div>

      <div id="footer" class="bg-dark text-light">
        Copyright
      </div>
    </div>
  `;

  Split(['#editor', '#output'], { gutterSize: 5 });

  // Initialize the Monaco editor
  initializeMonaco('editor');

  function render() {
    document.getElementById('output').innerHTML = editor.getValue();
  }

  editor.onDidChangeModelContent((event) => {
    render();
  });

  // Save
  const btnSave = document.getElementById("save");

  btnSave.addEventListener('click', async function () {
    let eventId = getSelectedEventId();
    let text = editor.getValue();

    btnSave.disabled = true;
    btnSave.textContent = 'Saving...';

    await saveFloorplan({ conference: eventId, floorplan: text });
    btnSave.disabled = false;
    btnSave.textContent = 'Save';
  });

  // Upload
  document.getElementById("file_upload").addEventListener('change', function () {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      data = data.replace("data:image/svg+xml;base64,", "");
      editor.setValue(window.atob(data));
    };
    reader.readAsDataURL(this.files[0]);
  });

  // Download
  document.getElementById("download").addEventListener('click', function () {
    const text = editor.getValue();
    var uniqueId = getSelectedEventId();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:image/svg+xml;base64,' + window.btoa(text));
    element.setAttribute('download', uniqueId + ".svg");
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  });

  document.getElementById("upload").addEventListener('click', function () {
    document.getElementById("file_upload").click();
  });

    // Logout
  document.getElementById("logout").addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = '/login';
  });

  setEvents();
}