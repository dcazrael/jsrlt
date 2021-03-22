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
} from '../state/components';
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

export const render = (player) => {
  clearCanvas();

  layer100Entities.get().forEach((entity) => {
    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#333' });
    }
  });

  layer300Entities.get().forEach((entity) => {
    drawCell(entity);
  });

  layer400Entities.get().forEach((entity) => {
    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#100' });
    }
  });

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

  if (gameState === 'INVENTORY') {
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

    if (player.inventory.list.length) {
      player.inventory.list.forEach((entity, idx) => {
        drawText({
          text: `${idx === selectedInventoryIndex ? '*' : ' '}${
            entity.description.name
          }`,
          background: 'black',
          color: 'white',
          x: grid.inventory.x,
          y: grid.inventory.y + 3 + idx,
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
  }
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

const canvas = document.querySelector('canvas');
canvas.onmousemove = throttle((e) => {
  const [x, y] = pxToCell(e);
  const locId = toLocId({ x, y });

  const esAtLoc = readCacheSet('entitiesAtLocation', locId) || [];
  const entitiesAtLoc = [...esAtLoc];

  clearInfoBar();

  if (entitiesAtLoc) {
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
}, 100);
