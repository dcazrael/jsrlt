import { Component } from 'geotic';
import { remove } from 'lodash';
import { addCacheSet } from './cache';

export class Ai extends Component {}
export class Appearance extends Component {
  static properties = {
    color: '#ff0077',
    char: '?',
    background: '#000',
  };
}

// animations
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
    evt.handle();
  }
}

// misc
export class Description extends Component {
  static properties = { name: 'No Name' };
}

// effects
export class ActiveEffects extends Component {
  static allowMultiple = true;
  static properties = {
    component: '',
    delta: '',
    animate: { char: '', color: '' },
  };
}

export class Effects extends Component {
  static allowMultiple = true;
  static properties = {
    component: '',
    delta: '',
    animate: { char: '', color: '' },
  };
}

// status
export class IsBlocking extends Component {}
export class IsDead extends Component {}
export class IsInFov extends Component {}
export class IsOpaque extends Component {}
export class IsPickup extends Component {}
export class IsRevealed extends Component {}

// layers
export class Layer100 extends Component {}
export class Layer300 extends Component {}
export class Layer400 extends Component {}

// actions
export class Move extends Component {
  static properties = { x: 0, y: 0, relative: true };
}

// combat
export class Defense extends Component {
  static properties = { max: 1, current: 1 };
}
export class Health extends Component {
  static properties = { max: 10, current: 10 };

  onTakeDamage(evt) {
    this.current -= evt.data.amount;
    evt.handle();
  }
}
export class Power extends Component {
  static properties = { max: 5, current: 5 };
}

// inventory
export class Inventory extends Component {
  static properties = {
    list: [],
  };

  onPickUp(evt) {
    this.list.push(evt.data);

    if (evt.data.position) {
      evt.data.remove(evt.data.position);
      evt.data.remove(evt.data.isPickup);
    }
  }

  onDrop(evt) {
    console.log(evt);
    remove(this.list, (x) => x.id === evt.data.id);
    evt.data.add(Position, this.entity.position);
    evt.data.add(IsPickup);
  }
}

// positional
export class Position extends Component {
  static properties = { x: 0, y: 0 };
  onAttached() {
    const locId = `${this.entity.position.x},${this.entity.position.y}`;
    addCacheSet('entitiesAtLocation', locId, this.entity.id);
  }

  onDetached() {
    const locId = `${this.x},${this.y}}`;
    deleteCacheSet('entitiesAtLocation', locId, this.entity.id);
  }
}
