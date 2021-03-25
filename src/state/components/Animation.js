import { Component } from 'geotic';

export class Animate extends Component {
  static allowMultiple = true;
  static properties = {
    startTime: null,
    duration: 250,
    char: '',
    color: '',
  };

  onSetStartTime(evt) {
    this.startTime = evt.data.time;
  }
}
