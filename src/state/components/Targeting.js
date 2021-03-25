import { Component } from 'geotic';

export class RequiresTarget extends Component {
  static properties = {
    acquired: 'RANDOM',
    aoeRange: 0,
  };
}

export class Target extends Component {
  static allowMultiple = true;
  static properties = { locId: '' };
}

export class TargetingItem extends Component {
  static properties = { itemId: 0 };

  get item() {
    return getEntityRef(this, 'itemId');
  }

  set item(value) {
    setEntityRef(this, 'itemId', value);
  }
}
