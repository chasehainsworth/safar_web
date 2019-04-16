import React, { Component } from "react";
import { TimePicker, Modal, Select, Button, Row, Col } from "antd";
import moment from "moment";
import PropTypes from "prop-types";

import strings from "../constants/localization";

/*
dayStrings is the visible value of days. days will be what submits to the database.
 */
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

/**
 * An antd Modal for choosing open and closing times for providers and services. A
 * blank list will show only a __+__. Each time the plus is clicked, a new entry will
 * be added to the list with _day, start time, and end time_ entry points. On closing
 * the Modal, all fields with proper data will be converted to a json string for
 * keeping track of and submitting the days in firebase.
 *
 * The json is formatted as follows:
 *
 * ```json
 * {
 *    "Monday": ["12:00", "14:00", "15:00", "16:30"],
 *    "Friday": ["12:34", "12:38"]
 * }
 *
 * Which means:
 * Monday, 12-14, 15-16 (or 12p-2p, 3p-4p)
 * Friday, 12:34-12:38
 *
 * ```
 *
 * The keys will only be the names of days of the week in english
 * and will only exist if the array is not empty, and the values
 * will always be an array of strings which are pairs of <start-end> times.
 *
 * If the currentTimes string prop is not empty when opening the Modal, the json in
 * the string will be attempted to parse. It will parse into a list of inputs of
 * times.
 */
export class HoursPicker extends Component {
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

  /**
   * Adds a new blank row to the list of times to be filled out.
   * @public
   */
  addTimeRow = () => {
    let { times } = this.state;
    times.push({ ...timeRow });
    this.setState({ times });
  };

  /**
   * Updates the list of times with the day that was set at a row's index (when the
   * day is changed).
   *
   * @param {number} index
   * @param {string} value
   * @public
   */
  setDay = (index, value) => {
    let { times } = this.state;
    times[index].day = value;
    this.setState({ times });
  };

  /**
   * Updates the list of times with the start that was set at a row's index (when the
   * start time is changed).
   *
   * @param {number} index
   * @param {string} timeStr
   * @public
   */
  setStart = (index, timeStr) => {
    let { times } = this.state;
    times[index].start = timeStr;
    this.setState({ times });
  };

  /**
   * Updates the list of times with the end that was set at a row's index (when the
   * end time is changed).
   *
   * @param {number} index
   * @param {string} timeStr
   * @public
   */
  setEnd = (index, timeStr) => {
    let { times } = this.state;
    times[index].end = timeStr;
    this.setState({ times });
  };

  /**
   * Removes a row from the array of times.
   * <br>
   * _Note: Deletes the object but doesn't resize the array._
   * @public
   */
  removeTimeRow = i => {
    let { times } = this.state;
    delete times[i];
    this.setState({ times });
  };

  /**
   * Validates the list of times, filters any bad values, and parses the times into
   * a json string.
   * @public
   */
  handleOk = () => {
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

HoursPicker.propTypes = {
  /** A string to parse for times and input times to. */
  currentTimes: PropTypes.string,
  /** Whether or not the Modal is visible. */
  visible: PropTypes.bool,
  /** Method called when the Modal is closed. */
  onOkay: PropTypes.object
};

export default HoursPicker;
