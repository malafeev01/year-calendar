import "./year-calendar.css";
import { useEffect, useState, useRef } from "react";
import { Row, Col, Modal, notification as antNotificaion } from "antd";

import MonthCalendar from "../month-calendar/month-calendar";
import EditEventDialog from "../edit-event-dialog/edit-event-dialog";
import MobileInfoDialog from "../mobile-info-dialog/mobile-info-dialog";
import { useStore } from "react-redux";

import dayjs, { Dayjs } from "dayjs";

import { useContext } from "react";
import { APIContext } from "../../../api/api-context";
import { getGoogleColorById } from "../../../common/google-colors";
import {
  daysBetweenDates,
  isDateInArray,
  DATE_FORMAT,
  isMobile,
} from "../../../common/utilities";
import {
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import {
  showSuccessNotification,
  showErrorNotification,
} from "../../../common/notification";
import { LoadSpinner } from "../../common/load-spinner/load-spinner";
import { ThemeStore } from "../../../theme/theme-provider";
import {
  Calendar,
  CalendarEvent,
  ErrorResponse,
  FetchResponse,
} from "../../../api/google-api";
import {
  DialogMode,
  EditModalRef,
  InfoModalRef,
  ReactMouseEvent,
} from "../../common/types";
import { DEFAULT_COLOR_ID } from "../color-item/color-item";

const CELL_SELECTED_CLASS = "calendar-date-cell-selected";
const CELL_CLASS = "ant-picker-cell-in-view";
const ALL_CELLS_CLASS = "ant-picker-cell";
const CELL_INNER_CLASS = "calendar-date-cell";

function YearCalendar() {
  const api = useContext(APIContext);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(dayjs().year());

  const store = useStore<ThemeStore>();
  const theme = store.getState().theme;
  const [modal, modalContextHolder] = Modal.useModal();
  const [notification, notificationContextHolder] =
    antNotificaion.useNotification();

  const eventModalRef = useRef<EditModalRef>();
  const mobileEventModalRef = useRef<InfoModalRef>();

  let dateRangeStart: Dayjs | null;
  let dateRangeEnd: Dayjs | null;
  let selection = false;
  let lastTap: number;

  useEffect(() => {
    setLoading(true);
    api
      .isCalendarExist()
      .then((exist) => {
        if (exist) {
          api
            .getEvents()
            .then((events: CalendarEvent[]) => {
              setEvents(events);
              setLoading(false);
              showEvents(events);
            })
            .catch((error) => {
              showErrorNotification(error, notification);
            });
        } else {
          api
            .createCalendar()
            .then((response: FetchResponse<Calendar>) => {
              localStorage.setItem("calendarId", response.result?.id || "");
              showSuccessNotification(
                "A new calendar has been created sucessfully.",
                notification
              );
              setEvents([]);
              setLoading(false);
            })
            .catch((error) => {
              showErrorNotification(error, notification);
            });
        }
      })
      .catch((error) => {
        showErrorNotification(error, notification);
      });

    return () => {
      if (!api.isSignedIn()) {
        window.location.href = "/";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentYear]);

  const handleMouseDown = (mouseEvent: ReactMouseEvent) => {
    dateRangeStart = null;
    dateRangeEnd = null;

    if (mouseEvent.target.className?.includes(CELL_INNER_CLASS)) {
      selection = true;
      dateRangeStart = dayjs(mouseEvent.target.title);
      updateSelection();
    }
  };

  const updateSelection = () => {
    if (!dateRangeStart || !dateRangeEnd) return;

    let startDate = dateRangeStart;
    let endDate = dateRangeEnd;

    if (dateRangeStart.diff(dateRangeEnd) >= 0) {
      endDate = dateRangeStart;
      startDate = dateRangeEnd;
    }

    let selectedDates = daysBetweenDates(startDate, endDate);
    selectedDates.forEach((selectedDate) => {
      let title = selectedDate.format(DATE_FORMAT).toString();
      let element = document.querySelector(
        `td[title="${title}"][class*="${CELL_CLASS}"]`
      );
      if (element && !element.className.includes(CELL_SELECTED_CLASS)) {
        element.className = element.className + ` ${CELL_SELECTED_CLASS}`;
      }
    });

    let markedElements = document.querySelectorAll(
      `td[class*="${CELL_SELECTED_CLASS}"]`
    );
    markedElements.forEach((markedElement) => {
      if (
        !isDateInArray(
          dayjs((markedElement as HTMLElement & { title: string }).title),
          selectedDates
        )
      ) {
        markedElement.className = markedElement.className
          .replace(CELL_SELECTED_CLASS, "")
          .trim();
      }
    });
  };

  const clearSelection = () => {
    selection = false;
    let markedElements = document.querySelectorAll(
      `td[class*="${CELL_SELECTED_CLASS}"]`
    );
    markedElements.forEach((markedElement) => {
      markedElement.className = markedElement.className
        .replace(CELL_SELECTED_CLASS, "")
        .trim();
    });
  };

  const handleMouseOver = (mouseEvent: ReactMouseEvent) => {
    if (selection) {
      if (mouseEvent.target.className?.includes(CELL_INNER_CLASS)) {
        dateRangeEnd = dayjs(mouseEvent.target.title);
        updateSelection();
      }
    }
  };

  const handleMouseUp = (event: ReactMouseEvent) => {
    selection = false;

    if (event.target && event.target.className?.includes(CELL_INNER_CLASS)) {
      if (!dateRangeStart) return;
      if (!dateRangeEnd) {
        dateRangeEnd = dateRangeStart;
      }
      let startDate = dateRangeStart;
      let endDate = dateRangeEnd;

      if (dateRangeStart.diff(dateRangeEnd) >= 0) {
        endDate = dateRangeStart;
        startDate = dateRangeEnd;
      }

      let startObj = {};
      let endObj = {};
      if (dateRangeEnd === dateRangeStart) {
        startObj = { dateTime: dayjs(startDate).format() };
        endObj = { dateTime: dayjs(endDate).format() };
      } else {
        startObj = { date: dayjs(startDate).format(DATE_FORMAT) };
        endObj = { date: dayjs(endDate).format(DATE_FORMAT) };
      }

      const calendarEvent: CalendarEvent = {
        summary: "",
        description: "",
        colorId: DEFAULT_COLOR_ID,
        start: startObj,
        end: endObj,
      };

      showEditEventDialog(calendarEvent, "new");
      clearSelection();
    } else {
      clearSelection();
    }
  };

  const clearAllMarkedCells = () => {
    let markedElements = document.querySelectorAll<HTMLElement>(
      `td[class*=${ALL_CELLS_CLASS}]`
    );

    markedElements.forEach((element: HTMLElement) => {
      element.removeAttribute("events");
      element.style.background = "var(--calendar-cell-background)";
    });
  };

  const showEvents = (calendarEvents: CalendarEvent[]) => {
    clearAllMarkedCells();
    calendarEvents.forEach((event) => {
      let startDate = dayjs(event.start.date || event.start.dateTime);
      let endDate = dayjs(event.end.date || event.end.dateTime);

      let selectedDates = daysBetweenDates(startDate, endDate);

      selectedDates.forEach((selectedDate) => {
        let title = selectedDate.format(DATE_FORMAT);
        let element = document.querySelector<HTMLElement>(
          `td[title="${title}"][class*="${CELL_CLASS}"]`
        );

        if (element && !element.className.includes(CELL_SELECTED_CLASS)) {
          element.setAttribute("events", event.id || "");
          element.style.background = getGoogleColorById(theme, event.colorId);
        }
      });
    });
  };

  const createEvent = (resPromise: Promise<FetchResponse<CalendarEvent>>) => {
    resPromise
      .then((response: FetchResponse<CalendarEvent>) => {
        if (!response.result) return;
        events.push(response.result);
        setEvents(() => [...events]);
        showEvents(events);
        showSuccessNotification(
          `Event "${response.result.summary}" has been successfully created`,
          notification
        );
      })
      .catch((error: ErrorResponse) => {
        showErrorNotification(error, notification);
      });
  };

  const updateEvent = (resPromise: Promise<FetchResponse<CalendarEvent>>) => {
    resPromise
      .then((response: FetchResponse<CalendarEvent>) => {
        const resp_event = response.result;

        if (!resp_event) return;

        for (let i = 0; i < events.length; i++) {
          if (events[i].id === resp_event.id) {
            events[i] = resp_event;
            break;
          }
        }
        setEvents(() => [...events]);
        showEvents(events);

        showSuccessNotification(
          `Event "${resp_event.summary}" has been successfully updated`,
          notification
        );
      })
      .catch((error: ErrorResponse) => {
        showErrorNotification(error, notification);
      });
  };

  const deleteEvent = (calendarEvent: CalendarEvent) => {
    return api
      .deleteEvent(calendarEvent)
      .then(() => {
        for (let i = 0; i < events.length; i++) {
          if (events[i].id === calendarEvent.id) {
            events.splice(i, 1);
            break;
          }
        }

        setEvents(() => [...events]);
        showEvents(events);

        showSuccessNotification(
          `Event "${calendarEvent.summary}" has been successfully deleted`,
          notification
        );
      })
      .catch((error) => {
        showErrorNotification(error, notification);
      });
  };

  const showDeleteConfirm = (calendarEvent: CalendarEvent) => {
    modal.confirm({
      title: "Do you really want to delete this event?",
      icon: <ExclamationCircleOutlined />,
      content: `Event "${calendarEvent.summary}" will be deteled.`,
      okText: "Confirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        return deleteEvent(calendarEvent);
      },
    });
  };

  const showEditEventDialog = (
    calendarEvent: CalendarEvent,
    mode: DialogMode
  ) => {
    eventModalRef.current?.open(calendarEvent, mode);
  };

  const setNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const setPreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleDoubleTap = (mouseEvent: ReactMouseEvent) => {
    if (mouseEvent.target.className?.includes(CELL_INNER_CLASS)) {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (
        mouseEvent.target.title &&
        lastTap &&
        now - lastTap < DOUBLE_PRESS_DELAY
      ) {
        mobileEventModalRef.current?.open(mouseEvent.target.title);
      } else {
        lastTap = now;
      }
    }
  };

  return (
    <>
      {modalContextHolder}
      {notificationContextHolder}

      <EditEventDialog
        ref={eventModalRef as React.Ref<EditModalRef>}
        onUpdateEvent={updateEvent}
        onCreateEvent={createEvent}
      />

      <MobileInfoDialog
        events={events}
        ref={mobileEventModalRef as React.Ref<InfoModalRef>}
        editRef={eventModalRef}
        onDelete={deleteEvent}
      />

      {loading ? <LoadSpinner /> : <></>}

      <div
        onMouseDown={!isMobile() ? handleMouseDown : undefined}
        onMouseOver={!isMobile() ? handleMouseOver : undefined}
        onMouseUp={!isMobile() ? handleMouseUp : undefined}
        onClick={isMobile() ? handleDoubleTap : undefined}
        className="year-calendar-containter"
      >
        <div className="year-calendar-current-year-box">
          <div className="year-calendar-change-year">
            <LeftOutlined
              data-testid="set_previous_year"
              onClick={setPreviousYear}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onMouseUp={(event) => {
                event.stopPropagation();
              }}
            />
          </div>
          <div className="year-calendar-current-year">{currentYear}</div>
          <div className="year-calendar-change-year">
            <RightOutlined
              data-testid="set_next_year"
              onClick={setNextYear}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onMouseUp={(event) => {
                event.stopPropagation();
              }}
            />
          </div>
        </div>

        <Row gutter={25} justify="space-around">
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={0}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={1}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={2}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={3}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
        </Row>

        <Row gutter={25} justify="space-around">
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={4}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={5}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={6}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={7}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
        </Row>

        <Row gutter={25} justify="space-around">
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={8}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={9}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={10}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
          <Col className="gutter-row calendar-row-container" span={4}>
            <MonthCalendar
              year={currentYear}
              month={11}
              calendarEvents={events}
              onShowEditDialog={showEditEventDialog}
              onDeleteEvent={showDeleteConfirm}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default YearCalendar;
