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
  columns = 10;
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
    this.cellWidth = this.cellSize;
    this.cellHeight = this.cellSize * 1.1;
    this.gap = this.cellSize * 0.1;
    this.resizeCanvas();
    this.fillblocksToGridArray();
    this.ctx.canvas.addEventListener("click", this.onClick);
  }
  runCanvasAnimation = () => {
    this.clear();
    this.render();
    requestAnimationFrame(this.runCanvasAnimation);
  };
  render = () => {
    this.forEachBlockInGrid((block) => block.render());
  };
  clear = () => {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  fillblocksToGridArray = () => {
    const { ctx, rows, columns, cellWidth, cellHeight, gap } = this;
    for (let i = 0; i < rows; i++) {
      this.blocksArray.push([]);
      for (let j = 0; j < columns; j++) {
        this.blocksArray[i].push(
          new Block(ctx, {
            row: i,
            column: j,
            x: j * (cellWidth + gap) + cellWidth / 2 + gap,
            y: i * (cellHeight + gap) + cellHeight / 2 + gap,
          })
        );
      }
    }
  };
  forEachBlockInGrid = (func) => {
    const { rows, columns } = this;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        func(this.blocksArray[i][j]);
      }
    }
  };
  getNeighbors = (currentBlock) => {
    const { blocksArray } = this;
    const { row, column } = currentBlock.pos;
    const neighbors = [];
    if (blocksArray[row][column - 1]) {
      neighbors.push(blocksArray[row][column - 1]);
    }
    if (blocksArray[row][column + 1]) {
      neighbors.push(blocksArray[row][column + 1]);
    }
    if (blocksArray[row - 1] && blocksArray[row - 1][column]) {
      neighbors.push(blocksArray[row - 1][column]);
    }
    if (blocksArray[row + 1] && blocksArray[row + 1][column]) {
      neighbors.push(blocksArray[row + 1][column]);
    }
    return neighbors;
  };
  destroy = (block) => {
    const neighbors = this.getNeighbors(block);
    neighbors.forEach((n) => {
      if (n.color.name === block.color.name) {
        if (!block.isAlive) {
          block.die();
        }
        if (!n.isAlive) {
          this.destroy(n);
        }
      }
    });
  };
  onClick = (e) => {
    const { grid } = this.gameState;
    this.forEachBlockInGrid((block) => {
      const mousePosOnCanvas = {
        x: e.clientX - grid.pos.x,
        y: e.clientY - grid.pos.y,
      };
      if (block.isMouseOver(mousePosOnCanvas)) {
        this.destroy(block);
      }
    });
  };
  resizeCanvas = () => {
    this.canvas.width =
      this.cellWidth * this.columns + this.gap * (this.columns + 1);
    this.canvas.height =
      this.cellHeight * this.rows + this.gap * (this.rows + 1);
  };
}

class Block {
  ctx;
  pos;
  width = 40;
  height;
  sprite;
  color = "rbg(0,0,0)";
  isAlive = false;
  constructor(ctx, pos) {
    this.ctx = ctx;
    this.pos = pos;
    this.height = this.width * 1.15;
    this.setSidesPos();
    this.sprite = new Image();
    this.sprite.src = blockSprite;
    this.color = this.getRandomColor();
  }
  getRandomColor = () => {
    const cMax = 120;
    const cMin = 0;
    const k = 3;
    const colorList = {
      1: { name: "red", r: cMax, g: cMin, b: cMin },
      // 2: { r: cMax, g: cMax / 2, b: cMin },
      3: { name: "yellow", r: cMax, g: cMax, b: cMin },
      // 4: { r: cMax / 2, g: cMax, b: cMin },
      5: { name: "green", r: cMin, g: cMax, b: cMin },
      // 6: { name: "green", r: cMin, g: cMax, b: cMax / 2 },
      7: { name: "cadetblue", r: cMin, g: cMax, b: cMax },
      // 8: { r: cMin, g: cMax / 2, b: cMax },
      9: { name: "blue", r: cMin, g: cMin, b: cMax },
      // 10: { r: cMax / 2, g: cMin, b: cMax },
      11: { name: "purple", r: cMax, g: cMin, b: cMax },
      // 12: { r: cMax, g: cMin, b: cMax / 2 },
    };
    const difficult = {
      3: [1, 5, 9],
      4: [1, 5, 9, 11],
      5: [1, 3, 5, 9, 11],
      6: [1, 3, 5, 7, 9, 11],
    };
    const random = difficult[k][Math.floor(Math.random() * k)];
    return colorList[random];
  };
  render = () => {
    this.draw();
  };
  draw = () => {
    const { ctx, pos, width, height, sprite, color } = this;
    const { r, g, b } = color;
    ctx.save();
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.drawImage(sprite, pos.left, pos.top, width, height);
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillRect(pos.left, pos.top, width, height);
    ctx.globalCompositeOperation = "luminosity";
    ctx.drawImage(sprite, pos.left, pos.top, width, height);
    ctx.restore();
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
  die = () => {
    this.width = 0;
    this.isAlive = true;
  };
}
