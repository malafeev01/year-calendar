import "./load-spinner.css";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export function LoadSpinner() {
  return (
    <div className="load-spinner-container">
      <Spin
        indicator={<LoadingOutlined className="load-spinner-icon" />}
        tip="Loading..."
      />
    </div>
  );
}
