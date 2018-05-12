  // Client ID and API key from the Developer Console
  var CLIENT_ID = '756282087657-uek2sfh4vii0jhodc3f5arcjckifidf9.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyBcEKsOt2ol9hWFaLGUGgFdsm9YVQHFMlQ';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

  var authorizeButton = document.getElementById('authorize-button');
  var signoutButton = document.getElementById('signout-button');
  var username = document.getElementById('username');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
      gapi.load('client:auth2', initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn) {
    console.log("isSignedIn: " + isSignedIn);
    clearOrders();
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      listOrders();
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  function clearOrders() {
    document.getElementById('table_div').innerHTML='<tbody></tbody>';
  }

  function listOrders() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1WZ34E0cr1q8bfGbH_lqNzZJO5e0vtE1lhVm71L_jSOA',
      range: 'order!A1:J',
    }).then(function(response) {

      var range = response.result;
      if (isUserAuthorized()) {
        var userEmail = getUserEmail();
        if (userEmail) {

          if (range.values.length > 0) {

            for (i = 0; i < range.values.length; i++) {

              if (range.values[i][0] === userEmail || range.values[i][0] === 'user') {
                console.log(range.values[i]);
                var row = range.values[i];
                var data = "";

                for (j = 0; j < row.length; j++) {
                  data = data + '<td>'+row[j]+'</td>'
                }

                $('#table_div > tbody:first').append('<tr>'+ data +'</tr>');
                data = "";
              }

            }

          }
        }
      }
    }, function(response) {
         console.log(response);
    });
  }

  function isUserAuthorized() {
    if (gapi.auth2) {
      if (gapi.auth2.getAuthInstance()) {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          return true;
        }
      }
    }

    return false;
  }

  function getUserEmail() {
    if (isUserAuthorized()) {
      var userEmail = gapi.auth2.getAuthInstance().currentUser.Ab.w3.U3;
      return userEmail;
    }
  }
