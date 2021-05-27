import React from 'react';
import './mobile-info-dialog.css'
import { Button } from 'antd';
import COLORS from '../../common/colors.js'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { logInfo, getEventsForDate } from '../../common/utilities.js'
import moment from 'moment';

class MobileInfoDialog extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      events: props.events,
      selectedDate: moment(props.selectedDate)
    }
    this.editEventHandler = this.editEventHandler.bind(this);
    this.deleteEventHandler = this.deleteEventHandler.bind(this);
    this.createEventHandler = this.createEventHandler.bind(this);

  }
  createEventHandler () {
    let event = {
      summary: "",
      start:{
        date: null,
        dateTime: this.state.selectedDate,
      },
      end: {
        date: null,
        dateTime: this.state.selectedDate,
      },
      colorId: "11"
    }

    this.props.onShowMobileEditDialog(event, 'new');
  }

  editEventHandler (event) {
    logInfo(this, "editEventHandler: edit handler is called");
    this.props.onShowMobileEditDialog(event, 'edit');
  }

  deleteEventHandler (event) {
    logInfo(this, "editEventHandler: delete handler is called");
    this.props.onDeleteEvent(event, 'edit');
  }

  render() {
    let eventLines = [];
    let events = getEventsForDate(this.state.events, this.state.selectedDate);
    if (events.length > 0){
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
                                                 this.editEventHandler(event) }}
                            className="mobile-event-popup-actions-icon"/>

              <DeleteOutlined onMouseDown={(event)=>{event.stopPropagation()}}
                              onMouseUp={(event)=>{event.stopPropagation()}}
                              onClick={ (evt) => { evt.stopPropagation();
                                                   this.deleteEventHandler(event) }}
                              className="mobile-event-popup-actions-icon"/>
            </Col>
          </Row>
        )
      });
    } else {
      eventLines = "Нет событий"
    }

    return (
      <>
        <div className="mobile-info-dialog-container">

          <div className="mobile-info-dialog-events-header">
          События
          </div>

          <div className="mobile-info-dialog-events-containter">
          { eventLines }
          </div>

          <div className="mobile-info-dialog-footer">
            <Button className="mobile-info-dialog-footer-btn"
                    onClick={ this.props.onCancelInfoDialog }>
            Закрыть</Button>
            <Button type="primary" className="mobile-info-dialog-footer-btn" onClick={this.createEventHandler}>
              Создать событие
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default MobileInfoDialog;
