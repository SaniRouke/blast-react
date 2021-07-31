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
  gameState;
  ctx;
  canvas;
  pos;
  rows = 3;
  columns = 5;
  cellSize = 40;
  cellWidth;
  cellHeight;
  gap;
  blocksArray = [];
  constructor(gameState, ctx) {
    this.gameState = gameState;
    this.pos = gameState.grid.pos;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.updateCanvas();
    this.cellWidth = this.cellSize;
    this.cellHeight = this.cellSize * 1.1;
    this.gap = this.cellSize * 0.2;
    this.canvas.width =
      this.cellWidth * this.columns + this.gap * (this.columns + 1);
    this.canvas.height =
      this.cellHeight * this.rows + this.gap * (this.rows + 1);
    this.fillBlocksArray();
    this.ctx.canvas.addEventListener("click", this.onClick);
  }
  runCanvasAnimation = () => {
    this.clear();
    this.render();
    requestAnimationFrame(this.runCanvasAnimation);
  };
  render = () => {
    this.forEachBlockInArray((block) => block.render());
  };
  clear = () => {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  fillBlocksArray = () => {
    const { ctx, rows, columns, cellWidth, cellHeight, gap } = this;
    for (let i = 0; i < rows; i++) {
      this.blocksArray.push([]);
      for (let j = 0; j < columns; j++) {
        this.blocksArray[i].push(
          new Block(ctx, {
            x: j * (cellWidth + gap) + cellWidth / 2 + gap,
            y: i * (cellHeight + gap) + cellHeight / 2 + gap,
          })
        );
      }
    }
  };
  forEachBlockInArray = (func) => {
    const { rows, columns } = this;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        func(this.blocksArray[i][j]);
      }
    }
  };
  onClick = (e) => {
    const { grid } = this.gameState;
    this.forEachBlockInArray((block) => {
      const mousePosOnCanvas = {
        x: e.clientX - grid.pos.x,
        y: e.clientY - grid.pos.y,
      };
      if (block.isMouseOver(mousePosOnCanvas)) {
        block.clicked();
      }
    });
  };
  updateCanvas = () => {
    this.canvas.width = 300;
    this.canvas.height = 200;
  };
}

class Block {
  ctx;
  pos;
  width = 40;
  height;
  constructor(ctx, pos) {
    this.ctx = ctx;
    this.pos = pos;
    this.height = this.width * 1.15;
    this.setSidesPos();
    this.sprite = new Image();
    this.sprite.src = blockSprite;
    console.log(this.pos);
  }
  render = () => {
    const { ctx, pos, width, height, sprite } = this;
    ctx.drawImage(sprite, pos.left, pos.top, width, height);
  };
  setSidesPos = () => {
    const { pos, width, height } = this;
    pos.left = pos.x - width / 2;
    pos.top = pos.y - height / 2;
    pos.right = pos.x + width / 2;
    pos.bottom = pos.y + height / 2;
  };
  isMouseOver = (mousePos) => {
    return (
      mousePos.x > this.pos.left &&
      mousePos.x < this.pos.right &&
      mousePos.y > this.pos.top &&
      mousePos.y < this.pos.bottom
    );
  };
  clicked = () => {
    this.width = 0;
  };
}
