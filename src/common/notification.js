import { notification } from 'antd';


function showSuccessNotification(message) {
    notification.success({
      message: "Готово",
      description: message,
      placement: "bottomRight"
    });
};

function showErrorNotification(error) {
    let status;
    let message;
    try {
      status = error.result.error.code;
      message = error.result.error.message;
    }
    catch {
      status = 500;
      message = JSON.stringify(error);
    }
    notification.error({
      message: `Ошибка ${status}`,
      description: message,
      placement: "bottomRight",
      duration: 0
    });

};

export {
  showSuccessNotification,
  showErrorNotification

};
