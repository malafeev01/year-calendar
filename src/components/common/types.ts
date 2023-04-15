import React from "react";
import { CalendarEvent } from "../../api/google-api";

export const DIALOG_MODE_NEW = "new";
export const DIALOG_MODE_EDIT = "edit";

export type ReactMouseEvent = React.MouseEvent & {
  target: EventTarget & { className?: string; title?: string; value?: string };
};
export type ReactChangeEvent = React.ChangeEvent & {
  target: EventTarget & { className?: string; title?: string; value?: string };
};
export type DialogMode = typeof DIALOG_MODE_NEW | typeof DIALOG_MODE_EDIT;

export type EditModalRef = {
  open(calendarEvent: CalendarEvent, mode: DialogMode): void;
};

export type InfoModalRef = {
  open(selectedDate: string): void;
};
