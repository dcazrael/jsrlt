import "./lib/canvas";
import { grid } from "./lib/canvas";
import { createDungeon } from "./lib/dungeon";
import { Move, Position } from "./state/components";
import { player } from "./state/ecs";
import { fov } from "./systems/fov";
import { movement } from "./systems/movement";
import { render } from "./systems/render";

//init game map and player position
const dungeon = createDungeon({
  x: grid.map.x,
  y: grid.map.y,
  width: grid.map.width,
  height: grid.map.height,
});

player.add(Position, {
  x: dungeon.rooms[0].center.x,
  y: dungeon.rooms[0].center.y,
});

fov();
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
  fov();
  render();
};
