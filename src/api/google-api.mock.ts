import {
  Calendar,
  CalendarEvent,
  FetchResponse,
  Session,
  UserProfile,
} from "./google-api";

export class ApiMock {
  session: Session | null;

  constructor() {
    this.session = null;
  }

  signIn = jest.fn(() => null);
  signOut = jest.fn(() => null);

  isSignedIn = jest.fn(() => (this.session ? true : false));

  getSession: jest.Mock<Promise<void>> = jest.fn(() => Promise.resolve());

  getUserProfile: jest.Mock<UserProfile> = jest.fn(() => {
    return {
      getName: () => "test",
    };
  });

  getCalendars: jest.Mock<Promise<Calendar[]>> = jest.fn(() =>
    Promise.resolve([])
  );

  isCalendarExist: jest.Mock<Promise<boolean>> = jest.fn(() =>
    Promise.resolve(true)
  );

  createCalendar: jest.Mock<Promise<FetchResponse<Calendar>>> = jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () => Promise.resolve(),
      result: {
        id: "123",
        summary: "123",
      },
    })
  );

  getEvents: jest.Mock<Promise<CalendarEvent[]>> = jest.fn(() =>
    Promise.resolve([])
  );

  createEvent: jest.Mock<Promise<FetchResponse<CalendarEvent>>> = jest.fn(
    (calendarEvent: CalendarEvent) =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(),
        result: {
          id: "123",
          summary: calendarEvent.summary,
          description: calendarEvent.description,
          colorId: calendarEvent.colorId,
          start: calendarEvent.start,
          end: calendarEvent.end,
        },
      })
  );

  deleteEvent: jest.Mock<Promise<FetchResponse<{}>>> = jest.fn(
    (calendarEvent: CalendarEvent) =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(),
        result: {},
      })
  );

  updateEvent: jest.Mock<Promise<FetchResponse<CalendarEvent>>> = jest.fn(
    (calendarEvent: CalendarEvent) =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(),
        result: {
          id: "123",
          summary: calendarEvent.summary,
          description: calendarEvent.description,
          colorId: calendarEvent.colorId,
          start: calendarEvent.start,
          end: calendarEvent.end,
        },
      })
  );
}
