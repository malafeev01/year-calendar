const CALENDAR_NAME = "YearCalendarApp"


class Api {
  constructor() {
    this.session = null;
  }

  signIn() {
    window.location.href = `/api/login`;
  }

  signOut() {
    window.location.href = `/api/logout`;
  }

  isSignedIn() {
    return this.session ? true : false;
  }

  getSession() {
    return fetch(`/api/session`, {
        credentials: "include"
      })
      .then(async function(response) {
        if (response.status > 200) {
          this.session = null;
        } else {
          this.session = await response.json();
        }
      }.bind(this));
  }

  getUserProfile() {
    // That is needed for compatibility with Google Api JS library
    return {
      'getName': function() {
        return this.session.name
      }.bind(this),
      'getImageUrl': function() {
        return this.session.picture
      }.bind(this)
    };
  }


  getCalendars() {
    return new Promise((resolve, reject) => {

      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      };
      fetch(`/api/calendars`, {
          credentials: "include"
        })
        .then(async function(response) {
            let resp = await response.json();
            resolve(resp.items);
          },
          function(err) {
            reject(err);
          });
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

          let calendar = {
            "summary": CALENDAR_NAME,
            "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
          }
          fetch(`api/calendars`, {
              credentials: "include",
              body: JSON.stringify(calendar),
              method: 'CREATE',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
      let calendarId = localStorage.getItem('calendarId');

      fetch(`/api/calendars/${calendarId}/events`, {
          credentials: "include"
        })
        .then(async function(response) {
            let resp = await response.json();
            resolve(resp);
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

      let calendarId = localStorage.getItem('calendarId');
      fetch(`/api/calendars/${calendarId}/events`, {
          credentials: "include",
          body: JSON.stringify({event: event}),
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(async function(response) {
            let data = await response.json()
            resolve(data);
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
      let calendarId = localStorage.getItem('calendarId');
      let eventId = event.id
      fetch(`/api/calendars/${calendarId}/events/${eventId}`, {
          credentials: "include",
          method: 'DELETE'
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

      let calendarId = localStorage.getItem('calendarId');
      let eventId = event.id
      fetch(`/api/calendars/${calendarId}/events/${eventId}`, {
          credentials: "include",
          body: JSON.stringify({event: event}),
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(async function(response) {
            let data = await response.json()
            resolve(data);
          },
          function(err) {
            reject(err);
          });
    });
  }
}

export default Api;
