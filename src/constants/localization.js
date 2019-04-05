import LocalizedStrings from "react-localization";

const strings = new LocalizedStrings({
  en: {
    // Home Page
    ORGANIZATION_PORTAL: "Organization Portal",
    LOGIN: "Login",
    REQUEST_ACCESS: "Request Access",

    // Nav Bar
    UPDATE_ACCOUNT_INFO: "Update Account Info",
    UPDATE_HOURS: "Update Hours",
    UPDATE_SERVICES: "Update Services",
    ADMIN_PAGE: "Admin Page",
    SIGN_OUT: "Sign Out",
    LANGUAGE_SET: "Language set, it may take a moment.",

    // Admin Page
    SUBMITTED_LANGUAGES: "Submitted Languages",
    NUM_OF_SERVICES: "# of Services",
    ACTIONS: "Actions",
    ADD_NEW_ORGANIZATION_ACCOUNT: "Add New Organization Account",
    EDIT_ORGANIZATION_INFO: "Edit Organization Info",
    EDIT_SERVICES: "Edit Services",

    // Add Account Page
    REENTER_PASSWORD: "Re-enter the password",
    CREATE_ACCOUNT: "Create Account",

    // Login Page
    EMAIL: "Email",
    PASSWORD: "Password",
    FORGOT_PASSWORD: "Forgot password?",
    SEND_RESET_PASSWORD_EMAIL: "Send Reset Password Email",
    GO_BACK: "Go back",
    // TODO: Errors in english https://stackoverflow.com/questions/42439504/firebase-error-messages-in-different-languages

    // Update Account Info page
    LANGUAGE: "Language",
    INFO: "Info",
    SOCIALS: "Online Presence",
    CATEGORIES: "Categories",
    FINISHED: "Finished",
    ORGANIZATION_NAME: "Organization Name",
    DESCRIPTION: "Description",
    COUNTRY_OF_ORIGIN: "Country of Origin",
    PHONE_NUMBER: "Phone Number",
    UPLOAD_IMAGES: "Upload Images",
    UPLOAD: "Upload",
    HOURS: "Hours",
    SPECIAL_NOTE: "Any special notes regarding availability?",
    NEXT: "Next",
    PREVIOUS: "Previous",
    ORGANIZATION_WEBSITE: "Organization Website",
    FACEBOOK: "Facebook",
    INSTAGRAM: "Instagram",
    WHATSAPP: "WhatsApp",
    TWITTER: "Twitter",
    // TODO: Categories and tags
    DONE: "Done",
    ADD_ANOTHER_LANGUAGE: "Add another language",
    UPDATE_ACCOUNT_FINISHED_MESSAGE:
      "You're all done. Please try to fill out your information in as many languages as possible.",
    // TODO: All form hints/errors

    // Services Page
    SERVICE: "Service",
    NEW_SERVICE: "New Service",
    NAME: "Name",
    EDIT: "Edit",
    DELETE: "Delete",
    UPLOAD_IMAGE: "Upload Image",
    ADD_NEW_LANGUAGE: "Add New Language",
    DELETE_SERVICE: "Delete Service",
    ADD_NEW_SERVICE: "Add New Service",
    OK: "OK",
    CANCEL: "Cancel",

    // Footer
    COPYRIGHT: "Copyright"
  },
  // French
  fr: {
    // Home Page
    ORGANIZATION_PORTAL: "French",
    LOGIN: "French",
    REQUEST_ACCESS: "French",

    // Nav Bar
    UPDATE_ACCOUNT_INFO: "French",
    UPDATE_HOURS: "French",
    UPDATE_SERVICES: "French",
    ADMIN_PAGE: "French",
    SIGN_OUT: "French",
    LANGUAGE_SET: "French",

    // Admin Page
    SUBMITTED_LANGUAGES: "French",
    NUM_OF_SERVICES: "French",
    ACTIONS: "French",
    ADD_NEW_ORGANIZATION_ACCOUNT: "French",
    EDIT_ORGANIZATION_INFO: "French",
    EDIT_SERVICES: "French",

    // Add Account Page
    REENTER_PASSWORD: "French",
    CREATE_ACCOUNT: "French",

    // Login Page
    EMAIL: "French",
    PASSWORD: "French",
    FORGOT_PASSWORD: "French?",
    SEND_RESET_PASSWORD_EMAIL: "French",
    GO_BACK: "French",
    // TODO: Errors in english https://stackoverflow.com/questions/42439504/firebase-error-messages-in-different-languages

    // Update Account Info page
    LANGUAGE: "French",
    INFO: "French",
    SOCIALS: "French",
    CATEGORIES: "French",
    FINISHED: "French",
    ORGANIZATION_NAME: "French",
    DESCRIPTION: "French",
    COUNTRY_OF_ORIGIN: "French",
    PHONE_NUMBER: "French",
    UPLOAD_IMAGES: "French",
    UPLOAD: "French",
    HOURS: "French",
    SPECIAL_NOTE: "French?",
    NEXT: "French",
    PREVIOUS: "French",
    ORGANIZATION_WEBSITE: "French",
    FACEBOOK: "French",
    INSTAGRAM: "French",
    WHATSAPP: "French",
    TWITTER: "French",
    // TODO: Categories and tags
    DONE: "French",
    ADD_ANOTHER_LANGUAGE: "French",
    UPDATE_ACCOUNT_FINISHED_MESSAGE:
      "French",
    // TODO: All form hints/errors

    // Services Page
    SERVICE: "French",
    NEW_SERVICE: "French",
    NAME: "French",
    EDIT: "French",
    DELETE: "French",
    UPLOAD_IMAGE: "French",
    ADD_NEW_LANGUAGE: "French",
    DELETE_SERVICE: "French",
    ADD_NEW_SERVICE: "French",
    OK: "French",
    CANCEL: "French",

    // Footer
    COPYRIGHT: "French"
  },
  // Arabic
  ar: {},
  // Farsi
  fa: {}
  // https://www.loc.gov/standards/iso639-2/php/code_list.php
});

export function getCurrentLanguageAsString() {
  switch (strings.getLanguage()) {
    case "en":
      return "English";
    case "fr": 
      return "français";
    case "ar":
      return "العربية";
    case "fa":
      return "فارسی";
    default:
      return "English";
  }
}

export default strings;
