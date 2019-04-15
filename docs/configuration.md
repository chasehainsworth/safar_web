To configure the Web Portal to connect to Firebase and run, create a file in the root directory named .env with the following variables:

```python
REACT_APP_API_KEY=XXxxXxXXXXXXX-xXxxxxxxXXXxxXXxXXxXXx-Xx
REACT_APP_AUTH_DOMAIN=xxxxx-xxxxx.firebaseapp.com
REACT_APP_DATABASE_URL=https://xxxxx-xxxxx.firebaseio.com
REACT_APP_PROJECT_ID=xxxxx-xxxxx
REACT_APP_STORAGE_BUCKET=xxxxx-xxxxx.appspot.com
REACT_APP_MESSAGING_SENDER_ID=XXXXXXXXXXX
```

These can be gathered from the firebase control panel.

To separate development and production instances, you can have both .env.development and .env files, and create-react-app will use development when running a local version and production when built.
