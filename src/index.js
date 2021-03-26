import { get, sample, times } from 'lodash';
import './lib/canvas';
import { grid, pxToCell } from './lib/canvas';
import { createDungeon } from './lib/dungeon';
import { circle, toLocId } from './lib/grid';
import {
  clearCache,
  deserializeCache,
  readCacheSet,
  serializeCache,
} from './state/cache';
import {
  ActiveEffects,
  Ai,
  Effects,
  IsInFov,
  Move,
  Position,
  Target,
  TargetingItem,
} from './state/components/';
import world from './state/ecs';
import { ai } from './systems/ai';
import { animation } from './systems/animation';
import { effects } from './systems/effects';
import { fov } from './systems/fov';
import { movement } from './systems/movement';
import { render } from './systems/render';
import { targeting } from './systems/targeting';

export let messageLog = ['', "Welcome to Gobs 'O Goblins!", ''];
export const addLog = (text) => {
  messageLog.unshift(text);
};

const enemiesInFOV = world.createQuery({ all: [IsInFov, Ai] });

const initGame = () => {
  //init game map and player position
  const dungeon = createDungeon({
    x: grid.map.x,
    y: grid.map.y,
    width: grid.map.width,
    height: grid.map.height,
  });

  player = world.createPrefab('Player');
  player.add(Position, {
    x: dungeon.rooms[0].center.x,
    y: dungeon.rooms[0].center.y,
  });

  const openTiles = Object.values(dungeon.tiles).filter(
    (x) => x.sprite === 'FLOOR'
  );

  times(10, () => {
    const tile = sample(openTiles);

    world.createPrefab('Goblin').add(Position, { x: tile.x, y: tile.y });
  });

  times(0, () => {
    const tile = sample(openTiles);
    world.createPrefab('HealthPotion').add(Position, { x: tile.x, y: tile.y });
  });

  times(0, () => {
    const tile = sample(openTiles);
    world
      .createPrefab('ScrollLightning')
      .add(Position, { x: tile.x, y: tile.y });
  });
  times(0, () => {
    const tile = sample(openTiles);
    world
      .createPrefab('ScrollParalyze')
      .add(Position, { x: tile.x, y: tile.y });
  });

  times(50, () => {
    const tile = sample(openTiles);
    world
      .createPrefab('ScrollFireball')
      .add(Position, { x: tile.x, y: tile.y });
  });

  fov(player);
  render(player);
};
let player = {};
let userInput = null;
let playerTurn = true;
export let gameState = 'GAME';
export let targetRange = 1;
export let selectedInventoryIndex = 0;

initGame();

document.addEventListener('keydown', (ev) => {
  userInput = ev.key;
});

const processUserInput = () => {
  if (userInput === 'l') {
    loadGame();
  }

  if (userInput === 'n') {
    newGame();
  }

  if (userInput === 's') {
    saveGame();
  }

  if (gameState === 'GAME') {
    if (userInput === 'ArrowUp') {
      player.add(Move, { x: 0, y: -1 });
    }
    if (userInput === 'ArrowRight') {
      player.add(Move, { x: 1, y: 0 });
    }
    if (userInput === 'ArrowDown') {
      player.add(Move, { x: 0, y: 1 });
    }
    if (userInput === 'ArrowLeft') {
      player.add(Move, { x: -1, y: 0 });
    }

    if (userInput === 'g') {
      let pickupFound = false;
      readCacheSet('entitiesAtLocation', toLocId(player.position)).forEach(
        (eId) => {
          const entity = world.getEntity(eId);
          if (entity.isPickup) {
            pickupFound = true;
            player.fireEvent('pick-up', entity);
            addLog(`You pick up a ${entity.description.name}`);
          }
        }
      );
      if (!pickupFound) {
        addLog('There is nothing to pick up here');
      }
    }

    if (userInput === 'i') {
      gameState = 'INVENTORY';
    }

    userInput = null;
  }

  if (gameState === 'TARGETING') {
    if (userInput === 'Escape') {
      player.remove(player.targetingItem);
      gameState = 'GAME';
    }

    userInput = null;
  }

  if (gameState === 'INVENTORY') {
    if (userInput === 'i' || userInput === 'Escape') {
      gameState = 'GAME';
    }

    if (userInput === 'ArrowUp') {
      selectedInventoryIndex -= 1;
      if (selectedInventoryIndex < 0) selectedInventoryIndex = 0;
    }

    if (userInput === 'ArrowDown') {
      selectedInventoryIndex += 1;
      if (selectedInventoryIndex > player.inventory.inventoryItems.length - 1)
        selectedInventoryIndex = player.inventory.inventoryItems.length - 1;
    }

    if (userInput === 'c') {
      const entity = player.inventory.inventoryItems[selectedInventoryIndex];

      if (entity) {
        if (entity.requiresTarget) {
          targetRange = entity.requiresTarget.aoeRange || 1;

          if (entity.requiresTarget.acquired === 'RANDOM') {
            // get a target that is NOT the player
            const target = sample([...enemiesInFOV.get()]);
            if (target) {
              player.add(TargetingItem, { itemId: entity.id });
              player.add(Target, { locId: toLocId(target.position) });
            } else {
              addLog(`The scroll disintegrates uselessly in your hand`);
              player.fireEvent('consume', entity);
            }
          } else if (entity.requiresTarget.acquired === 'MANUAL') {
            player.add(TargetingItem, { itemId: entity.id });
            gameState = 'TARGETING';
            return;
          }
        } else if (entity.has(Effects)) {
          entity.effects.forEach((x) =>
            player.add(ActiveEffects, { ...x.serialize() })
          );
          addLog(`You consume a ${entity.description.name}`);
          player.fireEvent('consume', entity);
        }
      }
      selectedInventoryIndex = 0;
      gameState = 'GAME';
    }

    if (userInput === 'd') {
      if (player.inventory.inventoryItems.length) {
        const entity = player.inventory.inventoryItems[selectedInventoryIndex];
        addLog(`You drop a ${entity.description.name}`);
        player.fireEvent('drop', entity);
      }
    }

    userInput = null;
  }
};

