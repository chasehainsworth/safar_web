Passes the firebase object between Components.

Params:

- firebase: Firebase Object

The Provider is implemented at the top of this application tree; any component that
needs to access firebase can become a consumer. A method _withFirebase()_ is also exposed as a wrapper that will add firebase as a prop to any component.

```jsx static
<FirebaseContext.Provider value={authUser}>
  <...>
    <FirebaseContext.Consumer>
    // Prints out all user ids
      {firebase => (
          <Component>{
            firebase.getUsers().map(u => (
                <p>u.uid</p>
            )
          )}
          </Component>
          )}
    </FirebaseContext.Consumer>
  <...>
</FirebaseContext.Provider>
```

or

```jsx static
class FirebaseNeeded extends Component {
    render () {
        return (
          <Component>{
            this.props.firebase.getUsers().map(u => (
                <p>u.uid</p>
            )
          )}
          </Component>
        );
}
export default withFirebase(FirebaseNeeded)
```
