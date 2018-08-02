// Client ID and API key from the Developer Console
var CLIENT_ID = '<YOUR_CLIENT_ID>';
var API_KEY = '<YOUR_API_KEY>';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

//Authorization scopes required by the API; 
//see all scopes on site: https://developers.google.com/sheets/api/guides/authorizing
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var username = document.getElementById('username');

//Entry point
//On load, called to load the auth2 library and API client library.
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

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

function updateSigninStatus(isSignedIn) {
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

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

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

              if (range.values[i][0] === userEmail || i === 0)  { // filter only user’s orders
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
  if (gapi.auth2 && gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().isSignedIn.get()) {
        return true;
  }
  return false;
}

function getUserEmail() {
  if (isUserAuthorized()) {
    var userEmail = gapi.auth2.getAuthInstance().currentUser.Ab.w3.U3;
    return userEmail;
  }
}

