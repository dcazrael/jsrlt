import { Component } from 'geotic';

// effects
const effectProps = {
  component: '',
  delta: '',
  animate: { char: '', color: '' },
  events: [], // { name: "", args: {} },
  addComponents: [], // { name: '', properties: {} }
  duration: 0, // in turns
};
export class ActiveEffects extends Component {
  static allowMultiple = true;
  static properties = effectProps;
}

export class Effects extends Component {
  static allowMultiple = true;
  static properties = effectProps;
}
