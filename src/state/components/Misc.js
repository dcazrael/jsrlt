import { Component } from 'geotic';

export class Description extends Component {
  static properties = { name: 'No Name' };
}

export class Appearance extends Component {
  static properties = {
    color: '#ff0077',
    char: '?',
    background: '#000',
  };
}
