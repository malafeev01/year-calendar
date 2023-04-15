import "./edit-event-dialog.css";
import dayjs, { Dayjs } from "dayjs";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useContext,
  useEffect,
  ReactElement,
} from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  TimePicker,
  DatePicker,
  Switch,
} from "antd";
import { LIGHT_COLORS, DARK_COLORS } from "../../../common/google-colors";
import { DATE_FORMAT } from "../../../common/utilities";
import ColorItem, { DEFAULT_COLOR_ID } from "../color-item/color-item";
import ReactDOM from "react-dom";
import { APIContext } from "../../../api/api-context";
import { useStore } from "react-redux";
import { ThemeStore } from "../../../theme/theme-provider";
import { CalendarEvent, FetchResponse } from "../../../api/google-api";
import {
  DialogMode,
  DIALOG_MODE_EDIT,
  DIALOG_MODE_NEW,
  ReactChangeEvent,
  EditModalRef,
} from "../../common/types";

const { TextArea } = Input;
const { Option } = Select;

export const EVENT_NAME_RULE = [
  {
    type: "string",
    required: true,
    min: 1,
    max: 40,
  },
];

export const EMPTY_EVENT = {
  summary: "",
  start: { date: "", dateTime: "" },
  end: { date: "", dateTime: "" },
  description: "",
  colorId: DEFAULT_COLOR_ID,
};

type EditDialogProps = {
  onCreateEvent(resPromise: Promise<FetchResponse<CalendarEvent>>): void;
  onUpdateEvent(resPromise: Promise<FetchResponse<CalendarEvent>>): void;
};

