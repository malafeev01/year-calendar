import './year-calendar.css';
import React from 'react';
import { Row, Col, Modal, Spin } from 'antd';
import moment from 'moment';
import MonthCalendar from './month-calendar.js';
import EditEventDialog from './edit-event-dialog.js';
import COLORS from '../../common/colors.js';
import {daysBetweenDates,
  isDateInArray, DATE_FORMAT, logInfo, logError} from '../../common/utilities.js';
import { ExclamationCircleOutlined,
  LoadingOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

import {showSuccessNotification,
  showErrorNotification} from '../../common/notification.js'

const CELL_SELECTED_CLASS = "calendar-date-cell-selected";
const CELL_CLASS = "ant-picker-cell-in-view";
const ALL_CELLS_CLASS = "ant-picker-cell";
const CELL_INNER_CLASS = "calendar-date-cell"

const { confirm } = Modal;

class YearCalendar extends React.Component {

  constructor(props) {
    super(props)
    this.api = props.api;

    this.state = {
      loading: true,
      showEditDialog: false,
      currentEvent: null,
      editDialogMode: 'edit',
      events: props.events,
      currentYear: moment().year()
    }

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.showEditEventDialog = this.showEditEventDialog.bind(this);
    this.closeEditDialog = this.closeEditDialog.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);

    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);

    this.setPreviousYear = this.setPreviousYear.bind(this);
    this.setNextYear = this.setNextYear.bind(this);

    this.selection = false;
    this.selectedDates = [];
    this.dateRangeStart = null;
    this.dateRangeEnd = null;

    this.touchStartTime = null;
    this.touchStartTarget = null
  }

  handleMouseDown (event) {
    if (event.type === "touchstart") {
      this.touchStartTime = moment();
      this.touchStartTarget = event.target;
    }

    this.dateRangeStart = null;
    this.dateRangeEnd = null;

    if (event.target.className.includes(CELL_INNER_CLASS)){
      this.selection = true;
      this.dateRangeStart = moment(event.target.title);
      this.updateSelection()
    }
  }

  updateSelection () {
    let startDate = this.dateRangeStart;
    let endDate = this.dateRangeEnd;
    if (this.dateRangeStart.diff(this.dateRangeEnd) >= 0){
      endDate = this.dateRangeStart;
      startDate = this.dateRangeEnd;
    }


    let selectedDates = daysBetweenDates(startDate, endDate);
    selectedDates.forEach( (selectedDate) => {
      let title = selectedDate.format(DATE_FORMAT).toString();
      let element = document.querySelector(`td[title="${title}"][class*="${CELL_CLASS}"]`);
      if (!element.className.includes(CELL_SELECTED_CLASS)){
        element.className = element.className + ` ${CELL_SELECTED_CLASS}`;
      }
    });

    let markedElements = document.querySelectorAll(`td[class*="${CELL_SELECTED_CLASS}"]`);
    markedElements.forEach(( markedElement ) => {

      if (!isDateInArray(moment(markedElement.title), selectedDates)){
        markedElement.className = markedElement.className.replace(CELL_SELECTED_CLASS, '').trim();
      }
    });
  }

  clearSelection(){
    this.selection = false;
    let markedElements = document.querySelectorAll(`td[class*="${CELL_SELECTED_CLASS}"]`);
    markedElements.forEach(( markedElement ) => {
      markedElement.className = markedElement.className.replace(CELL_SELECTED_CLASS, '').trim();
    });
  }

  handleTouchMove(event) {
    let myLocation = event.changedTouches[0];
    event.target = document.elementFromPoint(myLocation.clientX, myLocation.clientY);

    this.handleMouseOver(event);

  }

  handleMouseOver (event) {
    if (this.selection) {
      if (event.target.className.includes(CELL_INNER_CLASS)){
        this.dateRangeEnd = moment(event.target.title);
        this.updateSelection()
      }
    }
  }

  handleMouseUp (event) {
    this.selection = false;

    if (event.type === "touchend") {
      let myLocation = event.changedTouches[0];
      let eventTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
      let events = eventTarget.parentNode.getAttribute('events');
      let timeDiff = moment().diff(this.touchStartTime) / 1000;
      if (eventTarget === this.touchStartTarget && timeDiff > 0.5 && events) {
        let mouseoverEvent = new Event('mouseover');
        eventTarget.dispatchEvent(mouseoverEvent);
        mouseoverEvent = new Event('mouseenter');
        eventTarget.dispatchEvent(mouseoverEvent);
        return;
      }
    }

    if (event.target.className.includes(CELL_INNER_CLASS)){
      let startDate = this.dateRangeStart;
      let endDate = this.dateRangeEnd;

      if (this.dateRangeStart.diff(this.dateRangeEnd) >= 0){
        endDate = this.dateRangeStart;
        startDate = this.dateRangeEnd;
      }

      let event = {
        summary: "",
        start:{
          date: endDate ? startDate.format(DATE_FORMAT): null,
          dateTime: endDate ? null: startDate.format(),
        },
        end: {
          date: endDate ? endDate.format(DATE_FORMAT): null,
          dateTime: endDate ? null: startDate.format(),
        },
        colorId: "11"
      }

      this.showEditEventDialog(event, 'new');
      this.clearSelection();
    } else {
      this.clearSelection();
    }
  }

  clearAllMarkedCells(events) {
    logInfo(this, "clearAllMarkedCells: clearing all the events from the calendar");

    let markedElements = document.querySelectorAll(`td[class*=${ALL_CELLS_CLASS}]`);
    logInfo(this, `clearAllMarkedCells: ${markedElements.length} to be cleared`);
    markedElements.forEach( element => {
      element.removeAttribute('events');
      element.style.background = "white";
    });

  }

  showEvents(events) {
    logInfo(this, "showEvents: start showing events");
    this.clearAllMarkedCells(events);

    events.forEach( (event) => {
      let startDate = moment(event.start.date || event.start.dateTime)
      let endDate = moment(event.end.date || event.end.dateTime)

      let selectedDates = daysBetweenDates(startDate, endDate);

      selectedDates.forEach( (selectedDate) => {
        let title = selectedDate.format(DATE_FORMAT).toString();
        let element = document.querySelector(`td[title="${title}"][class*="${CELL_CLASS}"]`);
        if (element && !element.className.includes(CELL_SELECTED_CLASS)){
          element.setAttribute("events", event.id);

          if (event.colorId) {
            element.style.background= COLORS[event.colorId]['background'];
          } else {
            element.style.background= COLORS["11"]['background'];
          }
        }
      });
    });
    logInfo(this, `showEvents: ${events.length} events have shown`);
  }


  createEvent(event) {
    logInfo(this, `createEvent: Creating a new event`);
    this.api.createEvent(event).then((response) => {
      let events = this.state.events;
      events.push(response.result);
      this.setState({events: events})
      this.closeEditDialog();

      showSuccessNotification(`Событие "${event.summary}" успешно добавлено в календарь`);

    }).catch((error)=>{
      logError(this, JSON.stringify(error));
      showErrorNotification(error);
    });
  }

  updateEvent(event) {
    logInfo(this, `updateEvent: Updating ${event.id} event`);
    this.api.updateEvent(event).then((response) => {

      let resp_event = response.result;
      let events = this.state.events;

      for (let i=0; i<events.length; i++){
        if (events[i].id === resp_event.id) {
          events[i] = resp_event;
          break;
        }
      }
      this.setState({events: events})
      this.closeEditDialog();

      showSuccessNotification(`Событие "${event.summary}" успешно обновлено`);

    }).catch((error)=>{
      logError(this, JSON.stringify(error))
      showErrorNotification(error);
    });
  }

  deleteEvent(event){
    logInfo(this, `deleteEvent: Deleting ${event.id} event`);
    this.api.deleteEvent(event).then((response) => {

      let events = this.state.events;

      for (let i=0; i<events.length; i++){
        if (events[i].id === event.id) {
          events.splice(i, 1)
          break;
        }
      }

      this.setState({events: events})
      showSuccessNotification(`Событие "${event.summary}" успешно удалено`);
    }).catch((error)=>{
      logError(this, JSON.stringify(error))
      showErrorNotification(error);
    });
  }

  showDeleteConfirm(event) {
    logInfo(this, `showDeleteConfirm: show delete cofirmation for ${event.id} event`);
    let context = this;
    confirm({
      title: 'Вы точно хотите удалить событие?',
      icon: <ExclamationCircleOutlined />,
      content: `Событие "${event.summary}" будет удалено безвозвратно.`,
      okText: 'Подтвердить',
      okType: 'danger',
      cancelText: 'Отмена',

      onOk() {
        context.deleteEvent(event);
      }
    });
  }

  showEditEventDialog(event, mode){
    logInfo(this, `showEditEventDialog: show edit dialog in '${mode}' mode for ${event.id} event`);
    this.setState({
      showEditDialog: true,
      currentEvent: event,
      editDialogMode: mode
    })
  }

  closeEditDialog(){
    logInfo(this, 'closeEditDialog: closing edit dialog');
    this.setState({
      showEditDialog: false,
      currentEvent: null,
      editDialogMode: 'edit'
    })
  }

  setNextYear(){
    logInfo(this, `setNextYear: is setting ${this.state.currentYear + 1} year`);
    this.setState({currentYear: this.state.currentYear + 1, loading: true})
  }

  setPreviousYear(){
    logInfo(this, `setPreviousYear: is setting ${this.state.currentYear - 1} year`);
    this.setState({currentYear: this.state.currentYear - 1, loading: true})
  }

  componentDidUpdate(){
    logInfo(this, "componentDidUpdate: component has been updated");
    if (!this.state.showEditDialog){
      this.showEvents(this.state.events);
    }
  }

  componentDidMount(){
    logInfo(this, "componentDidUpdate: component has been just rendered");
    this.showEvents(this.state.events);
  }

  static getDerivedStateFromProps(props, state) {
    console.info("YearCalendar: getDerivedStateFromProps: props has been received");
    state.events = props.events;
    state.loading = props.loading;
    return state;
  }

  render() {
    logInfo(this, "render: start rendering");

    let editDialog;

    if (this.state.showEditDialog) {
      editDialog = <EditEventDialog visible={this.state.showEditDialog}
                    event={this.state.currentEvent} mode={this.state.editDialogMode}
                    onCancelEditDialog={this.closeEditDialog}
                    onUpdateEvent={ this.updateEvent }
                    onCreateEvent={ this.createEvent } />
    }
    else {
      editDialog = <></>
    }

    return (
      <>
        { editDialog }
        <div onMouseDown={ this.handleMouseDown }
             onMouseOver={ this.handleMouseOver }
             onMouseUp={ this.handleMouseUp }

             onTouchStart = { this.handleMouseDown }
             onTouchMove = { this.handleTouchMove }
             onTouchEnd={ this.handleMouseUp }

             className="year-calendar-containter">

          <div className="year-calendar-loading-box" style={{display: this.state.loading ? "notset" : "none"}}>
            <Spin indicator={<LoadingOutlined className="year-calendar-loading-icon" />}
                  className="year-calendar-loading-spinner"
                  tip="Loading..." />
          </div>

          <div className="year-calendar-current-year-box">
            <LeftOutlined onClick={this.setPreviousYear}
                          onMouseDown={(event)=>{event.stopPropagation()}}
                          onMouseUp={(event)=>{event.stopPropagation()}}
                          className="year-calendar-change-year"/>
            <div className="year-calendar-current-year"> {this.state.currentYear} </div>
            <RightOutlined onClick={this.setNextYear}
                          onMouseDown={(event)=>{event.stopPropagation()}}
                          onMouseUp={(event)=>{event.stopPropagation()}}
                          className="year-calendar-change-year"/>
          </div>

          <Row gutter={25} justify="space-around">
            <Col className="gutter-row calendar-row-container" span={4}>
               <MonthCalendar year={this.state.currentYear} month={0} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
               <MonthCalendar year={this.state.currentYear} month={1} events={this.state.events}
                               onShowEditDialog={this.showEditEventDialog}
                               onCancelEditDialog={this.closeEditDialog}
                               onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={2} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={3} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
          </Row>

          <Row gutter={25} justify="space-around">
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={4} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={5} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={6} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={7} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
          </Row>

          <Row gutter={25} justify="space-around">
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={8} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={9} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={10} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
            <Col className="gutter-row calendar-row-container" span={4}>
              <MonthCalendar year={this.state.currentYear} month={11} events={this.state.events}
                              onShowEditDialog={this.showEditEventDialog}
                              onCancelEditDialog={this.closeEditDialog}
                              onDeleteEvent={this.showDeleteConfirm}/>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default YearCalendar;
