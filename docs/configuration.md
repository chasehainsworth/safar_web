To configure the Web Portal to connect to Firebase and run, create a file in the root directory named .env with the following variables:

```python
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_DATABASE_URL=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
```

These can be gathered from the firebase control panel.

To separate development and production instances, you can have both .env.development and .env files, and create-react-app will use development when running a local version and production when built.
