import { Component } from 'geotic';
import { getEntityArrayRef } from '../../utils/ecs-refs';
import { Position } from './Position';
import { IsPickup } from './Status';

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
    this.inventoryItemIds = this.inventoryItemIds.filter(
      (itemId) => itemId !== evt.data.id
    );
    evt.data.add(Position, {
      x: this.entity.position.x,
      y: this.entity.position.y,
    });
    evt.data.add(IsPickup);
  }

  onConsume(evt) {
    this.inventoryItemIds = this.inventoryItemIds.filter(
      (itemId) => itemId !== evt.data.id
    );

    evt.data.destroy();
  }
}
