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
    game.run();
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
  run = () => {
    this.render();
  };
  render = () => {};
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
  constructor(gameState, ctx) {
    this.gameState = gameState;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.updateCanvas();
    this.render();
  }

  updateCanvas = () => {
    this.canvas.width = 200;
    this.canvas.height = 200;
  };
  render = () => {
    this.drawBorder();
    this.clear();
    this.drawBlock();
  };
  clear = () => {
    const { ctx, canvas } = this;
    ctx.clearRect(5, 5, canvas.width - 10, canvas.height - 10);
  };
  drawBorder = () => {
    const { ctx, canvas } = this;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  drawBlock = () => {
    const { grid } = this.gameState;
    const img = new Image();
    img.src = blockSprite;
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, 50, 50 * 1.15);
    };
  };
}
