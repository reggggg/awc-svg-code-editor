import { strapi } from "./client";
import { getFloorplan } from "./floorplans";
import { editor } from "./editor";

export class Events {
  getSelectedEventId() {
    const pathnames = document.location.pathname.split('/'); 
    return pathnames[pathnames.length - 1];
  }

  // Function to attach the event listener for navigation
  attachEventNavigationListener(selectElement) {
    selectElement.addEventListener('change', this.handleSelectChange);
  }

  // Function to handle the select change event
  handleSelectChange(event) {
    const selectedValue = event.target.value.toLowerCase();
    window.router.goTo(`/events/${selectedValue}`);
  }
  
  async setEvents(id) {
    const selectElement = document.getElementById('event-selector');
  
    // Set the select element to a loading state
    selectElement.innerHTML = '<option>Loading...</option>';
    selectElement.disabled = true;
  
    try {
      // Fetch data from the Strapi endpoint
      const response = await strapi.get('/aw-conferences');
      if (!response.data) throw new Error('Nothing found');
      
      const conferences = response.data;
  
      // Clear the loading option and keep the placeholder
      selectElement.innerHTML = '<option disabled selected>Select an event</option>';
  
      // Append new options based on the fetched data
      conferences.forEach(conference => {
        const option = document.createElement('option');
        option.value = conference.id;
        option.textContent = conference.name;
        selectElement.appendChild(option);
      });
  
      // Get the current path and match it to the options
      const path = id ?? this.getSelectedEventId();
      const matchedOption = Array.from(selectElement.options).find(option => option.value === path);
  
      if (matchedOption) {
        selectElement.value = matchedOption.value;
        await getFloorplan(selectElement.value);
      } else if (selectElement.options.length > 0) {
        // If there is no selected event
        selectElement.value = selectElement.options[0].value;
        editor.setValue(`Select event to write`);
        editor.updateOptions({ readOnly: true });
        const btnSave = document.getElementById("save");
        const btnDownload = document.getElementById("download");
        const btnUpload = document.getElementById("upload");
        btnSave.disabled = true;
        btnDownload.disabled = true;
        btnUpload.disabled = true;
      }
    } catch (error) {
      console.error(error.message);
      selectElement.innerHTML = '<option>Error loading conferences</option>';
    } finally {
      selectElement.disabled = false;
  
      // Attach event listener for navigation after the select is enabled
      this.attachEventNavigationListener(selectElement);
    }
  }
}
