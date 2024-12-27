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
    target: ".start-tour",
    content: "Click here to start the tour",
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
