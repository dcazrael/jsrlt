import { Component } from 'geotic';
import { addCacheSet, deleteCacheSet } from '../cache';

export class Position extends Component {
  static properties = { x: 0, y: 0 };
  onAttached() {
    const locId = `${this.entity.position.x},${this.entity.position.y}`;

    addCacheSet('entitiesAtLocation', locId, this.entity.id);
  }

  onDestroyed() {
    const locId = `${this.x},${this.y}`;
    deleteCacheSet('entitiesAtLocation', locId, this.entity.id);
  }
}
