import { strapi, strapi_auth } from "./client";
import { editor } from "./editor";
import { toast } from "./toast";

let selectedEventFloorplan = null;

export async function getFloorplan(conferenceId) {
  try {
    const response = await strapi.get(`/aw-floorplans?conference=${conferenceId}`);
    const data = response.data[0]
    selectedEventFloorplan = data;

    if (!data) throw new Error('No floorplan found');

    editor.setValue(selectedEventFloorplan?.floorplan);
    editor.updateOptions({ readOnly: false });
  } catch (err) {
    // If there is no floorplan
    editor.setValue(`Write or upload your SVG here`);
    editor.updateOptions({ readOnly: false });
    console.error(err.message);
  }
}

export async function saveFloorplan(data) {
  if (selectedEventFloorplan) return updateFloorplan(data); 

  try {
    const response = await strapi_auth.post(`/aw-floorplans`, data);
    if (!response.data) throw new Error('Failed to save floorplan');
    selectedEventFloorplan = response.data;
    toast.success('New floorplan saved!');
  } catch (err) {
    toast.error(err.message);
  }
}

export async function updateFloorplan(data) {
  // If no changes, do nothing
  if (data?.floorplan === selectedEventFloorplan?.floorplan) return;
  try {
    const response = await strapi_auth.put(`/aw-floorplans/${selectedEventFloorplan?.id}`, {
      floorplan: data?.floorplan
    });
    if (!response.data) throw new Error('Failed to patch floorplan');
    selectedEventFloorplan = response.data;
    toast.success('Update floorplan success!');
  } catch (err) {
    toast.error(err.message);
  }
}