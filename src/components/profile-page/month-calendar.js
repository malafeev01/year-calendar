import React from 'react';
import { Row, Col, Calendar, Popover } from 'antd';
import moment from 'moment';
import './month-calendar.css'
import {daysBetweenDates, isDateInArray, logInfo, isMobile} from '../../common/utilities.js'
import COLORS from '../../common/colors.js'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


class MonthCalendar extends React.Component {

  constructor(props) {
    super(props)

    let value = moment();
    value.month(props.month);
    value.year(props.year)

    this.state = {
      value: value
    }

    this.editEventHandler = this.editEventHandler.bind(this);
    this.deleteEventHandler = this.deleteEventHandler.bind(this);
  }

  editEventHandler (event) {
    logInfo(this, "editEventHandler: edit handler is called");
    this.props.onShowEditDialog(event, 'edit');
  }

  deleteEventHandler (event) {
    logInfo(this, "editEventHandler: delete handler is called");
    this.props.onDeleteEvent(event, 'edit');
  }

  getEventsForDate (date) {
    let events = []
    if(this.props.events.length > 0){
      for (var i=0; i < this.props.events.length; i++){
        let event = this.props.events[i];
        let startDate = moment(event.start.date || event.start.dateTime)
        let endDate = moment(event.end.date || event.end.dateTime)

        let eventDates = daysBetweenDates(startDate, endDate);

        if (isDateInArray(date, eventDates)) {
          events.push(event);
        }
      }
    }
    return events;
  }

  static getDerivedStateFromProps(props, state) {
    console.info(`MonthCalendar: getDerivedStateFromProps: props has been received for month ${props.month} and year ${props.year}`);
    state.value.year(props.year);
    return state;
  }

  render() {
    console.info(`MonthCalendar: render: render calendar for month ${this.props.month} and year ${this.props.year}`);
    function getPopoverContent(events, context) {

      let eventLines = [];
      events.forEach((event, i) => {
        eventLines.push(
          <Row key={i} className="event-popup-row">
            <Col span={2} className="event-popup-color-col">
              <div className="event-popup-color-box"
                   style={{background: event.colorId ?
                                       COLORS[event.colorId]["background"] :
                                       COLORS["11"]["background"]}}>
              </div>
            </Col>

            <Col span={18}>{event.summary}</Col>
            <Col span={2} className="event-popup-actions-col">
              <EditOutlined onMouseDown={(event)=>{event.stopPropagation()}}
                            onMouseUp={(event)=>{event.stopPropagation()}}
                            onClick={ (evt) => { evt.stopPropagation();
                                                 context.editEventHandler(event) }}
                            className="event-popup-actions-icon"/>

              <DeleteOutlined onMouseDown={(event)=>{event.stopPropagation()}}
                              onMouseUp={(event)=>{event.stopPropagation()}}
                              onClick={ (evt) => { evt.stopPropagation();
                                                   context.deleteEventHandler(event) }}
                              className="event-popup-actions-icon"/>
            </Col>
          </Row>
        )
      });

      return (
        <div>
          { eventLines }
        </div>
      );
    }

    return (
     <Calendar disabled={true} className={"calendar-month-container"}
               fullscreen={false} value={ this.state.value }
      dateFullCellRender={ ( date ) => {
        let cellRender;

        let events = this.getEventsForDate(date);

        if (events.length > 0 && !isMobile()) {
          cellRender = <Popover content={getPopoverContent(events, this)}
                                title="Events">
                          <div title={ date.format("YYYY-MM-DD").toString() }
                               className="calendar-date-cell"
                               onClick={ (event) => { if (moment(event.target.title).month() !== this.state.value.month()) { event.stopPropagation(); } } }>
                            { date.date() }
                          </div>
                       </Popover>;
        }
        else {
          cellRender = <div title={ date.format("YYYY-MM-DD").toString() }
                            className="calendar-date-cell"
                            onClick={ (event) => { if (moment(event.target.title).month() !== this.state.value.month()) { event.stopPropagation(); } } }>
                        { date.date() }
                      </div>;
        }
        return (
          cellRender
        );

      }}

      headerRender={ ({ value, type, onChange, onTypeChange }) => {
        return (
          <div className="calendar-month-label">
            { moment().month(this.state.value.month()).format("MMMM") }
          </div>
        );
      }}
     />

    )
  }
}

export default MonthCalendar;
