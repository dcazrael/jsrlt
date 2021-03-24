import { Component } from 'geotic';
import {
  getEntityArrayRef,
  getEntityRef,
  setEntityRef,
} from '../../utils/ecs-refs';
import { addCacheSet, deleteCacheSet } from '../cache';

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
  }
}

// misc
export class Description extends Component {
  static properties = { name: 'No Name' };
}

// effects
export { ActiveEffects, Effects } from './Effects';
//status effect
export { Frozen, Paralyzed, Poisoned } from './StatusEffects';

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

    if (this.current <= 0) {
      this.entity.appearance.char = '%';
      if (this.entity.has(Ai)) {
        this.entity.remove(this.entity.ai);
      }
      if (this.entity.has(IsBlocking)) {
        this.entity.remove(this.entity.isBlocking);
      }
      this.entity.add(IsDead);
      this.entity.remove(this.entity.layer400);
      this.entity.add(Layer300);
    }
    evt.handle();
  }
}
export class Power extends Component {
  static properties = { max: 5, current: 5 };
}

export class RequiresTarget extends Component {
  static properties = {
    acquired: 'RANDOM',
  };
}

export class Target extends Component {
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

// inventory
export class Inventory extends Component {
  static properties = {
    inventoryItemIds: [],
  };

  get inventoryItems() {
    return getEntityArrayRef(this, 'inventoryItemIds');
  }

  onPickUp(evt) {
    this.inventoryItemIds.push(evt.data.id);

    if (evt.data.position) {
      evt.data.remove(evt.data.position);
      evt.data.remove(evt.data.isPickup);
    }
  }

  onDrop(evt) {
    this.inventoryItemIds = this.inventoryItemIds.filter((inventoryItemId) => {
      if (inventoryItemId !== evt.data.id) return inventoryItemId;
    });
    evt.data.add(Position, this.entity.position);
    evt.data.add(IsPickup);
  }

  onConsume(evt) {
    this.inventoryItemIds = this.inventoryItemIds.filter((inventoryItemId) => {
      if (inventoryItemId !== evt.data.id) return inventoryItemId;
    });

    evt.data.destroy();
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
    const locId = `${this.x},${this.y}`;
    deleteCacheSet('entitiesAtLocation', locId, this.entity.id);
  }

  onDestroyed() {
    const locId = `${this.x},${this.y}`;
    deleteCacheSet('entitiesAtLocation', locId, this.entity.id);
  }
}
