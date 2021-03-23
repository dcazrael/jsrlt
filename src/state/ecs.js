import { Engine } from 'geotic';
import {
  ActiveEffects,
  Ai,
  Animate,
  Appearance,
  Defense,
  Description,
  Effects,
  Health,
  Inventory,
  IsBlocking,
  IsDead,
  IsInFov,
  IsOpaque,
  IsPickup,
  IsRevealed,
  Layer100,
  Layer300,
  Layer400,
  Move,
  Position,
  Power,
} from './components';
import {
  Being,
  Floor,
  Goblin,
  HealthPotion,
  Item,
  ManaPotion,
  Player,
  Tile,
  Wall,
} from './prefabs';

export const ecs = new Engine();

// all Components must be `registered` by the engine
ecs.registerComponent(ActiveEffects);
ecs.registerComponent(Ai);
ecs.registerComponent(Animate);
ecs.registerComponent(Appearance);
ecs.registerComponent(Description);
ecs.registerComponent(Defense);
ecs.registerComponent(Effects);
ecs.registerComponent(Health);
ecs.registerComponent(Inventory);
ecs.registerComponent(IsBlocking);
ecs.registerComponent(IsDead);
ecs.registerComponent(IsInFov);
ecs.registerComponent(IsOpaque);
ecs.registerComponent(IsPickup);
ecs.registerComponent(IsRevealed);
ecs.registerComponent(Layer100);
ecs.registerComponent(Layer300);
ecs.registerComponent(Layer400);
ecs.registerComponent(Move);
ecs.registerComponent(Position);
ecs.registerComponent(Power);

// register "primitives" first!

// register "base" prefabs first!
ecs.registerPrefab(Tile);
ecs.registerPrefab(Being);
ecs.registerPrefab(Item);

ecs.registerPrefab(Floor);
ecs.registerPrefab(HealthPotion);
ecs.registerPrefab(ManaPotion);
ecs.registerPrefab(Goblin);
ecs.registerPrefab(Player);
ecs.registerPrefab(Wall);

export const messageLog = ['', "Welcome to Gobs 'O Goblins!", ''];
export const addLog = (text) => {
  messageLog.unshift(text);
};

const world = ecs.createWorld();
export default world;
