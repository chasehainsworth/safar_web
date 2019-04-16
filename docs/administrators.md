Currently, administrator accounts must be set by the database manager.

To create a new administrator account, the following steps must be taken:

1. Log in to the portal with an existing administrator account
2. Create a new account. Don't fill out their provider information.
3. Open the production server's firebase console.
4. In the database panel, navigate to users.
5. Find the account that was just created, you can click the down arrow on the users collection panel and filter by email and add a condition of the name of the account.
   ![Email filter](/docs/imgs/filter.PNG "Email filter")
6. In the left-most panel, change _role_ to ADMIN
7. Change _camp_ to the name of whatever camp this user will be the administrator of (eg. "Moria").
   ![Admin User Settings](/docs/imgs/admin.PNG "Admin User Settings")

_Note:_ Administrators each control a single camp. When an administrator creates a new provider account, that account will also be linked to the same camp as the administrator, and of course any information they enter will also be linked to that camp.
