import { throttle } from 'lodash';
import { gameState, selectedInventoryIndex } from '..';
import {
  clearCanvas,
  drawCell,
  drawRect,
  drawText,
  grid,
  pxToCell,
} from '../lib/canvas';
import { toLocId } from '../lib/grid';
import { readCacheSet } from '../state/cache';
import {
  Appearance,
  IsInFov,
  IsRevealed,
  Layer100,
  Layer300,
  Layer400,
  Position,
} from '../state/components/';
import world, { messageLog } from '../state/ecs';

const layer100Entities = world.createQuery({
  all: [Position, Appearance, Layer100],
  any: [IsInFov, IsRevealed],
});

const layer300Entities = world.createQuery({
  all: [Position, Appearance, Layer300],
  any: [IsInFov, IsRevealed],
});

const layer400Entities = world.createQuery({
  all: [Position, Appearance, Layer400, IsInFov],
});

const clearMap = () => {
  clearCanvas(grid.map.x - 1, grid.map.y, grid.map.width + 1, grid.map.height);
};

export const renderMap = (player) => {
  clearMap();

  layer100Entities.get().forEach((entity) => {
    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#333' });
    }
  });

  layer300Entities.get().forEach((entity) => {
    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#333' });
    }
  });

  layer400Entities.get().forEach((entity) => {
    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#100' });
    }
  });
};

const clearPlayerHud = () => {
  clearCanvas(
    grid.playerHud.x,
    grid.playerHud.y,
    grid.playerHud.width + 1,
    grid.playerHud.height
  );
};

const renderPlayerHud = (player) => {
  clearPlayerHud();

  drawText({
    text: `${player.appearance.char} ${player.description.name}`,
    background: `${player.appearance.background}`,
    color: `${player.appearance.color}`,
    x: grid.playerHud.x,
    y: grid.playerHud.y,
  });

  drawText({
    text: '♥'.repeat(grid.playerHud.width),
    background: 'black',
    color: '#333',
    x: grid.playerHud.x,
    y: grid.playerHud.y + 1,
  });

  const hp = player.health.current / player.health.max;

  if (hp > 0) {
    drawText({
      text: '♥'.repeat(hp * grid.playerHud.width),
      background: 'black',
      color: 'red',
      x: grid.playerHud.x,
      y: grid.playerHud.y + 1,
    });
  }
};

const clearMessageLog = () => {
  clearCanvas(
    grid.messageLog.x,
    grid.messageLog.y,
    grid.messageLog.width + 1,
    grid.messageLog.height
  );
};

const renderMessageLog = () => {
  clearMessageLog();

  drawText({
    text: messageLog[2],
    background: '#000',
    color: '#666',
    x: grid.messageLog.x,
    y: grid.messageLog.y,
  });

  drawText({
    text: messageLog[1],
    background: '#000',
    color: '#aaa',
    x: grid.messageLog.x,
    y: grid.messageLog.y + 1,
  });

  drawText({
    text: messageLog[0],
    background: '#000',
    color: '#fff',
    x: grid.messageLog.x,
    y: grid.messageLog.y + 2,
  });
};

//info bar on mouseover
const clearInfoBar = () => {
  drawText({
    text: ` `.repeat(grid.infoBar.width),
    x: grid.infoBar.x,
    y: grid.infoBar.y,
    background: 'black',
  });
};

const renderInfoBar = (mPos) => {
  clearInfoBar();

  const { x, y } = mPos;
  const locId = toLocId({ x, y });

  const esAtLoc = readCacheSet('entitiesAtLocation', locId) || [];
  const entitiesAtLoc = [...esAtLoc];

  clearInfoBar();

  if (entitiesAtLoc) {
    if (entitiesAtLoc.some((eId) => world.getEntity(eId).isRevealed)) {
      drawCell({
        appearance: {
          char: '',
          background: 'rgba(255,255,255, 0.5)',
        },
        position: { x, y },
      });
    }

    entitiesAtLoc
      .filter((eId) => {
        const entity = world.getEntity(eId);
        return (
          layer100Entities.matches(entity) ||
          layer300Entities.matches(entity) ||
          layer400Entities.matches(entity)
        );
      })
      .forEach((eId) => {
        const entity = world.getEntity(eId);
        clearInfoBar();

        if (entity.isInFov) {
          drawText({
            text: `You see a ${entity.description.name}(${entity.appearance.char}) here.`,
            x: grid.infoBar.x,
            y: grid.infoBar.y,
            color: 'white',
            background: 'black',
          });
        } else {
          drawText({
            text: `You remember seeing a ${entity.description.name}(${entity.appearance.char}) here.`,
            x: grid.infoBar.x,
            y: grid.infoBar.y,
            color: 'white',
            background: 'black',
          });
        }
      });
  }
};

const renderInventory = (player) => {
  // translucent to obscure the game map
  drawRect(0, 0, grid.width, grid.height, 'rgba(0,0,0,0.65)');

  drawText({
    text: 'INVENTORY',
    background: 'black',
    color: 'white',
    x: grid.inventory.x,
    y: grid.inventory.y,
  });

  drawText({
    text: '(c)Consume (d)Drop',
    background: 'black',
    color: '#666',
    x: grid.inventory.x,
    y: grid.inventory.y + 1,
  });

  if (player.inventory.inventoryItemIds.length) {
    player.inventory.inventoryItemIds.forEach((itemId, index) => {
      const entity = world.getEntity(itemId);
      drawText({
        text: `${index === selectedInventoryIndex ? '*' : ' '}${
          entity.description.name
        }`,
        background: 'black',
        color: 'white',
        x: grid.inventory.x,
        y: grid.inventory.y + 3 + index,
      });
    });
  } else {
    drawText({
      text: '-empty-',
      background: 'black',
      color: '#666',
      x: grid.inventory.x,
      y: grid.inventory.y + 3,
    });
  }
};

const renderTargeting = (mPos) => {
  const { x, y } = mPos;
  const locId = toLocId({ x, y });
  const esAtLoc = readCacheSet('entitiesAtLocation', locId) || [];
  const entitiesAtLoc = [...esAtLoc];

  clearInfoBar();

  if (entitiesAtLoc) {
    if (entitiesAtLoc.some((eId) => world.getEntity(eId).isRevealed)) {
      drawCell({
        appearance: {
          char: '',
          background: 'rgba(74, 232, 218, 0.5)',
        },
        position: { x, y },
      });
    }
  }
};

export const render = (player) => {
  renderMap();
  renderPlayerHud(player);
  renderMessageLog();

  if (gameState === 'INVENTORY') {
    renderInventory(player);
  }
};

const canvas = document.querySelector('canvas');
canvas.onmousemove = throttle((e) => {
  if (gameState === 'GAME') {
    const [x, y] = pxToCell(e);
    renderMap();
    renderInfoBar({ x, y });
  }

  if (gameState === 'TARGETING') {
    const [x, y] = pxToCell(e);
    renderMap();
    renderTargeting({ x, y });
  }
}, 100);
