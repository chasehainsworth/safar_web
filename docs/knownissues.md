The following are known issues with the application:

- If a faulty entry is in the database (doesn't match the database schema), pages that access that data can infinitely load (or fail to load).

- The administrator page loads all existing providers at once.

- Deleting a provider does not currently delete the attached user or uploaded images.

See a current list on [Github](https://github.com/chasehainsworth/safar_web/issues).