const update = () => {
  animation();

  if (player.isDead) {
    if (gameState !== 'GAMEOVER') {
      addLog('You are dead.');
      render(player);
    }
    gameState = 'GAMEOVER';
    processUserInput();
    return;
  }

  if (playerTurn && userInput && gameState === 'TARGETING') {
    processUserInput();
    render(player);
    playerTurn = true;
  }

  if (playerTurn && userInput && gameState === 'INVENTORY') {
    effects();
    processUserInput();
    gameState === 'TARGETING';
    render(player);
    playerTurn = true;
  }

  if (playerTurn && userInput && gameState === 'GAME') {
    effects();
    processUserInput();
    movement();
    fov(player);
    render(player);

    playerTurn = false;
  }

  if (!playerTurn) {
    effects();
    ai(player);
    movement();
    fov(player);
    render(player);

    playerTurn = true;
  }
};

const gameLoop = () => {
  update();
  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

const canvas = document.querySelector('#canvas');

canvas.onclick = (e) => {
  const [x, y] = pxToCell(e);
  const locId = toLocId({ x, y });

  readCacheSet('entitiesAtLocation', locId).forEach((eId) => {
    const entity = world.getEntity(eId);

    // Only do this during development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${get(entity, 'appearance.char', '?')} ${get(
          entity,
          'description.name',
          '?'
        )}`,
        entity.serialize()
      );
    }

    if (gameState === 'TARGETING') {
      const entity = player.inventory.inventoryItems[selectedInventoryIndex];
      if (entity.requiresTarget.aoeRange) {
        const targets = circle({ x, y }, entity.requiresTarget.aoeRange);
        targets.forEach((locId) => player.add(Target, { locId }));
      } else {
        player.add(Target, { locId });
      }
      gameState = 'GAME';
      targeting(player);
      effects();
      render(player);
    }
  });
};

const saveGame = () => {
  const gameSaveData = {
    world: world.serialize(),
    cache: serializeCache(),
    playerId: player.id,
    messageLog,
  };

  localStorage.setItem('gameSaveData', JSON.stringify(gameSaveData));
  addLog('Game saved');
};

const loadGame = () => {
  const data = JSON.parse(localStorage.getItem('gameSaveData'));
  if (!data) {
    addLog('Failed to load = no saved games found');
    return;
  }

  for (let entity of world.getEntities()) {
    entity.destroy();
  }

  world.deserialize(data.world);
  deserializeCache(data.cache);

  player = world.getEntity(data.playerId);

  userInput = null;
  playerTurn = true;
  gameState = 'GAME';
  selectedInventoryIndex = 0;

  messageLog = data.messageLog;
  addLog('Game loaded');
};

const newGame = () => {
  for (let item of world.getEntities()) {
    item.destroy();
  }

  clearCache();

  userInput = null;
  playerTurn = true;
  gameState = 'GAME';
  selectedInventoryIndex = 0;

  messageLog = ['', "Welcome to Gobs 'O Goblins!", ''];

  initGame();
};
