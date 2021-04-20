const CLIENT_ID = ""
const API_KEY = ""
const SCOPE = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly"
const DISCOVERY = "https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
const CALENDAR_NAME = "YearCalendarApp"

const gapi = window.gapi;

class Api {

  initialize() {
    return new Promise((resolve, reject) => {
      gapi.load("client:auth2", function() {
        return gapi.auth2.init({
          client_id: CLIENT_ID
        }).then(function(googleAuthObject) {
          console.log('GAPI: Google API has been initialized');

          //If already signed in
          if (googleAuthObject.isSignedIn.get()) {
            gapi.client.setApiKey(API_KEY);
            return gapi.client.load(DISCOVERY).then(function() {
                console.log("GAPI: Client ready for using API");
                resolve();
              },
              function(err) {
                console.error("GAPI: Error loading GAPI client for API", err);
                reject();
              });
          } else {
            resolve();
          }
        });
      });
    });
  }

  signIn() {
    return gapi.auth2.getAuthInstance()
      .signIn({
        scope: SCOPE
      })
      .then(function(response) {
          console.log("GAPI: Sign-in successful");
          gapi.client.setApiKey(API_KEY);
          return gapi.client.load(DISCOVERY)
            .then(function() {
                console.log("GAPI: Client ready for using API");
              },
              function(err) {
                console.error("GAPI: Error loading GAPI client for API", err);
              });
        },
        function(err) {
          console.error("GAPI: Error signing in", err);
        });
  }
  signOut() {
    return this.getSession().signOut()
  }

  isSignedIn() {
    return this.getSession().isSignedIn.get();
  }

  getSession() {

    return gapi.auth2.getAuthInstance();
  }

  getUserProfile() {
    return this.getSession().currentUser.get().getBasicProfile();
  }


  getCalendars() {
    return new Promise((resolve, reject) => {

      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      };

      gapi.client.calendar.calendarList.list({})
        .then(function(response) {

            resolve(response.result.items);
          },
          function(err) {
            reject(err);
          }
        );
    });
  }

  isCalendarExist() {
    return new Promise((resolve, reject) => {
      this.getCalendars().then((calendars) => {
        calendars.forEach(calendar => {
          if (calendar.summary === CALENDAR_NAME) {
            resolve(true);
            localStorage.setItem('calendarId', calendar.id);
          }
        });
        resolve(false);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  createCalendar() {
    return new Promise((resolve, reject) => {

      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      };

      this.isCalendarExist().then((exist) => {
        if (exist) {
          reject('Calendar ' + CALENDAR_NAME + ' already exists');
          return;
        } else {
          gapi.client.calendar.calendars.insert({
              "resource": {
                "summary": CALENDAR_NAME,
                "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
              }
            })
            .then(function(response) {
                resolve(response);
              },
              function(err) {
                reject(err);
              });
        }
      });

    });
  }

  getEvents() {
    return new Promise((resolve, reject) => {

      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      };

      gapi.client.calendar.events.list({
          calendarId: localStorage.getItem('calendarId'),
          showDeleted: false
        })
        .then(function(response) {
            resolve(response.result.items);
          },
          function(err) {
            reject(err);
          });

    });

  }

  createEvent(event) {
    return new Promise((resolve, reject) => {

      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      };
      gapi.client.calendar.events.insert({
          calendarId: localStorage.getItem('calendarId'),
          resource: event
        })
        .then(function(response) {
            resolve(response);
          },
          function(err) {
            reject(err);
          });

    });

  }

  deleteEvent(event) {
    return new Promise((resolve, reject) => {

      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      };

      gapi.client.calendar.events.delete({
          calendarId: localStorage.getItem('calendarId'),
          eventId: event.id
        })
        .then(function(response) {
            resolve(response);
          },
          function(err) {
            reject(err);
          });

    });
  }

  updateEvent(event) {
    return new Promise((resolve, reject) => {

      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      };

      gapi.client.calendar.events.update({
          calendarId: localStorage.getItem('calendarId'),
          eventId: event.id,
          resource: event
        })
        .then(function(response) {
            resolve(response);
          },
          function(err) {
            reject(err);
          });
    });
  }
}

export default Api;
