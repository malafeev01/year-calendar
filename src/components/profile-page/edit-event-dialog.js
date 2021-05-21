import './edit-event-dialog.css';
import React from 'react';
import { Modal, Form, Input, Select, TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import COLORS from '../../common/colors.js';
import { DATE_FORMAT } from '../../common/utilities.js';
import { logInfo, getDisabledHours, getDisabledMinutes } from '../../common/utilities.js';
import ColorItem from './color-item.js'

const { TextArea } = Input;
const { Option } = Select;


class EditEventDialog extends React.Component {
  constructor (props) {
    super(props);

    this.state = {eventSummary: props.event.summary};

    this.event = props.event;

    this.onNameChange = this.onNameChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateTimeChange = this.onStartDateTimeChange.bind(this);
    this.onEndDateTimeChange = this.onEndDateTimeChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);

    this.oneDay = moment(this.event.start.dateTime);
  }

  onNameChange (event){
    this.event.summary = event.target.value;
    this.setState({eventSummary: this.event.summary})
  }

  onStartDateChange (date) {
    this.event.start.date = date.format(DATE_FORMAT).toString();
  }

  onEndDateChange (date) {
    this.event.end.date = date.format(DATE_FORMAT).toString();
  }

  onStartDateTimeChange (dateTime) {
    let date = this.oneDay.format(DATE_FORMAT)
    let time = dateTime.format("HH:mm")
    let timeAndDate = moment(date + ' ' + time);

    this.event.start.dateTime = timeAndDate.format();
  }

  onEndDateTimeChange (dateTime) {
    let date = this.oneDay.format(DATE_FORMAT)
    let time = dateTime.format("HH:mm")
    let timeAndDate = moment(date + ' ' + time);

    this.event.end.dateTime = timeAndDate.format();
  }

  onDateChange (date){
    this.oneDay = date;
    this.onStartDateTimeChange(moment(this.event.start.dateTime))
    this.onEndDateTimeChange(moment(this.event.end.dateTime))
  }

  onColorChange(event){
    this.event.colorId = event.props.colorid;
  }

  onDescriptionChange(event){
    this.event.description = event.target.value;
  }

  render(){
    logInfo(this, 'render: rendering create/edit event dialog');
    let colorOptions = [];
    for (var key in COLORS){
      let colorItem = <ColorItem colorid={key} color={COLORS[key].background}/>
      colorOptions.push(<Option value={colorItem} key={key}>
                          { colorItem }
                        </Option>)
    }

    let startDatePicker;
    let endDatePicker;
    let oneDatePicker;

    let isOneDayEvent = this.props.event.start.dateTime ? true : false;

    if (isOneDayEvent) {
      startDatePicker = <TimePicker format="HH:mm"
                                    disabledHours={ () => getDisabledHours(this.event, true) }
                                    disabledMinutes={ () => getDisabledMinutes(this.event, true) }
                                    allowClear={false} defaultValue={moment(this.event.start.dateTime)}
                                    onChange={this.onStartDateTimeChange}/>

      endDatePicker = <TimePicker  format="HH:mm"
                                   disabledHours={ () => getDisabledHours(this.event, false) }
                                   disabledMinutes={ () => getDisabledMinutes(this.event, false) }
                                   allowClear={false} defaultValue={moment(this.event.end.dateTime)}
                                   onChange={this.onEndDateTimeChange}/>

      oneDatePicker = <Form.Item label="Дата">
                        <DatePicker allowClear={false}
                                    defaultValue={moment(this.event.start.dateTime)}
                                    onChange={this.onDateChange}/>
                      </Form.Item>
    }

    else {
      startDatePicker = <DatePicker allowClear={false}
                                    disabledDate={d => !d || d.isAfter(this.event.end.date) }
                                    defaultValue={moment(this.event.start.date) }
                                    onChange={this.onStartDateChange} />

      endDatePicker = <DatePicker allowClear={false}
                                  disabledDate={d => !d || d.isBefore(this.event.start.date)}
                                  defaultValue={moment(this.event.end.date)}
                                  onChange={this.onEndDateChange} />
    }

    return (
      <Modal title={ this.props.mode === "new" ?
                     "Новое событие" :
                     "Событие: " + this.event.summary }
             visible={ true } onCancel={ this.props.onCancelEditDialog }
             maskStyle={{zIndex: 1041}}
             okText={ this.props.mode === "new" ? "Создать" : "Сохранить"}
             onOk={ this.props.mode === "new" ?
               () => this.props.onCreateEvent(this.event) :
               () => this.props.onUpdateEvent(this.event) }
             okButtonProps = {{disabled: this.state.eventSummary ? false : true}}>

        <Form labelCol={{ span: 6, }} wrapperCol={{ span: 14, }}
              layout="horizontal">

          { oneDatePicker }

          <Form.Item label="Начало">
            {startDatePicker}
          </Form.Item>

          <Form.Item label="Конец">
            {endDatePicker}
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
      </Modal>
    );
  }
}

export default EditEventDialog;
