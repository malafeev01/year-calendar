const CALENDAR_NAME = "YearCalendarApp";

export type Session = {
  name: string;
};

export type Calendar = {
  id: string;
  summary: string;
};

export type CalendarEvent = {
  id?: string;
  summary: string;
  description: string;
  colorId: number;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
};

export type ErrorResponse = {
  result: {
    error: {
      code: number;
      message: string;
    };
  };
};

export type FetchResponse<T> = {
  status: number;
  json(): Promise<any>;
  result?: T;
};

export type UserProfile = {
  getName(): string | undefined;
};

class Api {
  session: Session | null;

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

  getSession(): Promise<void> {
    return fetch(`/api/session`, {
      credentials: "include",
    }).then(async (response: FetchResponse<Session>) => {
      if (response.status > 200) {
        this.session = null;
      } else {
        this.session = await response.json();
      }
    });
  }

  getUserProfile(): UserProfile {
    // That is needed for compatibility with Google Api JS library
    return {
      getName: () => {
        return this.session?.name;
      },
    };
  }

  getCalendars(): Promise<Calendar[]> {
    return new Promise((resolve, reject) => {
      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      }
      fetch(`/api/calendars`, {
        credentials: "include",
      }).then(
        async (response: FetchResponse<Calendar[]>) => {
          let resp = await response.json();
          resolve(resp.items);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  isCalendarExist(): Promise<boolean> {
    return this.getCalendars().then((calendars: Calendar[]) => {
      const calendar = calendars.find(
        (calendar) => calendar.summary === CALENDAR_NAME
      );

      if (calendar) {
        localStorage.setItem("calendarId", calendar.id);
        return true;
      }
      return false;
    });
  }

  createCalendar(): Promise<FetchResponse<Calendar>> {
    return new Promise((resolve, reject) => {
      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      }

      this.isCalendarExist().then((exist) => {
        if (exist) {
          reject("Calendar " + CALENDAR_NAME + " already exists");
          return;
        } else {
          const calendar = {
            summary: CALENDAR_NAME,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };
          fetch(`api/calendars`, {
            credentials: "include",
            body: JSON.stringify(calendar),
            method: "CREATE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }).then(
            (response) => {
              resolve(response);
            },
            (err) => {
              reject(err);
            }
          );
        }
      });
    });
  }
  // https://developers.google.com/calendar/api/v3/reference/events/list#iCalUID
  // TODO add timeMax, timeMin
  getEvents(): Promise<CalendarEvent[]> {
    return new Promise((resolve, reject) => {
      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      }
      let calendarId = localStorage.getItem("calendarId");

      fetch(`/api/calendars/${calendarId}/events`, {
        credentials: "include",
      }).then(
        async (response) => {
          let resp = await response.json();
          resolve(resp);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  createEvent(
    calendarEvent: CalendarEvent
  ): Promise<FetchResponse<CalendarEvent>> {
    return new Promise<FetchResponse<CalendarEvent>>((resolve, reject) => {
      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      }

      let calendarId = localStorage.getItem("calendarId");
      fetch(`/api/calendars/${calendarId}/events`, {
        credentials: "include",
        body: JSON.stringify({ event: calendarEvent }),
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(
        async (response) => {
          let data = await response.json();
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteEvent(event: CalendarEvent): Promise<FetchResponse<{}>> {
    return new Promise((resolve, reject) => {
      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      }
      let calendarId = localStorage.getItem("calendarId");
      let eventId = event.id;
      fetch(`/api/calendars/${calendarId}/events/${eventId}`, {
        credentials: "include",
        method: "DELETE",
      }).then(
        (response) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  updateEvent(event: CalendarEvent): Promise<FetchResponse<CalendarEvent>> {
    return new Promise<FetchResponse<CalendarEvent>>((resolve, reject) => {
      if (!this.isSignedIn()) {
        reject("You are not logged in");
        return;
      }

      let calendarId = localStorage.getItem("calendarId");
      let eventId = event.id;
      fetch(`/api/calendars/${calendarId}/events/${eventId}`, {
        credentials: "include",
        body: JSON.stringify({ event: event }),
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(
        async (response) => {
          let data = await response.json();
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}

export default Api;
