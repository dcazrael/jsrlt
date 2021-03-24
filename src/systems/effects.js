import { ActiveEffects, Animate } from '../state/components/';
import { Frozen, Paralyzed, Poisoned } from '../state/components/StatusEffects';
import world from '../state/ecs';

const classes = { Frozen, Paralyzed, Poisoned };

const activeEffectsEntities = world.createQuery({
  all: [ActiveEffects],
});

export const effects = () => {
  activeEffectsEntities.get().forEach((entity) => {
    entity.activeEffects.forEach((c) => {
      if (entity[c.component]) {
        entity[c.component].current += c.delta;

        if (entity[c.component].current > entity[c.component].max) {
          entity[c.component].current = entity[c.component].max;
        }
      }

      if (c.events.length) {
        c.events.forEach((event) => entity.fireEvent(event.name, event.args));
      }

      //handle addComponents
      if (c.addComponents.length) {
        c.addComponents.forEach((component) => {
          if (!entity.has(classes[component.name])) {
            entity.add(classes[component.name], component.properties);
          }
        });
      }

      entity.add(Animate, { ...c.animate });

      if (!c.duration) {
        c.destroy();

        if (c.addComponents.length) {
          c.addComponents.forEach((component) => {
            if (entity.has(classes[component.name])) {
              entity.remove(entity[component.name.toLowerCase()]);
            }
          });
        }
      } else {
        c.duration -= 1;
      }
    });
  });
};
