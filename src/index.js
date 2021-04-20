import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';

import ru_RU from 'antd/lib/locale-provider/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';  // important!

moment.locale('ru');  // important!

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={ru_RU}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
