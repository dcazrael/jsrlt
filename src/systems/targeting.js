import { readCacheSet } from '../state/cache';
import {
  ActiveEffects,
  Effects,
  Target,
  TargetingItem,
} from '../state/components/';
import world, { addLog } from '../state/ecs';

const targetingEntities = world.createQuery({
  all: [Target, TargetingItem],
});

export const targeting = (player) => {
  targetingEntities.get().forEach((entity) => {
    const item = world.getEntity(entity.targetingItem.itemId);

    if (item && item.has(Effects)) {
      const targets = readCacheSet('entitiesAtLocation', entity.target.locId);

      targets.forEach((eId) => {
        const target = world.getEntity(eId);

        item.effects.forEach((x) => {
          target.add(ActiveEffects, { ...x.serialize() });
        });
      });

      entity.remove(entity.target);
      entity.remove(entity.targetingItem);

      addLog(`You use a ${item.description.name}`);
      player.fireEvent('consume', item);
    }
  });
};
