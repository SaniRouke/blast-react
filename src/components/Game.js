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
      <div className="Grid__border-out">
        <div className="Grid__border-in"></div>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  );
};
class Grid {
  gameState;
  ctx;
  canvas;
  pos;
  rows = 10;
  columns = 10;
  sprite = {
    src: blockSprite,
    width: 40,
    height: null,
    gap: null,
  };
  blocksArray = [];
  constructor(gameState, ctx) {
    this.gameState = gameState;
    this.pos = gameState.grid.pos;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    // добавление лишней строки для анимации по лучше
    this.rows += 1;
    this.sprite.height = this.sprite.width * 1.15;
    this.sprite.gap = this.sprite.width * 0.1;
    this.resizeCanvas();
    this.fillblocksToGridArray();
    this.ctx.canvas.addEventListener("click", this.onClick);
  }

  runCanvasAnimation = () => {
    this.animation();
    this.render();
    requestAnimationFrame(this.runCanvasAnimation);
  };
  render = () => {
    this.clear();
    this.forEachBlockInGrid((block) => block.render());
  };
  clear = () => {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  animation = () => {
    this.forEachBlockInGrid((block) => {
      block.moveAnimation();
    });
  };
  fillblocksToGridArray = () => {
    const { rows, columns } = this;
    for (let i = 0; i < rows; i++) {
      this.blocksArray.push([]);
      for (let j = 0; j < columns; j++) {
        this.blocksArray[i].push(this.getNewBlock(i, j));
      }
    }
  };
  getNewBlock = (row, column) => {
    const { ctx, sprite } = this;
    return new Block(ctx, { row, column, ...sprite });
  };
  forEachBlockInGrid = (func) => {
    this.blocksArray.forEach((row) => {
      row.forEach((block) => {
        func(block);
      });
    });
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
    // лишняя проверка для улучшения анимации
    if (blocksArray[row - 1] && blocksArray[row - 1][column] && row - 1 !== 0) {
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
        if (block.isAlive) {
          block.die();
        }
        if (n.isAlive) {
          this.destroy(n);
        }
      }
    });
  };
  onClick = (e) => {
    const { grid } = this.gameState;
    this.forEachBlockInGrid((block) => {
      if (this.getNeighbors(block).length) {
      }
      const mousePosOnCanvas = {
        x: e.clientX - grid.pos.x,
        y: e.clientY - grid.pos.y,
      };
      if (block.isMouseOver(mousePosOnCanvas)) {
        this.destroy(block);
      }
    });
    setTimeout(() => {
      this.updateBlocks();
    }, 300);
    console.log("clicked");
  };
  updateBlocks = () => {
    for (let i = 0; i < this.columns; i++) {
      this.updateNthColumn(i);
    }
  };
  updateNthColumn = (colNum) => {
    const currentColumnArray = [];
    this.forEachBlockInGrid((block) => {
      if (block.pos.column === colNum) {
        if (!block.isAlive) {
          const newBlock = this.getNewBlock(0, colNum);
          currentColumnArray.unshift(newBlock);
        } else {
          currentColumnArray.push(block);
        }
      }
    });
    currentColumnArray.forEach((block, i) => {
      const oldRow = block.pos.row;
      block.pos.row = i;
      block.pos.outY = -(block.height - block.gap) * (i - oldRow);
      this.blocksArray[i][colNum] = block;
    });
  };
  resizeCanvas = () => {
    this.canvas.width =
      this.sprite.width * this.columns + this.sprite.gap * (this.columns + 1);
    // добавление лишней строки для анимации по лучше
    this.canvas.height =
      this.sprite.height * (this.rows - 1) +
      this.sprite.gap * (this.rows + 1 - 1);
  };
}

class Block {
  ctx;
  pos = {};
  sprite;
  width;
  height;
  gap;
  color = "rbg(0,0,0)";
  isAlive = true;
  isDeathAnimate = false;
  vY = 3;
  constructor(ctx, props) {
    this.ctx = ctx;
    this.setProps(props);
    this.updatePos();
  }
  setProps = (props) => {
    const { row, column, src, width, height, gap } = props;
    this.pos.row = row;
    this.pos.column = column;
    this.sprite = new Image();
    this.sprite.src = src;
    this.width = width;
    this.height = height;
    this.gap = gap;
    this.color = this.getRandomColor();
  };
  updatePos = () => {
    const { pos, width, height, gap } = this;
    pos.x = pos.column * (width + gap) + width / 2 + gap;
    pos.y = (pos.row - 1) * (height + gap) + height / 2 + gap;
    pos.left = pos.x - width / 2;
    pos.top = pos.y - height / 2;
    pos.right = pos.x + width / 2;
    pos.bottom = pos.y + height / 2;
  };
  render = () => {
    this.updatePos();
    this.draw();
    if (this.isDeathAnimate) {
      this.deathAnimation();
    }
  };
  draw = () => {
    const { ctx, pos, width, height, sprite, color } = this;
    const { r, g, b } = color;
    pos.top += pos.outY;
    ctx.save();
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.drawImage(sprite, pos.left, pos.top, width, height);
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillRect(pos.left, pos.top, width, height);
    ctx.globalCompositeOperation = "luminosity";
    ctx.drawImage(sprite, pos.left, pos.top, width, height);
    ctx.restore();
  };
  deathAnimation = () => {
    let k = 1.1;
    this.color.r /= k;
    this.color.g /= k;
    this.color.b /= k;
  };
  die = () => {
    this.isAlive = false;
    this.isDeathAnimate = true;
  };
  moveAnimation = () => {
    if (this.pos.outY < 0) {
      this.pos.outY += this.vY / 2;
      this.vY *= 1.08;
      this.pos.top += this.pos.outY;
    } else {
      this.pos.outY = 0;
      this.vY = 3;
    }
  };
  isMouseOver = (mousePos) => {
    return (
      mousePos.x > this.pos.left &&
      mousePos.x < this.pos.right &&
      mousePos.y > this.pos.top &&
      mousePos.y < this.pos.bottom
    );
  };
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
}
