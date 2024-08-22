import Split from 'split.js';
import { Events } from '../events.js';
import { initializeMonaco, editor } from '../editor.js';
import { generateDataToInjectInFloorplan, saveFloorplan } from '../floorplans.js';
import { toast } from '../toast.js';

export class HomePage {
  constructor() {
    this.html = `
      <div>
        <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top px-2">
          <a class="navbar-brand" href="#" id="home-link">Floorplan Uploader</a>
          <div class="d-flex gap-1 w-100 mx-1">
            <select id="event-selector" class="form-control w-auto"></select>
            <button id="upload" class="btn btn-outline-secondary">Upload</button>
            <button id="download" class="btn btn-outline-secondary">Download</button>
            <button id="inject" class="btn btn-warning">Inject Data</button>
            <button id="save" class="btn btn-success">Save</button>
          </div>
          <button id="logout" class="btn btn-danger">Logout</button>
        </nav>
        <input type="file" id="file_upload" accept="image/svg+xml" style="display: none;" />
        <div id="main">
          <div id="editor"></div>
          <div id="output-container" class="overflow-auto">
            <div id="output"></div>
          </div>
        </div>
        <div id="footer" class="bg-dark text-light">
          Copyright
        </div>
      </div>
    `;
  }

  init() {
    Split(['#editor', '#output-container'], { gutterSize: 5 });

    // Initialize the Monaco editor
    initializeMonaco('editor');

    function render() {
      document.getElementById('output').innerHTML = editor.getValue();
    }

    editor.onDidChangeModelContent((event) => {
      render();
    });

    // Inject data
    let isInjected = false;
    const btnInjectData = document.getElementById("inject");
    btnInjectData.addEventListener('click', async function() {
      btnInjectData.disabled = true;
      btnInjectData.textContent = 'Injecting...';

      try {
        if (isInjected === true) throw new Error('Data is already injected');

        const isGenerateDataSuccess = await generateDataToInjectInFloorplan();
        if (isGenerateDataSuccess) {
          isInjected = true;
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        btnInjectData.disabled = false;
        btnInjectData.textContent = 'Inject Data';
      }
      
    })

    // Save
    const btnSave = document.getElementById("save");
    btnSave.addEventListener('click', async function () {
      const events = new Events();
      let eventId = events.getSelectedEventId();
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
      const events = new Events();
      var uniqueId = events.getSelectedEventId();
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
      window.router.goTo('/login');
    });
  }
}
