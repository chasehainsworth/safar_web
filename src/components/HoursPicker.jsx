import React, { Component } from "react";
import { TimePicker, Modal, Select, Button, Row, Col } from "antd";
import moment from "moment";

import strings from "../constants/localization";

const dayStrings = [
  strings.MONDAY,
  strings.TUESDAY,
  strings.WEDNESDAY,
  strings.THURSDAY,
  strings.FRIDAY,
  strings.SATURDAY,
  strings.SUNDAY
];

const days = [
  "Monday",
  "Tuesday",
  "Wesnesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const timeRow = { day: "", start: "", end: "" };

function parseTimes(timesString) {
  let jsonObj = {};
  try {
    jsonObj = JSON.parse(timesString);
  } catch (e) {}

  let returnObj = [];
  days.forEach(d => {
    if (jsonObj[d]) {
      for (let i = 0; i < jsonObj[d].length; i += 2) {
        let row = {
          day: d,
          start: jsonObj[d][i],
          end: jsonObj[d][i + 1]
        };
        returnObj.push(row);
      }
    }
  });

  return returnObj;
}

class HoursPicker extends Component {
  constructor(props) {
    super(props);

    let times = [];
    if (!!this.props.currentTimes) {
      times = parseTimes(this.props.currentTimes);
    }

    this.state = { visible: this.props.visible, lastDay: null, times };
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentTimes !== prevProps.currentTimes) {
      this.setState({ times: parseTimes(this.props.currentTimes) });
    }
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  addTimeRow = () => {
    let { times } = this.state;
    times.push({ ...timeRow });
    this.setState({ times });
  };

  setDay = (index, value) => {
    let { times } = this.state;
    times[index].day = value;
    this.setState({ times });
  };

  setStart = (index, timeStr) => {
    let { times } = this.state;
    times[index].start = timeStr;
    this.setState({ times });
  };

  setEnd = (index, timeStr) => {
    let { times } = this.state;
    times[index].end = timeStr;
    this.setState({ times });
  };

  removeTimeRow = i => {
    let { times } = this.state;
    delete times[i];
    this.setState({ times });
  };

  handleOk = () => {
    // TODO: MAKE SURE TO CHECK FOR NULL VALUES IN ARRAY BC Deleting them, not removing the space.
    let compiledDays = {};

    this.state.times
      .filter(
        elem =>
          elem !== null &&
          elem.day !== "" &&
          elem.start !== "" &&
          elem.end !== ""
      )
      .forEach(t => {
        if (!compiledDays[t.day]) {
          compiledDays[t.day] = [];
        }
        compiledDays[t.day].push(t.start);
        compiledDays[t.day].push(t.end);
      });
    this.props.onOk(compiledDays);
    // this.setState({ times: [] });
  };

  render() {
    return (
      <Modal
        title='Enter Hours'
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleOk}
        footer={[
          <Button key='submit' type='primary' onClick={this.handleOk}>
            Ok
          </Button>
        ]}
        width='100%'
        style={{ maxWidth: 600 }}
      >
        {this.state.times.map((t, i) => (
          <Row key={t} style={{ paddingBottom: 5 }}>
            <Col span={20}>
              <Row>
                <Col span={8}>
                  {/* All this for default value T.T */}
                  {t.day !== "" ? (
                    <Select
                      placeholder={strings.CHOOSE_DAY}
                      style={{ width: 150 }}
                      onChange={value => this.setDay(i, value)}
                      defaultValue={t.day !== "" ? t.day : null}
                    >
                      {days.map((d, j) => (
                        <Select.Option key={d} value={d}>
                          {dayStrings[j]}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      placeholder={strings.CHOOSE_DAY}
                      style={{ width: 150 }}
                      onChange={value => this.setDay(i, value)}
                    >
                      {days.map((d, j) => (
                        <Select.Option key={d} value={d}>
                          {dayStrings[j]}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Col>
                <Col span={8}>
                  <TimePicker
                    format='HH:mm'
                    placeholder={strings.SELECT_START_TIME}
                    style={{ width: 150 }}
                    onChange={(time, timeStr) => this.setStart(i, timeStr)}
                    defaultValue={
                      t.start !== "" ? moment(t.start, "HH:mm") : null
                    }
                  />
                </Col>
                <Col span={8}>
                  <TimePicker
                    format='HH:mm'
                    placeholder={strings.SELECT_END_TIME}
                    style={{ width: 150 }}
                    onChange={(time, timeStr) => this.setEnd(i, timeStr)}
                    defaultValue={t.end !== "" ? moment(t.end, "HH:mm") : null}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={4}>
              <Button
                icon='close'
                style={{ marginLeft: 20 }}
                onClick={() => this.removeTimeRow(i)}
              />
            </Col>
          </Row>
        ))}
        <Button icon='plus' onClick={this.addTimeRow} />
      </Modal>
    );
  }
}

export default HoursPicker;
