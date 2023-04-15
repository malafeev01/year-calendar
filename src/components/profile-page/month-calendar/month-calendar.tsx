import "./month-calendar.css";

import React, { ReactElement, useState } from "react";
import { Row, Col, Calendar, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { DATE_FORMAT, isMobile } from "../../../common/utilities";
import { getGoogleColorById } from "../../../common/google-colors";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useStore } from "react-redux";
import classnames from "classnames";
import { ThemeStore } from "../../../theme/theme-provider";
import { CalendarEvent } from "../../../api/google-api";

dayjs.extend(isBetween);

type PopupTarget = EventTarget & { title: string };

type MonthCalendarProps = {
  year: number;
  month: number;
  calendarEvents: CalendarEvent[];
  onShowEditDialog: Function;
  onDeleteEvent: Function;
};

function MonthCalendar(props: MonthCalendarProps) {
  const [value] = useState(dayjs().month(props.month).year(props.year));
  const store = useStore<ThemeStore>();
  const theme = store.getState().theme;

  const editEventHandler = (calendarEvent: CalendarEvent) => {
    props.onShowEditDialog(calendarEvent, "edit");
  };

  const deleteEventHandler = (calendarEvent: CalendarEvent) => {
    props.onDeleteEvent(calendarEvent);
  };

  const getEventsForDate = (date: Dayjs) => {
    let calendarEvents: CalendarEvent[] = [];
    if (props.calendarEvents.length > 0) {
      for (var i = 0; i < props.calendarEvents.length; i++) {
        let event = props.calendarEvents[i];
        const startDate = dayjs(event.start.date || event.start.dateTime);
        const endDate = dayjs(event.end.date || event.end.dateTime);

        if (
          (startDate.month() === props.month ||
            endDate.month() === props.month) &&
          (startDate.year() === props.year || endDate.year() === props.year)
        ) {
          if (date.isBetween(startDate, endDate, "day", "[]")) {
            calendarEvents.push(event);
          }
        }
      }
    }
    return calendarEvents;
  };

  /**
   * Generate popover with list of the calendar events
   *
   * @param calendarEvents - list of calendar events
   * @returns - React element of the date popover
   */
  const getPopoverContent = (calendarEvents: CalendarEvent[]): ReactElement => {
    let eventLines: ReactElement[] = [];

    calendarEvents.forEach((calendarEvent, i) => {
      eventLines.push(
        <Row key={i} className="event-popup-row">
          <Col span={2} className="event-popup-color-col">
            <div
              className="event-popup-color-box"
              style={{
                background: getGoogleColorById(theme, calendarEvent.colorId),
              }}
            ></div>
          </Col>

          <Col span={18}>{calendarEvent.summary}</Col>
          <Col span={2} className="event-popup-actions-col">
            <EditOutlined
              data-testid={`edit_event_icon_${i}`}
              onMouseDown={(mouseEvent: React.MouseEvent) => {
                mouseEvent.stopPropagation();
              }}
              onMouseUp={(mouseEvent: React.MouseEvent) => {
                mouseEvent.stopPropagation();
              }}
              onClick={(mouseEvent: React.MouseEvent) => {
                mouseEvent.stopPropagation();
                editEventHandler(calendarEvent);
              }}
              className="event-popup-actions-icon"
            />

            <DeleteOutlined
              data-testid={`delete_event_icon_${i}`}
              onMouseDown={(mouseEvent: React.MouseEvent) => {
                mouseEvent.stopPropagation();
              }}
              onMouseUp={(mouseEvent: React.MouseEvent) => {
                mouseEvent.stopPropagation();
              }}
              onClick={(mouseEvent: React.MouseEvent) => {
                mouseEvent.stopPropagation();
                deleteEventHandler(calendarEvent);
              }}
              className="event-popup-actions-icon"
            />
          </Col>
        </Row>
      );
    });

    return <div>{eventLines}</div>;
  };

  return (
    <Calendar
      className="calendar-month-container"
      fullscreen={false}
      value={value}
      dateFullCellRender={(date) => {
        let cellRender;
        const isToday =
          dayjs().format(DATE_FORMAT) === date.format(DATE_FORMAT);
        const events = getEventsForDate(date);

        if (events.length > 0 && !isMobile()) {
          cellRender = (
            <Popover content={getPopoverContent(events)} title="Events">
              <div
                data-testid={date.format(DATE_FORMAT)}
                title={date.format(DATE_FORMAT)}
                className={classnames({
                  "calendar-date-cell": true,
                  "calendar-date-cell-now": isToday,
                })}
                onClick={(event: React.MouseEvent) => {
                  if (
                    dayjs((event.target as PopupTarget)?.title).month() !==
                    value.month()
                  ) {
                    event.stopPropagation();
                  }
                }}
              >
                {date.date()}
              </div>
            </Popover>
          );
        } else {
          cellRender = (
            <div
              data-testid={date.format(DATE_FORMAT)}
              title={date.format(DATE_FORMAT)}
              className={classnames({
                "calendar-date-cell": true,
                "calendar-date-cell-now": isToday,
              })}
              onClick={(event: React.MouseEvent) => {
                if (
                  dayjs((event.target as PopupTarget)?.title).month() !==
                  value.month()
                ) {
                  event.stopPropagation();
                }
              }}
            >
              {date.date()}
            </div>
          );
        }
        return cellRender;
      }}
      headerRender={({ value }) => {
        return (
          <div className="calendar-month-label">
            {dayjs().month(value.month()).format("MMMM")}
          </div>
        );
      }}
    />
  );
}

export default MonthCalendar;
