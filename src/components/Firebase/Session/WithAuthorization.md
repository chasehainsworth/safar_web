```jsx static
class NeedsAuthorization {
    render() {
        return (
            <...>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(NeedsAuthorization)
```

For full documentation, see WithAuthorization.jsx file.
