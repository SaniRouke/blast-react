import { useEffect, useState } from "react";
import blockSprite from "../img/block.png";

function GameComponent() {
  const [gameState, setGameState] = useState({
    grid: {
      pos: {
        x: 50,
        y: 50,
      },
      rows: 5,
      columns: 5,
    },
  });
  useEffect(() => {
    main();
  });

  const main = () => {
    const game = new Game(gameState);
  };

  return (
    <div id="Game">
      <button onClick={() => {}}>Start</button>
      <GridComponent gameState={gameState} />
    </div>
  );
}
class Game {
  constructor(gameState) {
    this.gameState = gameState;
  }
  stage = () => {};
}

export default GameComponent;

const GridComponent = (props) => {
  const { gameState } = props;
  const [canvas, setCanvas] = useState(null);
  console.log(canvas);
  useEffect(() => {
    initState();
  });
  const initState = () => {
    if (!canvas) {
      setCanvas(() => document.getElementById("canvas"));
    } else {
      main();
    }
  };
  const main = () => {
    console.log("main");
    const ctx = canvas.getContext("2d");
    const grid = new Grid(gameState, ctx);
    grid.runCanvasAnimation();
  };
  const styles = {
    top: gameState.grid.pos.x,
    left: gameState.grid.pos.y,
  };
  return (
    <div id="Grid" style={styles}>
      <canvas id="canvas"></canvas>
    </div>
  );
};
class Grid {
  blocksArray = [];
  constructor(gameState, ctx) {
    this.gameState = gameState;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.updateCanvas();
    this.blocksArray.push(new Block(ctx, { x: 10, y: 10 }));
  }
  runCanvasAnimation = () => {
    this.clear();
    this.render();
    requestAnimationFrame(this.runCanvasAnimation);
  };
  render = () => {
    this.blocksArray.forEach((block) => block.render());
  };
  clear = () => {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  updateCanvas = () => {
    this.canvas.width = 200;
    this.canvas.height = 200;
  };
}

class Block {
  ctx;
  pos;
  constructor(ctx, pos) {
    this.ctx = ctx;
    this.pos = pos;
    this.sprite = new Image();
    this.sprite.src = blockSprite;
    this.addEvents();
  }
  render = () => {
    const { ctx, pos, sprite } = this;
    ctx.drawImage(sprite, pos.x, pos.y, 50, 50 * 1.15);
  };
  addEvents = () => {};
}
