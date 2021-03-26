import { Component } from 'geotic';
import { addCacheSet, deleteCacheSet } from '../cache';

export class Position extends Component {
  static properties = { x: 0, y: 0, z: -1 };
  onAttached() {
    const locId = `${this.entity.position.x},${this.entity.position.y},${this.entity.position.z}`;

    addCacheSet('entitiesAtLocation', locId, this.entity.id);
  }

  onDestroyed() {
    const locId = `${this.x},${this.y},${this.z}`;
    deleteCacheSet('entitiesAtLocation', locId, this.entity.id);
  }
}