function EditEventDialog(props: EditDialogProps, ref: React.Ref<EditModalRef>) {
  const api = useContext(APIContext);
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<CalendarEvent>(EMPTY_EVENT);
  const [mode, setMode] = useState(DIALOG_MODE_EDIT);
  const [saving, setSaving] = useState(false);

  const store = useStore<ThemeStore>();
  const theme = store.getState().theme;

  const COLORS = theme === "light" ? LIGHT_COLORS : DARK_COLORS;

  // This constant is related to type of event.
  // Whole day event means the event which happens during the whole day.
  // In this case of "whole day event" you will not be able to choose the time during that days -
  // only start date and end date.
  const [isWholeDayEvent, setIsWholeDayEvent] = useState(false);

  const modalRoot = document.getElementById("modal-root") || document.body;

  useEffect(() => {
    setIsWholeDayEvent(event.start.dateTime ? false : true);
  }, [event]);

  useImperativeHandle(ref, () => ({
    open: (calendarEvent: CalendarEvent, mode: DialogMode) => {
      setIsOpen(true);
      setEvent(calendarEvent);
      setMode(mode);
    },
  }));

  const close = () => {
    setIsOpen(false);
  };

  const onNameChange = (inputEvent: ReactChangeEvent) => {
    setEvent((calendarEvent: CalendarEvent) => {
      return { ...calendarEvent, summary: inputEvent.target.value || "" };
    });
  };

  const onStartDateChange = (date: Dayjs | null) => {
    if (!date) return;

    if (!isWholeDayEvent) {
      setEvent((event) => ({ ...event, start: { dateTime: date.format() } }));
    } else {
      setEvent((event) => ({
        ...event,
        start: { date: date.format(DATE_FORMAT) },
      }));
    }
  };

  const onEndDateChange = (date: Dayjs | null) => {
    if (!date) return;

    if (!isWholeDayEvent) {
      setEvent((event) => ({ ...event, end: { dateTime: date.format() } }));
    } else {
      setEvent((event) => ({
        ...event,
        end: { date: date.format(DATE_FORMAT) },
      }));
    }
  };

  const onWholeDayChange = (): void => {
    const value = !isWholeDayEvent;
    setIsWholeDayEvent(!value);
    if (value) {
      setEvent((event) => ({
        ...event,
        end: {
          date: dayjs(event.end.dateTime).format(DATE_FORMAT),
        },
        start: {
          date: dayjs(event.start.dateTime).format(DATE_FORMAT),
        },
      }));
    } else {
      setEvent((event) => ({
        ...event,
        end: { dateTime: dayjs(event.end.date).format() },
        start: { dateTime: dayjs(event.start.date).format() },
      }));
    }
  };

  const onColorChange = (colorId: number) => {
    setEvent((calendarEvent: CalendarEvent) => ({
      ...calendarEvent,
      colorId: colorId,
    }));
  };

  const onDescriptionChange = (inputEvent: ReactChangeEvent) => {
    setEvent((calendarEvent) => ({
      ...calendarEvent,
      description: inputEvent.target.value || "",
    }));
  };

  const createEvent = (calendarEvent: CalendarEvent) => {
    setSaving(true);
    const promise = api.createEvent(calendarEvent).then((response) => {
      setSaving(false);
      close();
      return response;
    });
    return props.onCreateEvent(promise);
  };

  const updateEvent = () => {
    setSaving(true);
    const promise = api.updateEvent(event).then((response) => {
      setSaving(false);
      close();
      return response;
    });
    return props.onUpdateEvent(promise);
  };

  let colorOptions: ReactElement[] = [];
  let index = 0;
  for (let key in COLORS) {
    const colorItem = <ColorItem color={COLORS[key]} colorId={index} />;
    colorOptions.push(
      <Option value={key} key={key} label={colorItem}>
        {colorItem}
      </Option>
    );
    index += 1;
  }

  return ReactDOM.createPortal(
    <Modal
      title={mode === DIALOG_MODE_NEW ? "New event" : "Event: " + event.summary}
      open={isOpen}
      onCancel={close}
      maskStyle={{ zIndex: 1041 }}
      okText={mode === DIALOG_MODE_NEW ? "Create" : "Save"}
      onOk={
        mode === DIALOG_MODE_NEW
          ? () => createEvent(event)
          : () => updateEvent()
      }
      okButtonProps={{ loading: saving, disabled: !!!event.summary }}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label="Start">
          <DatePicker
            data-testid="event_start_date"
            allowClear={false}
            disabledDate={(d) => !d || d.isAfter(event.end.date)}
            value={dayjs(event.start.date || event.start.dateTime)}
            onChange={onStartDateChange}
          />

          <TimePicker
            data-testid="event_start_time"
            format="HH:mm"
            disabled={isWholeDayEvent}
            disabledDate={(d) => !d || d.isAfter(event.end.dateTime)}
            allowClear={false}
            value={
              event.start.dateTime
                ? dayjs(event.start.dateTime)
                : dayjs("00:00", "HH:mm")
            }
            onChange={onStartDateChange}
          />
        </Form.Item>

        <Form.Item label="End">
          <DatePicker
            data-testid="event_end_date"
            allowClear={false}
            disabledDate={(d) => !d || d.isBefore(event.start.date)}
            value={dayjs(event.end.date || event.end.dateTime)}
            onChange={onEndDateChange}
          />
          <TimePicker
            data-testid="event_end_time"
            format="HH:mm"
            disabled={isWholeDayEvent}
            disabledDate={(d) => !d || d.isBefore(event.start.dateTime)}
            allowClear={false}
            value={
              event.end.dateTime
                ? dayjs(event.end.dateTime)
                : dayjs("00:00", "HH:mm")
            }
            onChange={onEndDateChange}
          />
        </Form.Item>
        <Form.Item className="whole-day-checkbox" label="Whole day event">
          <Switch
            data-testid="wholeday_switch"
            checked={isWholeDayEvent}
            onChange={onWholeDayChange}
          ></Switch>
        </Form.Item>

        <Form.Item label="Title">
          <Input
            data-testid="event_summary_input"
            autoComplete="off"
            value={event.summary}
            onChange={onNameChange}
            {...{ rules: EVENT_NAME_RULE }}
          />
        </Form.Item>

        <Form.Item label="Color">
          <Select
            data-testid="event_color_combobox"
            optionLabelProp="label"
            onSelect={onColorChange}
            placeholder={
              <ColorItem
                color={COLORS[DEFAULT_COLOR_ID]}
                colorId={DEFAULT_COLOR_ID}
              />
            }
          >
            {colorOptions}
          </Select>
        </Form.Item>

        <Form.Item label="Description">
          <TextArea
            data-testid="event_description_input"
            rows={4}
            value={event.description}
            onChange={onDescriptionChange}
          />
        </Form.Item>
      </Form>
    </Modal>,
    modalRoot
  );
}

export default forwardRef(EditEventDialog);
