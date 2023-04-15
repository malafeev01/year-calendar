import { NotificationInstance } from "antd/es/notification/interface";
import { ErrorResponse } from "../api/google-api";

/**
 * Show success notification(botton right popup)
 * @param message - string with message
 * @param notification - Ant.Design notification instance (@see useNotification)
 */
function showSuccessNotification(
  message: string,
  notification: NotificationInstance
) {
  notification.success({
    message: "Done",
    description: message,
    placement: "bottomRight",
  });
}
/**
 * Show error notification(botton right popup)
 * @param error - error response object (@see ErrorResponse)
 * @param notification - Ant.Design notification instance (@see useNotification)
 */
function showErrorNotification(
  error: ErrorResponse,
  notification: NotificationInstance
) {
  let status: number;
  let message: string;
  try {
    status = error.result.error.code;
    message = error.result.error.message;
  } catch {
    status = 500;
    message = JSON.stringify(error);
  }

  notification.error({
    message: `Error ${status}`,
    description: message,
    placement: "bottomRight",
    duration: 0,
  });
}

export { showSuccessNotification, showErrorNotification };
