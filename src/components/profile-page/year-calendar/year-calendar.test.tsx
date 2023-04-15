import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { IndexMock } from "../../../index.mock";
import { mockMatchMedia } from "../../../common/mocks/window-mocks";
import { ApiMock } from "../../../api/google-api.mock";
import YearCalendar from "./year-calendar";
import dayjs from "dayjs";
import { CalendarEvent } from "../../../api/google-api";

let apiMock: ApiMock;

const events: CalendarEvent[] = [
  {
    id: "123",
    summary: "Test event 1",
    description: "Test desc 1",
    start: { date: `${dayjs().year()}-10-05` },
    end: { date: `${dayjs().year()}-10-14` },
    colorId: 1,
  },

  {
    id: "223",
    summary: "Test event 2",
    description: "Test desc 2",
    start: { date: `${dayjs().year()}-10-15` },
    end: { date: `${dayjs().year()}-10-17` },
    colorId: 1,
  },

  {
    id: "323",
    summary: "Test event 3",
    description: "Test desc 3",
    start: { date: `${dayjs().year()}-11-19` },
    end: { date: `${dayjs().year()}-11-21` },
    colorId: 1,
  },
];

describe("Desktop mode tests", () => {
  beforeEach(async () => {
    mockMatchMedia();
    apiMock = new ApiMock();
    apiMock.getEvents = jest.fn(() => Promise.resolve(events));
    render(
      <IndexMock api={apiMock}>
        <YearCalendar />
      </IndexMock>
    );
    await waitForElementToBeRemoved(() =>
      document.querySelector(".load-spinner-container")
    );
  });
  test("Year calendar can be shown", async () => {
    expect(document.querySelectorAll(".calendar-row-container").length).toBe(
      12
    );
    expect(
      document.querySelector(".year-calendar-current-year")?.textContent
    ).toBe(dayjs().year().toString());
  });

  test("Current year can be switched", async () => {
    act(() => screen.getByTestId("set_previous_year").click());
    await waitForElementToBeRemoved(() =>
      document.querySelector(".load-spinner-container")
    );
    expect(
      document.querySelector(".year-calendar-current-year")?.textContent
    ).toBe((dayjs().year() - 1).toString());

    act(() => screen.getByTestId("set_next_year").click());
    await waitForElementToBeRemoved(() =>
      document.querySelector(".load-spinner-container")
    );
    expect(
      document.querySelector(".year-calendar-current-year")?.textContent
    ).toBe(dayjs().year().toString());

    act(() => screen.getByTestId("set_next_year").click());
    await waitForElementToBeRemoved(() =>
      document.querySelector(".load-spinner-container")
    );
    expect(
      document.querySelector(".year-calendar-current-year")?.textContent
    ).toBe((dayjs().year() + 1).toString());
  });

  test("Can create an event", async () => {
    const date = `${dayjs().year()}-02-08`;
    const dateCell = screen.getAllByTestId(date)[0];

    act(() => fireEvent.mouseDown(dateCell));
    act(() => fireEvent.mouseUp(dateCell));

    await waitFor(() =>
      expect(screen.getByText(/New event/)).toBeInTheDocument()
    );

    expect(
      screen.getByTestId<HTMLInputElement>("event_start_date").value
    ).toContain(date);

    expect(
      screen.getByTestId<HTMLInputElement>("event_end_date").value
    ).toContain(date);

    const summaryInput = screen.getByTestId<HTMLInputElement>(
      "event_summary_input"
    );
    act(() => fireEvent.change(summaryInput, { target: { value: "test123" } }));

    await act(async () => screen.getByText(/Create/).click());

    expect(apiMock.createEvent).toHaveBeenCalledWith({
      colorId: 11,
      description: "",
      end: {
        dateTime: dayjs(date).format(),
      },
      start: {
        dateTime: dayjs(date).format(),
      },
      summary: "test123",
    });

    await waitFor(() =>
      expect(screen.getByText(/Event "test123" has been successfully created/))
    );
  });

  test("Can do selection", async () => {
    const startDate = `${dayjs().year()}-02-08`;
    const endDate = `${dayjs().year()}-02-09`;

    const startDateCell = screen.getAllByTestId(startDate)[0];
    const endDateCell = screen.getAllByTestId(endDate)[0];

    act(() => fireEvent.mouseDown(startDateCell));
    act(() => fireEvent.mouseOver(endDateCell));
    act(() => fireEvent.mouseUp(endDateCell));

    expect(
      screen.getByTestId<HTMLInputElement>("event_start_date").value
    ).toContain(startDate);

    expect(
      screen.getByTestId<HTMLInputElement>("event_end_date").value
    ).toContain(endDate);
  });

  test("Can update an event", async () => {
    act(() =>
      fireEvent.mouseEnter(screen.getAllByTestId(`${dayjs().year()}-10-06`)[1])
    );
    await waitFor(() =>
      expect(document.querySelector(".event-popup-row")).toBeInTheDocument()
    );

    act(() => screen.getByTestId("edit_event_icon_0").click());

    await waitFor(() =>
      expect(
        screen.getByText(`Event: ${events[0].summary}`)
      ).toBeInTheDocument()
    );

    const summaryInput = screen.getByTestId<HTMLInputElement>(
      "event_summary_input"
    );
    act(() => fireEvent.change(summaryInput, { target: { value: "test556" } }));
    await act(async () => screen.getByText(/Save/).click());

    expect(apiMock.updateEvent).toHaveBeenCalledWith({
      id: "123",
      colorId: events[0].colorId,
      description: events[0].description,
      end: {
        date: events[0].end.date,
      },
      start: {
        date: events[0].start.date,
      },
      summary: "test556",
    });

    await waitFor(() =>
      expect(screen.getByText(/Event "test556" has been successfully updated/))
    );
  });

  test("Can delete an event", async () => {
    act(() =>
      fireEvent.mouseEnter(screen.getAllByTestId(`${dayjs().year()}-10-05`)[1])
    );
    await waitFor(() =>
      expect(document.querySelector(".event-popup-row")).toBeInTheDocument()
    );

    act(() => screen.getByTestId("delete_event_icon_0").click());

    await act(async () => screen.getByText(/Confirm/).click());

    expect(apiMock.deleteEvent).toHaveBeenCalledWith({
      colorId: 1,
      description: "Test desc 1",
      end: {
        date: `${dayjs().year()}-10-14`,
      },
      id: "123",
      start: {
        date: `${dayjs().year()}-10-05`,
      },
      summary: "test556",
    });

    await waitFor(() =>
      expect(screen.getByText(/Event "test556" has been successfully deleted/))
    );
  });

  test("Can create a new calendar", async () => {
    const api = new ApiMock();
    api.isCalendarExist = jest.fn(() => Promise.resolve(false));
    render(
      <IndexMock api={api}>
        <YearCalendar />
      </IndexMock>
    );

    await waitForElementToBeRemoved(() =>
      document.querySelector(".load-spinner-container")
    );

    await waitFor(() =>
      expect(screen.getByText("A new calendar has been created sucessfully."))
    );
  });

  test("Years controls do not react on mousedown, mouseup", async () => {
    const prevYearBtn = screen.getByTestId("set_previous_year");
    act(() => fireEvent.mouseDown(prevYearBtn));
    act(() => fireEvent.mouseUp(prevYearBtn));

    expect(
      document.querySelector(".year-calendar-current-year")?.textContent
    ).toBe(dayjs().year().toString());

    const nextYearBtn = screen.getByTestId("set_next_year");
    act(() => fireEvent.mouseDown(nextYearBtn));
    act(() => fireEvent.mouseUp(nextYearBtn));

    expect(
      document.querySelector(".year-calendar-current-year")?.textContent
    ).toBe(dayjs().year().toString());
  });
});

describe("Mobile mode tests", () => {
  test("Can handle double tap in mobile mode", async () => {
    mockMatchMedia();
    apiMock = new ApiMock();
    Object.defineProperty(window, "navigator", {
      configurable: true,
      writable: true,
      value: {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
        vendor: "Apple Computer, Inc.",
      },
    });

    render(
      <IndexMock api={apiMock}>
        <YearCalendar />
      </IndexMock>
    );

    await waitForElementToBeRemoved(() =>
      document.querySelector(".load-spinner-container")
    );

    act(() =>
      fireEvent.click(screen.getAllByTestId(`${dayjs().year()}-10-01`)[1])
    );
    act(() =>
      fireEvent.click(screen.getAllByTestId(`${dayjs().year()}-10-01`)[1])
    );
    await waitFor(() => {
      expect(screen.getByText(/There are no events/)).toBeInTheDocument();
    });
  });
});
