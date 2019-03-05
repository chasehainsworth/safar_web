import LocalizedStrings from "react-localization";

const strings = new LocalizedStrings({
  en: {
    // Home Page
    PROVIDER_PORTAL: "Provider Portal",
    LOGIN: "Login",
    REQUEST_ACCESS: "Request Access",

    // Nav Bar
    UPDATE_ACCOUNT_INFO: "Update Account Info",
    UPDATE_HOURS: "Update Hours",
    UPDATE_SERVICES: "Update Services",
    ADMIN_PAGE: "Admin Page",
    SIGN_OUT: "Sign Out",

    // Admin Page
    PROVIDER_NAME: "Provider Name",
    SUBMITTED_LANGUAGES: "Submitted Languages",
    NUM_OF_SERVICES: "# of Services",
    ACTIONS: "Actions",
    ADD_NEW_PROVIDER_ACCOUNT: "Add New Provider Account",
    EDIT_PROVIDER_INFO: "Edit Provider Info",
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
    SOCIALS: "Socials",
    CATEGORIES: "Categories",
    FINISHED: "Finished",
    ORGANIZATION_NAME: "Organization Name",
    DESCRIPTION: "Description",
    PHONE_NUMBER: "Phone Number",
    UPLOAD_IMAGES: "Upload Images",
    UPLOAD: "Upload",
    HOURS: "Hours",
    SPECIAL_NOTE: "Any special notes regarding availability?",
    NEXT: "Next",
    PREVIOUS: "Previous",
    ORGANIZATION_WEBSITE: "Organization Website",
    FACEBOOK: "Facebook",
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
  fr: {},
  // Arabic
  ar: {},
  // Farsi
  fa: {}
  // https://www.loc.gov/standards/iso639-2/php/code_list.php
});
export default strings;
