import React from 'react';
import './mobile-info-dialog.css'
import './mobile-edit-event-dialog.css'
import { Button } from 'antd';
import COLORS from '../../common/colors.js'
import { Form, Input, Select, Alert } from 'antd';
import { logInfo } from '../../common/utilities.js'
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
      eventSummary: this.event.summary,
      startDate: this.event.start.dateTime.format(DATE_FORMAT).toString(),
      startTime: this.event.start.dateTime.format("HH:mm").toString(),
      endDate: this.event.end.dateTime.format(DATE_FORMAT).toString(),
      endTime: this.event.end.dateTime.format("HH:mm").toString(),
      showError: false
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateTimeChange = this.onStartDateTimeChange.bind(this);
    this.onEndDateTimeChange = this.onEndDateTimeChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);

  }

  onNameChange (event){
    this.event.summary = event.target.value;
    this.setState({eventSummary: this.event.summary});
  }

  checkDates(start, end){
    let startDateTime = start ? start : moment(this.state.startDate + ' ' + this.state.startTime);
    let endDateTime = end ? end : moment(this.state.endDate + ' ' + this.state.endTime);

    return startDateTime > endDateTime ? true : false;
  }

  onStartDateChange (event) {
    let startDate = moment(event.target.value + ' ' + this.state.startTime);
    let showError = this.checkDates(startDate, null);
    this.setState({startDate: event.target.value, showError: showError});

    this.event.start.dateTime = startDate.format();
  }

  onEndDateChange (event) {
    let endDate = moment(event.target.value + ' ' + this.state.endTime);
    let showError = this.checkDates(null, endDate);
    this.setState({endDate: event.target.value, showError: showError});

    this.event.end.dateTime = endDate.format();
  }

  onStartDateTimeChange (event) {
    let startDate = moment(this.state.startDate + ' ' + event.target.value);
    let showError = this.checkDates(startDate, null);
    this.setState({startTime: event.target.value, showError: showError});

    this.event.start.dateTime = startDate.format();
  }

  onEndDateTimeChange (event) {
    let endDate = moment(this.state.endDate + ' ' + event.target.value);
    let showError = this.checkDates(null, endDate);
    this.setState({endTime: event.target.value, showError: showError});

    this.event.end.dateTime = endDate.format();
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

    let alert;
    if (this.state.showError) {
      alert = <Alert message="Start date is greater than end date" type="error" className="error-message "/>
    }

    return (
      <>
        <div className="mobile-info-dialog-container">

          <div className="mobile-info-dialog-events-header">
            { this.props.mode === "new" ?
                           "New event" :
                           "Event: " + this.event.summary }
          </div>

          <div className="mobile-edit-dialog-events-containter">

            <Form labelCol={{ span: 6, }} wrapperCol={{ span: 14, }}
                  layout="horizontal">

              {alert}

              <Form.Item label="Start">
                <input type='date' className="ant-input date-input" value={this.state.startDate}
                       onChange={this.onStartDateChange}
                       max={this.state.endDate}></input>

                     <input type='time' className="ant-input time-input" value={this.state.startTime}
                       onChange={this.onStartDateTimeChange}
                       max={this.state.endTime}></input>

              </Form.Item>

              <Form.Item label="End">

                <input type='date' className="ant-input date-input" value={this.state.endDate}
                       onChange={this.onEndDateChange}
                       min={this.state.startDate}></input>

                     <input type='time' className="ant-input time-input" value={this.state.endTime}
                       onChange={this.onEndDateTimeChange}
                       min={this.state.startTime}></input>

              </Form.Item>

              <Form.Item label="Title">
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

              <Form.Item label="Color">
                <Select optionLabelProp="value"
                        defaultValue={ <ColorItem
                          color={COLORS[this.event.colorId ?
                            this.event.colorId : "11"].background} />}
                        onChange={ this.onColorChange }>
                  { colorOptions }
                </Select>
              </Form.Item>

              <Form.Item label="Description">
                <TextArea rows={4} defaultValue={this.event.description}
                          onChange={ this.onDescriptionChange }/>
              </Form.Item>

            </Form>

          </div>

          <div className="mobile-info-dialog-footer">
            <Button className="mobile-info-dialog-footer-btn"
                    onClick={ this.props.onCancelEditDialog }>
                    Cancel
            </Button>
            <Button type="primary" disabled={ this.state.eventSummary === '' || this.state.showError } className="mobile-info-dialog-footer-btn" onClick={ this.props.mode === "new" ?
              () => this.props.onCreateEvent(this.event) :
              () => this.props.onUpdateEvent(this.event) }>
              { this.props.mode === "new" ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default MobileEditEventDialog;
