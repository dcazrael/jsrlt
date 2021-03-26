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
  Paralyzed,
  Position,
  Power,
  RequiresTarget,
  Target,
  TargetingItem,
} from './components/';
import { IsStairs } from './components/Status';
import {
  Being,
  Floor,
  Goblin,
  HealthPotion,
  Item,
  ManaPotion,
  Player,
  ScrollFireball,
  ScrollLightning,
  ScrollParalyze,
  StairsDown,
  StairsUp,
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
ecs.registerComponent(IsStairs);
ecs.registerComponent(Layer100);
ecs.registerComponent(Layer300);
ecs.registerComponent(Layer400);
ecs.registerComponent(Move);
ecs.registerComponent(RequiresTarget);
ecs.registerComponent(Paralyzed);
ecs.registerComponent(Position);
ecs.registerComponent(Power);
ecs.registerComponent(Target);
ecs.registerComponent(TargetingItem);

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
ecs.registerPrefab(ScrollFireball);
ecs.registerPrefab(ScrollLightning);
ecs.registerPrefab(ScrollParalyze);
ecs.registerPrefab(StairsDown);
ecs.registerPrefab(StairsUp);
ecs.registerPrefab(Wall);

const world = ecs.createWorld();
export default world;
