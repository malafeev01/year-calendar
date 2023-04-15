import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import EditEventDialog, { EMPTY_EVENT } from "./edit-event-dialog";
import { IndexMock } from "../../../index.mock";
import React from "react";
import { EditModalRef } from "../../common/types";
import { mockMatchMedia } from "../../../common/mocks/window-mocks";
import { ApiMock } from "../../../api/google-api.mock";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../../../common/utilities";

const eventModalRef = React.createRef<EditModalRef>();
const onCreateEventMock = jest.fn(() => Promise.resolve());
const onUpdateEventMock = jest.fn(() => Promise.resolve());

let apiMock: ApiMock;

beforeEach(() => {
  apiMock = new ApiMock();
  mockMatchMedia();

  render(
    <IndexMock api={apiMock}>
      <EditEventDialog
        ref={eventModalRef}
        onCreateEvent={onCreateEventMock}
        onUpdateEvent={onUpdateEventMock}
      />
    </IndexMock>
  );
});

test("Edit event dialog is rendered and ready to work(new mode)", async () => {
  act(() => eventModalRef.current?.open(EMPTY_EVENT, "new"));

  await waitFor(() => {
    expect(screen.getByText(/New event/)).toBeInTheDocument();
    expect(
      screen.getByTestId<HTMLInputElement>("event_summary_input").value
    ).toBe("");
    expect(
      screen.getByTestId<HTMLInputElement>("wholeday_switch").className
    ).toContain("ant-switch-checked");

    expect(
      screen.getByTestId<HTMLInputElement>("event_start_date").value
    ).toContain(EMPTY_EVENT.start.date);
    expect(
      screen.getByTestId<HTMLInputElement>("event_start_time").value
    ).toContain(EMPTY_EVENT.start.dateTime);
    expect(
      screen.getByTestId<HTMLInputElement>("event_end_date").value
    ).toContain(EMPTY_EVENT.end.date);
    expect(
      screen.getByTestId<HTMLInputElement>("event_end_time").value
    ).toContain(EMPTY_EVENT.end.dateTime);

    expect(
      (screen.getByText(/Create/).parentNode as HTMLInputElement).disabled
    ).toBe(true);
  });
});

test("Edit event dialog is rendered and ready to work(edit mode)", async () => {
  const event = {
    summary: "Test event",
    start: { date: "2023-10-10" },
    end: { date: "2023-10-11" },
    description: "Test event Test event Test event",
    colorId: 2,
  };

  act(() => eventModalRef.current?.open(event, "edit"));

  await waitFor(() => {
    expect(screen.getByText(/Event: Test event/)).toBeInTheDocument();
    expect(
      screen.getByTestId<HTMLInputElement>("event_summary_input").value
    ).toBe(event.summary);
    expect(
      screen.getByTestId<HTMLInputElement>("wholeday_switch").className
    ).toContain("ant-switch-checked");

    expect(
      screen.getByTestId<HTMLInputElement>("event_start_date").value
    ).toContain(event.start.date);
    expect(
      screen.getByTestId<HTMLInputElement>("event_start_time").value
    ).toContain("");
    expect(
      screen.getByTestId<HTMLInputElement>("event_end_date").value
    ).toContain(event.end.date);
    expect(
      screen.getByTestId<HTMLInputElement>("event_end_time").value
    ).toContain("");

    expect(
      (screen.getByText(/Save/).parentNode as HTMLInputElement).disabled
    ).toBe(false);
  });
});

test("Whole day switch is working", async () => {
  const event = {
    summary: "Test event",
    start: { dateTime: "2023-10-10T19:00:00" },
    end: { dateTime: "2023-10-10T20:00:00" },
    description: "Test event Test event Test event",
    colorId: 2,
  };

  act(() => eventModalRef.current?.open(event, "edit"));

  await waitFor(() => {
    let wholedaySwitch =
      screen.getByTestId<HTMLInputElement>("wholeday_switch");
    expect(wholedaySwitch.className).not.toContain("ant-switch-checked");

    expect(
      screen.getByTestId<HTMLInputElement>("event_start_time").disabled
    ).toBe(false);

    expect(
      screen.getByTestId<HTMLInputElement>("event_end_time").disabled
    ).toBe(false);
    act(() => wholedaySwitch.click());

    wholedaySwitch = screen.getByTestId<HTMLInputElement>("wholeday_switch");
    expect(wholedaySwitch.className).toContain("ant-switch-checked");
    expect(
      screen.getByTestId<HTMLInputElement>("event_start_time").disabled
    ).toBe(true);

    expect(
      screen.getByTestId<HTMLInputElement>("event_end_time").disabled
    ).toBe(true);
  });
});

