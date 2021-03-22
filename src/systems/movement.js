import { grid } from '../lib/canvas';
import { addCacheSet, deleteCacheSet, readCacheSet } from '../state/cache';
import {
  Ai,
  Defense,
  Health,
  IsBlocking,
  IsDead,
  Layer300,
  Move,
} from '../state/components';
import world, { addLog } from '../state/ecs';

const movableEntities = world.createQuery({
  all: [Move],
});

const attack = (entity, target) => {
  const damage = entity.power.current - target.defense.current;
  target.fireEvent('take-damage', { amount: damage });

  if (target.health.current <= 0) {
    kill(target);

    return addLog(
      `${entity.description.name} kicked a ${target.description.name} for ${damage} damage and killed ${target.description.name}!`
    );
  }
  addLog(
    `${entity.description.name} kicked a ${target.description.name} for ${damage} damage!`
  );
};

const kill = (entity) => {
  entity.appearance.char = '%';
  if (entity.has(Ai) && entity.has(IsBlocking)) {
    entity.remove(entity.ai);
    entity.remove(entity.isBlocking);
  }
  entity.add(IsDead);
  entity.remove(entity.layer400);
  entity.add(Layer300);
};

export const movement = () => {
  movableEntities.get().forEach((entity) => {
    let mx = entity.move.x;
    let my = entity.move.y;
    if (entity.move.relative) {
      mx = entity.position.x + entity.move.x;
      my = entity.position.y + entity.move.y;
    }

    // this is where we will run any checks to see if entity can move to new location
    // observe map boundaries
    mx = Math.min(grid.map.width + grid.map.x - 1, Math.max(0, mx));
    my = Math.min(grid.map.height + grid.map.y - 1, Math.max(0, my));

    // check for blockers
    const blockers = [];
    const entitiesAtLocation = readCacheSet(
      'entitiesAtLocation',
      `${mx},${my}`
    );

    for (const eId of entitiesAtLocation) {
      if (world.getEntity(eId).isBlocking) {
        blockers.push(eId);
      }
    }

    if (blockers.length) {
      blockers.forEach((eId) => {
        const target = world.getEntity(eId);
        if (target.has(Health) && target.has(Defense)) {
          attack(entity, target);
        } else {
          addLog(
            `${entity.description.name} bump into a ${target.description.name}`
          );
        }
      });
      entity.remove(entity.move);
      return;
    }

    deleteCacheSet(
      'entitiesAtLocation',
      `${entity.position.x},${entity.position.y}`,
      entity.id
    );
    addCacheSet('entitiesAtLocation', `${mx},${my}`, entity.id);

    entity.position.x = mx;
    entity.position.y = my;

    entity.remove(entity.move);
  });
};
