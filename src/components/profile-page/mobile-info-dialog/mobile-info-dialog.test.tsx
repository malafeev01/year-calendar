import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { IndexMock } from "../../../index.mock";
import React, { MutableRefObject } from "react";
import { EditModalRef, InfoModalRef } from "../../common/types";
import { mockMatchMedia } from "../../../common/mocks/window-mocks";
import { ApiMock } from "../../../api/google-api.mock";
import MobileInfoDialog from "./mobile-info-dialog";
import { CalendarEvent } from "../../../api/google-api";
import EditEventDialog from "../edit-event-dialog/edit-event-dialog";

const mobileInfoModalRef = React.createRef<InfoModalRef>();
const editModalRef = React.createRef<EditModalRef>();
const onDeleteEventMock = jest.fn(() => Promise.resolve());
const onCreateEventMock = jest.fn(() => Promise.resolve());
const onUpdateEventMock = jest.fn(() => Promise.resolve());

let apiMock: ApiMock;

const events: CalendarEvent[] = [
  {
    id: "123",
    summary: "Test event 1",
    description: "Test desc 1",
    start: { date: "2023-10-10" },
    end: { date: "2023-10-14" },
    colorId: 1,
  },

  {
    id: "223",
    summary: "Test event 2",
    description: "Test desc 2",
    start: { date: "2023-10-11" },
    end: { date: "2023-10-13" },
    colorId: 1,
  },

  {
    id: "323",
    summary: "Test event 3",
    description: "Test desc 3",
    start: { date: "2023-10-15" },
    end: { date: "2023-10-16" },
    colorId: 1,
  },
];

beforeEach(() => {
  apiMock = new ApiMock();
  mockMatchMedia();

  render(
    <IndexMock api={apiMock}>
      <>
        <EditEventDialog
          ref={editModalRef as React.Ref<EditModalRef>}
          onUpdateEvent={onUpdateEventMock}
          onCreateEvent={onCreateEventMock}
        />

        <MobileInfoDialog
          ref={mobileInfoModalRef}
          events={events}
          editRef={editModalRef as MutableRefObject<EditModalRef | undefined>}
          onDelete={onDeleteEventMock}
        />
      </>
    </IndexMock>
  );
});

test("Mobile info dialog can be opened and closed", async () => {
  act(() => mobileInfoModalRef.current?.open("2023-10-12"));

  expect(
    screen.getByTestId("mobile-info-dialog-container")
  ).toBeInTheDocument();
  expect(document.querySelectorAll(".mobile-event-popup-row").length).toBe(2);

  act(() => screen.getByText<HTMLButtonElement>("Close").click());

  expect(
    screen.queryByTestId("mobile-info-dialog-container")
  ).not.toBeInTheDocument();
});

test("Can create a new event from Mobile info dialog", async () => {
  act(() => mobileInfoModalRef.current?.open("2023-10-12"));

  act(() => screen.getByText(/Create event/).click());
  await waitFor(() =>
    expect(screen.getByText(/New event/)).toBeInTheDocument()
  );

  expect(
    screen.getByTestId<HTMLInputElement>("event_start_date").value
  ).toContain("2023-10-12");

  expect(
    screen.getByTestId<HTMLInputElement>("event_end_date").value
  ).toContain("2023-10-12");
});

test("Can edit event from Mobile info dialog", async () => {
  act(() => mobileInfoModalRef.current?.open("2023-10-12"));

  act(() => screen.getByTestId("edit_event_0").click());

  await waitFor(() =>
    expect(screen.getByText(`Event: ${events[0].summary}`)).toBeInTheDocument()
  );

  expect(
    screen.getByTestId<HTMLInputElement>("event_start_date").value
  ).toContain(events[0].start.date);

  expect(
    screen.getByTestId<HTMLInputElement>("event_end_date").value
  ).toContain(events[0].end.date);
});

test("Can delete event from Mobile info dialog", async () => {
  act(() => mobileInfoModalRef.current?.open("2023-10-12"));

  act(() => screen.getByTestId("delete_event_0").click());

  await waitFor(() =>
    expect(
      screen.getByText(`Event "${events[0].summary}" will be deteled.`)
    ).toBeInTheDocument()
  );

  act(() => screen.getByText("Confirm").click());
  expect(onDeleteEventMock).toHaveBeenCalledWith(events[0]);
});

test("Nothing happend on mouseup, mousedown", async () => {
  act(() => mobileInfoModalRef.current?.open("2023-10-12"));

  const editButton = screen.getByTestId("edit_event_0");
  fireEvent.mouseDown(editButton);
  fireEvent.mouseUp(editButton);

  await waitFor(() =>
    expect(
      screen.queryByText(`Event: ${events[0].summary}`)
    ).not.toBeInTheDocument()
  );

  const deleteButton = screen.getByTestId("delete_event_0");
  fireEvent.mouseDown(deleteButton);
  fireEvent.mouseUp(deleteButton);

  await waitFor(() =>
    expect(
      screen.queryByText(`Event "${events[0].summary}" will be deteled.`)
    ).not.toBeInTheDocument()
  );
});
