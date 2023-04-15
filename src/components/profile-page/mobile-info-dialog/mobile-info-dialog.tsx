import "./mobile-info-dialog.css";

import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  ReactElement,
} from "react";
import { Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import ReactDOM from "react-dom";
import { useStore } from "react-redux";

import { getGoogleColorById } from "../../../common/google-colors";
import { getEventsForDate } from "../../../common/utilities";
import { DEFAULT_COLOR_ID } from "../color-item/color-item";
import { ThemeStore } from "../../../theme/theme-provider";
import {
  DIALOG_MODE_EDIT,
  DIALOG_MODE_NEW,
  EditModalRef,
  InfoModalRef,
} from "../../common/types";
import { CalendarEvent } from "../../../api/google-api";

type MobileInfoDialogProps = {
  editRef: React.MutableRefObject<EditModalRef | undefined>;
  events: CalendarEvent[];
  onDelete(calendarEvent: CalendarEvent): Promise<void>;
};

function MobileInfoDialog(
  props: MobileInfoDialogProps,
  ref: React.Ref<InfoModalRef>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const store = useStore<ThemeStore>();
  const theme = store.getState().theme;
  const [modal, modalContextHolder] = Modal.useModal();

  const modalRoot = document.getElementById("modal-root") || document.body;

  const editEventHandler = (calendarEvent: CalendarEvent) => {
    props.editRef?.current?.open(calendarEvent, DIALOG_MODE_EDIT);
  };

  const createEventHandler = () => {
    const evt: CalendarEvent = {
      summary: "",
      start: { date: selectedDate },
      end: { date: selectedDate },
      description: "",
      colorId: DEFAULT_COLOR_ID,
    };
    props.editRef?.current?.open(evt, DIALOG_MODE_NEW);
  };

  const deleteEventHandler = (calendarEvent: CalendarEvent) => {
    modal.confirm({
      title: "Do you really want to delete this event?",
      icon: <ExclamationCircleOutlined />,
      content: `Event "${calendarEvent.summary}" will be deteled.`,
      okText: "Confirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        return props.onDelete(calendarEvent);
      },
    });
  };

  useImperativeHandle(ref, () => ({
    open: (selectedDate) => {
      setIsOpen(true);
      setSelectedDate(selectedDate);
    },
  }));

  const close = () => {
    setIsOpen(false);
  };

  let eventLines: ReactElement[] = [];
  let events = getEventsForDate(props.events, selectedDate);

  if (events.length > 0) {
    events.forEach((event, i) => {
      eventLines.push(
        <div key={i} className="mobile-event-popup-row">
          <div
            className="mobile-event-popup-color-col"
            style={{
              background: getGoogleColorById(theme, event.colorId),
            }}
          ></div>

          <div className="mobile-event-popup-summary-col">{event.summary}</div>
          <div className="mobile-event-popup-actions-col">
            <EditOutlined
              data-testid={`edit_event_${i}`}
              onMouseDown={(evt) => {
                evt.stopPropagation();
              }}
              onMouseUp={(evt) => {
                evt.stopPropagation();
              }}
              onClick={(evt) => {
                evt.stopPropagation();
                editEventHandler(event);
              }}
              className="mobile-event-popup-actions-icon"
            />

            <DeleteOutlined
              data-testid={`delete_event_${i}`}
              onMouseDown={(evt) => {
                evt.stopPropagation();
              }}
              onMouseUp={(evt) => {
                evt.stopPropagation();
              }}
              onClick={(evt) => {
                evt.stopPropagation();
                deleteEventHandler(event);
              }}
              className="mobile-event-popup-actions-icon"
            />
          </div>
        </div>
      );
    });
  } else {
    eventLines = [<span key={0}>There are no events</span>];
  }

  return ReactDOM.createPortal(
    <>
      {modalContextHolder}
      {isOpen && (
        <div
          data-testid="mobile-info-dialog-container"
          className="mobile-info-dialog-container"
        >
          <div className="mobile-info-dialog-events-header">Events</div>

          <div className="mobile-info-dialog-events-containter">
            {eventLines}
          </div>

          <div className="mobile-info-dialog-footer">
            <Button className="mobile-info-dialog-footer-btn" onClick={close}>
              Close
            </Button>
            <Button
              type="primary"
              className="mobile-info-dialog-footer-btn"
              onClick={createEventHandler}
            >
              Create event
            </Button>
          </div>
        </div>
      )}
    </>,
    modalRoot
  );
}

export default forwardRef(MobileInfoDialog);
