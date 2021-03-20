import "./lib/canvas.js";
import { grid } from "./lib/canvas.js";
import { createDungeon } from "./lib/dungeon.js";
import { Move } from "./state/components.js";
import { player } from "./state/ecs.js";
import { movement } from "./systems/movement.js";
import { render } from "./systems/render.js";

//init game map and player position
const dungeon = createDungeon({
  x: grid.map.x,
  y: grid.map.y,
  width: grid.map.width,
  height: grid.map.height,
});
player.position.x = dungeon.rooms[0].center.x;
player.position.y = dungeon.rooms[0].center.y;

render();

document.addEventListener("keydown", (e) => {
  processUserInput(e.key);
});

const processUserInput = (userInput) => {
  if (userInput === "ArrowUp") player.add(Move, { x: 0, y: -1 });
  if (userInput === "ArrowRight") player.add(Move, { x: 1, y: 0 });
  if (userInput === "ArrowDown") player.add(Move, { x: 0, y: 1 });
  if (userInput === "ArrowLeft") player.add(Move, { x: -1, y: 0 });

  movement();
  render();
};
