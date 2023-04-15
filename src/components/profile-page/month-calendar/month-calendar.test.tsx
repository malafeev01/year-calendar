import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { IndexMock } from "../../../index.mock";
import { mockMatchMedia } from "../../../common/mocks/window-mocks";
import { ApiMock } from "../../../api/google-api.mock";
import { CalendarEvent } from "../../../api/google-api";

import MonthCalendar from "./month-calendar";

const onDeleteEventMock = jest.fn(() => Promise.resolve());
const onShowEditDialogMock = jest.fn(() => Promise.resolve());

let apiMock: ApiMock;

const events: CalendarEvent[] = [
  {
    id: "123",
    summary: "Test event 1",
    description: "Test desc 1",
    start: { date: "2023-10-05" },
    end: { date: "2023-10-14" },
    colorId: 1,
  },

  {
    id: "223",
    summary: "Test event 2",
    description: "Test desc 2",
    start: { date: "2023-10-15" },
    end: { date: "2023-10-17" },
    colorId: 1,
  },

  {
    id: "323",
    summary: "Test event 3",
    description: "Test desc 3",
    start: { date: "2023-11-19" },
    end: { date: "2023-11-21" },
    colorId: 1,
  },
];

beforeEach(() => {
  apiMock = new ApiMock();
  mockMatchMedia();

  render(
    <IndexMock api={apiMock}>
      <MonthCalendar
        year={2023}
        month={9}
        calendarEvents={events}
        onShowEditDialog={onShowEditDialogMock}
        onDeleteEvent={onDeleteEventMock}
      />
    </IndexMock>
  );
});

test("Events is shown on the month calendar", async () => {
  const eventCell = screen.getByTestId("2023-10-10");

  act(() => fireEvent.mouseEnter(eventCell));
  await waitFor(() =>
    expect(document.querySelector(".event-popup-row")).toBeInTheDocument()
  );

  act(() => screen.getByTestId("edit_event_icon_0").click());

  expect(onShowEditDialogMock).toHaveBeenCalledWith(events[0], "edit");

  act(() => screen.getByTestId("delete_event_icon_0").click());

  expect(onDeleteEventMock).toHaveBeenCalledWith(events[0]);
});

test("Nothing happend on mouseup, mousedown", async () => {
  const eventCell = screen.getByTestId("2023-10-10");

  act(() => fireEvent.mouseEnter(eventCell));
  await waitFor(() =>
    expect(document.querySelector(".event-popup-row")).toBeInTheDocument()
  );
  const editButton = screen.getByTestId("edit_event_icon_0");
  fireEvent.mouseDown(editButton);
  fireEvent.mouseUp(editButton);

  expect(onShowEditDialogMock).not.toHaveBeenCalled();

  const deleteButton = screen.getByTestId("delete_event_icon_0");
  fireEvent.mouseDown(deleteButton);
  fireEvent.mouseUp(deleteButton);

  expect(onDeleteEventMock).not.toHaveBeenCalled();
});
