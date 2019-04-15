AuthUserContext creates a React context to pass the authenticated user between pages
as _authUser_.

It also provides the withAuthentication() wrapper function to wrap a higher level
component with the Provider, and adds a listener for firebase's _onAuthUserListener_
to automatically set the authUser variable when it has changed in the session.

```jsx static
<AuthUserContext.Provider value={authUser}>
  <...>
    <AuthUserContext.Consumer>
      {authUser => <Component user={authUser} />}
    </AuthUserContext.Consumer>
  <...>
</AuthUserContext.Provider>
```

For full documentation, see AuthUserContext.jsx file.
