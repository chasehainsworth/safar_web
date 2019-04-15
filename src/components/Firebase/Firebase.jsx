import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

/**
 * The base class to control all firebase properties in the application.
 * Keeps track of the following firebase features:
 * * Authentication - To allow user logins
 * * Firestore Database - To store all data
 * * Storage - To upload large files (images)
 * * Functions - To provide extra functionality (emailing for request access)
 *
 * For full documentation, see Firebase.jsx file.
 */
class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */

    this.serverValue = app.firestore.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
    this.functions = app.functions();
    //this.db.settings({ timestampsInSnapshots: true });
  }

  // *** Auth API ***

  /**
   * Create a user in Firebase auth with email and password.
   *
   * @param {String} email
   * @param {String} password
   * @returns Firebase.authUser
   * @public
   */
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  /**
   * Sign in to Firebase auth with email and password.
   *
   * @param {String} email
   * @param {String} password
   * @returns Firebase.authUser
   * @public
   */
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  /**
   * Sign out of Firebase auth
   *
   * @public
   */
  doSignOut = () => this.auth.signOut();

  /**
   * Sends an email to the provided email to reset password.
   *
   * @param {String} email
   * @public
   */
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  /**
   * @unused
   */
  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    });

  /**
   * Sets the password of the current user to the provided password.
   *
   * @param {String} password
   * @public
   */
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(snapshot => {
            let dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.role) {
              dbUser.role = null;
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  //// Collections ////

  // *** User API ***

  /**
   * Gets a user's properties by uid
   *
   * @param {string} uid
   * @returns Firestore.Document
   * @public
   */
  user = uid => this.db.doc(`users/${uid}`);

  /**
   * Gets a list of all users
   * @returns Firestore.Collection
   * @public
   */
  users = () => this.db.collection("users");

  // *** Providers API ***

  /**
   * Gets a provider's information by uid. Providers are linked one-to-one to users by uid.
   *
   * @param {string} uid
   * @returns Firebase.Document
   * @public
   */
  provider = uid => this.db.doc(`providers/${uid}`);

  /**
   * Gets a list of all providers
   * @returns Firestore.Collection
   * @public
   */
  providers = () => this.db.collection("providers");

  /**
   * Gets all translated language elements of a provider's information
   *
   * @param {string} uid
   * @param {[English, French, Arabic, Farsi]} language
   * @returns Firestore.Collection
   * @public
   */
  providerLanguage = (uid, language) =>
    this.provider(uid)
      .collection("languages")
      .doc(language);

  // *** Services API ***

  /**
   * Gets a service's information by it's uid.
   *
   * @param {string} uid
   * @returns Firestore.Document
   * @public
   */
  service = uid => this.db.doc(`services/${uid}`);
  /**
   * Gets a list of all services
   * @returns Firestore.Collection
   * @public
   */
  services = () => this.db.collection("services");

  /**
   * Gets all translated language elements of a service's information
   *
   * @param {string} uid
   * @param {[English, French, Arabic, Farsi]} language
   * @public
   */
  serviceLanguage = (uid, language) =>
    this.service(uid)
      .collection("languages")
      .doc(language);

  /**
   * Gets a reference to the firebase storage.
   *
   * @returns Firebase.StorageRef
   * @public
   */
  storageRef = () => this.storage.ref();

  /**
   * Gets a Reference to the folder where images are stored.
   *
   * @returns Firebase.StorageRef
   * @public
   */
  imageUploads = () => this.storageRef().child("uploads/images");
}

/** @component */
export default Firebase;
