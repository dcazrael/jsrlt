import "./lib/canvas.js";
import { createDungeon } from "./lib/dungeon.js";
import { Move } from "./state/components.js";
import { player } from "./state/ecs.js";
import { movement } from "./systems/movement.js";
import { render } from "./systems/render.js";

//init game map and player position
const dungeon = createDungeon();
player.position.x = dungeon.center.x;
player.position.y = dungeon.center.y;

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