test("Event can be created", async () => {
  const event = {
    summary: "Test event",
    start: { date: "2023-10-10" },
    end: { date: "2023-10-11" },
    description: "Test event Test event Test event",
    colorId: 2,
  };

  act(() => eventModalRef.current?.open(event, "new"));

  await waitFor(() => {
    const createButton = screen.getByText(/Create/);
    act(() => createButton.click());
    expect(onCreateEventMock).toHaveBeenCalled();
  });
});

test("Event can be updated", async () => {
  const event = {
    summary: "Test event",
    start: { date: "2023-10-10" },
    end: { date: "2023-10-11" },
    description: "Test event Test event Test event",
    colorId: 2,
  };

  act(() => eventModalRef.current?.open(event, "edit"));

  await waitFor(() => {
    const saveButton = screen.getByText(/Save/).parentNode as HTMLInputElement;
    act(() => saveButton.click());
    expect(onUpdateEventMock).toHaveBeenCalled();
  });
});

test("Value of the controls can be changed(whole day event)", async () => {
  const event = {
    summary: "Test event",
    start: { date: "2023-10-10" },
    end: { date: "2023-10-11" },
    description: "Test event Test event Test event",
    colorId: 2,
  };

  act(() => eventModalRef.current?.open(event, "new"));

  const startDateCombobox =
    screen.getByTestId<HTMLInputElement>("event_start_date");

  fireEvent.mouseDown(startDateCombobox);
  fireEvent.change(startDateCombobox, {
    target: { value: "2023-01-02" },
  });

  let selected = document.querySelector(".ant-picker-cell-selected");
  if (selected) fireEvent.click(selected);

  const endDateCombobox =
    screen.getByTestId<HTMLInputElement>("event_end_date");

  fireEvent.mouseDown(endDateCombobox);
  fireEvent.change(endDateCombobox, {
    target: { value: "2023-01-05" },
  });

  selected = document.querySelectorAll(".ant-picker-cell-selected")[1];
  if (selected) fireEvent.click(selected);

  const summaryInput = screen.getByTestId<HTMLInputElement>(
    "event_summary_input"
  );
  act(() => fireEvent.change(summaryInput, { target: { value: "test123" } }));

  const descriptionInput = screen.getByTestId<HTMLInputElement>(
    "event_description_input"
  );
  act(() =>
    fireEvent.change(descriptionInput, {
      target: { value: "test123description" },
    })
  );
  await act(async () => screen.getByText(/Create/).click());

  expect(apiMock.createEvent).toHaveBeenCalledWith({
    colorId: 2,
    description: "test123description",
    end: {
      date: "2023-01-05",
    },
    start: {
      date: "2023-01-02",
    },
    summary: "test123",
  });
});

test("Value of the controls can be changed(not a whole day event)", async () => {
  const event = {
    summary: "Test event",
    start: { date: "2023-10-10" },
    end: { date: "2023-10-11" },
    description: "Test event Test event Test event",
    colorId: 2,
  };

  act(() => eventModalRef.current?.open(event, "new"));

  const wholedaySwitch =
    screen.getByTestId<HTMLInputElement>("wholeday_switch");
  act(() => {
    wholedaySwitch.click();
  });

  const startTimeCombobox =
    screen.getByTestId<HTMLInputElement>("event_start_time");

  fireEvent.click(startTimeCombobox);
  fireEvent.change(startTimeCombobox, {
    target: { value: "02:00" },
  });

  let selected = document.querySelector(".ant-picker-ok button");
  if (selected) fireEvent.click(selected);

  const endTimeCombobox =
    screen.getByTestId<HTMLInputElement>("event_end_time");

  fireEvent.mouseDown(endTimeCombobox);
  act(() =>
    fireEvent.change(endTimeCombobox, {
      target: { value: "01:00" },
    })
  );

  selected = document.querySelectorAll(".ant-picker-ok button")[1];
  if (selected) fireEvent.click(selected);

  await act(async () => screen.getByText(/Create/).click());
  waitFor(() =>
    expect(apiMock.createEvent).toHaveBeenCalledWith({
      colorId: 2,
      description: "Test event Test event Test event",
      end: {
        dateTime: `${dayjs().format(DATE_FORMAT)}T01:00:00+03:00`,
      },
      start: {
        dateTime: `${dayjs().format(DATE_FORMAT)}T02:00:00+03:00`,
      },
      summary: "Test event",
    })
  );
});

test("Can be closed", async () => {
  act(() => eventModalRef.current?.open(EMPTY_EVENT, "new"));

  expect(
    document.querySelector<HTMLDivElement>(".ant-modal-wrap")?.style.display
  ).toBe("");

  act(() => screen.getByText(/Cancel/).click());

  expect(
    document.querySelector<HTMLDivElement>(".ant-modal-wrap")?.style.display
  ).toBe("none");
});
