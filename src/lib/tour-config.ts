import { Step } from "react-joyride";

/**
 * Cookie name used to track whether user has completed the site tour
 */
export const TOUR_COOKIE_NAME = "MD_MODELS_has_completed_site_tour";

/**
 * Configuration steps for the application tour using react-joyride
 * Each step defines a target element and content to display
 */
export const TourSteps: Step[] = [
  {
    target: "#editor-tab",
    content: "Click here to start editing your Data Model",
  },
  {
    target: "#graph-tab",
    content:
      "Click here to view your Data Model as a graph and edit it in a visual way",
    disableBeacon: true,
  },
  {
    target: "#preview-tab",
    content: "Click here to preview your Data Model",
    disableBeacon: true,
  },
  {
    target: "#new-document-button-container",
    content: "Click here to create a new document",
    disableBeacon: true,
  },
  {
    target: "#github-file-selector-container",
    content: "Click here to import a Data Model from a GitHub file",
    disableBeacon: true,
  },
  {
    target: "#schema-exporter-container",
    content:
      "Click here to export the Data Model to various formats and programming languages",
    disableBeacon: true,
  },
  {
    target: "#data-model-tutorial-modal-container",
    content: "Click here to learn more about Data Models",
    disableBeacon: true,
  },
];

/**
 * Checks if the user has previously taken the site tour
 * @returns {boolean} True if user has completed tour, false otherwise
 */
export function hasTakenTour(): boolean {
  return document.cookie.includes(TOUR_COOKIE_NAME);
}

/**
 * Sets the cookie to indicate that the user has completed the site tour
 */
export function setTourTaken() {
  document.cookie = `${TOUR_COOKIE_NAME}=true; path=/; max-age=31536000`;
}
