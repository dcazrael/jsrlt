import { Component } from 'geotic';
import { Ai } from './Ai';
import { Layer300, Layer400 } from './Layers';
import { IsBlocking, IsDead } from './Status';

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
      if (this.entity.has(Layer400)) {
        this.entity.remove(this.entity.layer400);
      }
      this.entity.add(Layer300);
    }
    evt.handle();
  }
}
export class Power extends Component {
  static properties = { max: 5, current: 5 };
}
