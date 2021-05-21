import React from 'react';
import './mobile-info-dialog.css'
import './mobile-edit-event-dialog.css'
import { Button } from 'antd';
import COLORS from '../../common/colors.js'
import { Form, Input, Select, TimePicker, DatePicker } from 'antd';
import { logInfo, getDisabledHours, getDisabledMinutes } from '../../common/utilities.js'
import ColorItem from './color-item.js'
import moment from 'moment';
import { DATE_FORMAT } from '../../common/utilities.js';

const { TextArea } = Input;
const { Option } = Select;


class MobileEditEventDialog extends React.Component {

  constructor(props) {
    super(props)
    this.event = props.event;
    this.state = {
      eventSummary: this.event.summary
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateTimeChange = this.onStartDateTimeChange.bind(this);
    this.onEndDateTimeChange = this.onEndDateTimeChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    console.log(this.event);
  }


  onNameChange (event){
    this.event.summary = event.target.value;
    this.setState({eventSummary: this.event.summary});
  }

  onStartDateChange (date) {
    this.event.start.date = date.format(DATE_FORMAT).toString();
  }

  onEndDateChange (date) {
    this.event.end.date = date.format(DATE_FORMAT).toString();
  }

  onStartDateTimeChange (dateTime) {
    this.event.start.dateTime = dateTime.format();
  }

  onEndDateTimeChange (dateTime) {
    this.event.end.dateTime = dateTime.format();
  }

  onColorChange(event){
    this.event.colorId = event.props.colorid;
  }

  onDescriptionChange(event){
    this.event.description = event.target.value;
  }


  render() {
    logInfo(this, 'render: rendering create/edit event dialog');

    let colorOptions = [];
    for (var key in COLORS){
      let colorItem = <ColorItem colorid={key} color={COLORS[key].background}/>
      colorOptions.push(<Option value={colorItem} key={key}>
                          { colorItem }
                        </Option>)
    }
    return (
      <>
        <div className="mobile-info-dialog-container">

          <div className="mobile-info-dialog-events-header">
            { this.props.mode === "new" ?
                           "Новое событие" :
                           "Событие: " + this.event.summary }
          </div>

          <div className="mobile-edit-dialog-events-containter">

            <Form labelCol={{ span: 6, }} wrapperCol={{ span: 14, }}
                  layout="horizontal">


              <Form.Item label="Начало">

                <DatePicker allowClear={false}
                            disabledDate={d => !d || d.isAfter(this.event.end.dateTime) }
                            defaultValue={moment(this.event.start.dateTime) }
                            onChange={this.onStartDateTimeChange} />

                <TimePicker format="HH:mm"
                            disabledHours={ () => getDisabledHours(this.event, true) }
                            disabledMinutes={ () => getDisabledMinutes(this.event, true) }
                            allowClear={false} defaultValue={ moment(this.event.start.dateTime) }
                            onChange={this.onStartDateTimeChange}/>

              </Form.Item>

              <Form.Item label="Конец">

                <DatePicker allowClear={false}
                            disabledDate={d => !d || d.isBefore(this.event.start.dateTime)}
                            defaultValue={moment(this.event.end.dateTime)}
                            onChange={this.onEndDateTimeChange} />

                <TimePicker format="HH:mm"
                            disabledHours={ () => getDisabledHours(this.event, false) }
                            disabledMinutes={ () => getDisabledMinutes(this.event, false) }
                            allowClear={false} defaultValue={ moment(this.event.end.dateTime) }
                            onChange={this.onEndDateTimeChange}/>

              </Form.Item>

              <Form.Item label="Название">
                <Input autoComplete="off" defaultValue={this.event.summary}
                       onChange={this.onNameChange}
                       rules={[
                         {
                           type: "string",
                           required: true,
                           min: 1,
                           max: 40
                         },
                       ]}
                      />
              </Form.Item>

              <Form.Item label="Цвет">
                <Select optionLabelProp="value"
                        defaultValue={ <ColorItem
                          color={COLORS[this.event.colorId ?
                            this.event.colorId : "11"].background} />}
                        onChange={ this.onColorChange }>
                  { colorOptions }
                </Select>
              </Form.Item>

              <Form.Item label="Описание">
                <TextArea rows={4} defaultValue={this.event.description}
                          onChange={ this.onDescriptionChange }/>
              </Form.Item>

            </Form>

          </div>

          <div className="mobile-info-dialog-footer">
            <Button className="mobile-info-dialog-footer-btn"
                    onClick={ this.props.onCancelEditDialog }>
                    Отмена
            </Button>
            <Button type="primary" disabled={ this.state.eventSummary === '' } className="mobile-info-dialog-footer-btn" onClick={ this.props.mode === "new" ?
              () => this.props.onCreateEvent(this.event) :
              () => this.props.onUpdateEvent(this.event) }>
              { this.props.mode === "new" ? "Создать" : "Сохранить"}
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default MobileEditEventDialog;
