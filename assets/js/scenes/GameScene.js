const CELL_EMPTY = 0;
const CELL_X = 1;
const CELL_O = 2;
const CELL_SIZE = 150;

const FILENAME_X = 'images/x.png';
const FILENAME_O = 'images/o.png';

class GameScene extends Scene {
  cells = [
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  ];

  winStates = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  state = CELL_X;

  isActiveGame = true;

  constructor({ DrawingContext, ResourceManager }) {
    super();

    this.drawingContext = DrawingContext;
    this.resourceManager = ResourceManager;
  }

  async loading() {
    await this.resourceManager.loadImages([
      FILENAME_X,
      FILENAME_O
    ]);
  }

  draw() {
    const CELL_PADDING = 30;

    this.drawingContext.lines([
      { x1: CELL_SIZE, y1: 0, x2: CELL_SIZE, y2: CELL_SIZE * 3 },
      { x1: CELL_SIZE * 2, y1: 0, x2: CELL_SIZE * 2, y2: CELL_SIZE * 3 },
      { x1: 0, y1: CELL_SIZE, x2: CELL_SIZE * 3, y2: CELL_SIZE },
      { x1: 0, y1: CELL_SIZE * 2, x2: CELL_SIZE * 3, y2: CELL_SIZE * 2 }
    ]);

    for (const rowIndex in this.cells) {
      const row = this.cells[rowIndex];
      for (const cellIndex in row) {
        const cell = row[cellIndex];
        if (cell === CELL_EMPTY) {
          continue;
        }
        if (cell === CELL_X) {
          this.drawingContext.drawImage(
            this.resourceManager.get(FILENAME_X),
            cellIndex * CELL_SIZE + CELL_PADDING,
            rowIndex * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - CELL_PADDING * 2,
            CELL_SIZE - CELL_PADDING * 2
          );
        } else {
          this.drawingContext.drawImage(
            this.resourceManager.get(FILENAME_O),
            cellIndex * CELL_SIZE + CELL_PADDING,
            rowIndex * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - CELL_PADDING * 2,
            CELL_SIZE - CELL_PADDING * 2
          );
        }
      }
    }
  }

  click({ x, y }) {
    const cellIndex = Math.ceil(x / CELL_SIZE);
    const rowIndex = Math.ceil(y / CELL_SIZE);
    if (!this.isActiveGame) {
      return;
    }
    if (cellIndex > 3 || rowIndex > 3) {
      return;
    }
    const cellState = this.cells[rowIndex - 1][cellIndex - 1];
    if (cellState !== CELL_EMPTY) {
      return;
    }
    this.cells[rowIndex - 1][cellIndex - 1] = this.state;
    this.state = (this.state === CELL_X) ? CELL_O : CELL_X;

    this.checkWinState();
  }

  checkWinState() {
    const arr = this.cells.reduce((arr, item) => arr.concat(item), []);

    for (const [c1, c2, c3] of this.winStates) {
      if (arr[c1] === arr[c2] && arr[c2] === arr[c3] && arr[c1] === arr[c3] && arr[c1] !== CELL_EMPTY) {
        this.isActiveGame = false;
        return;
      }
    }
    if (!arr.includes(CELL_EMPTY)) {
      this.isActiveGame = false;
    }
  }
}
