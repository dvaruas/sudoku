class ValidatorSet {
  constructor() { this.setObjects = []; }
  get objects() { return this.setObjects; }
  addToSet(obj) { this.setObjects.push(obj); }
  validate() {
    let temp = Array(10).fill(null);
    for (const obj of this.setObjects) {
      if (obj.value != null && obj.value != 0) {
        if (temp[obj.value] != undefined || temp[obj.value] == 1) { return false; }
        else { temp[obj.value] = 1; }
      }
    }
    return true;
  }
}

class SudokuCell {
  constructor(x, y, value) {
    this.i = x;
    this.j = y;
    this.val = value;
    this.possibilies = 511; // 2 ** 9 - 1
  }

  get x() { return this.i; }
  get y() { return this.j; }

  get value () { return this.val; }
  set value (val) {
    this.val = val;
    if (val != null) {
      // A hard number has been set to this cell, remove all possibilies
      this.possibilies = 0;
    }
  }

  get choice_list() {
    let theList = [];
    for (let indx = 0; indx < 9; indx++) {
      if ((this.possibilies & (1 << indx)) != 0) {
        theList.push(indx + 1);
      }
    }
    return theList;
  }
  set choice_bit(val) {
    if (this.val != null) return;
    this.possibilies |= (1 << (val - 1));
  }
  set remove_choice_bit(val) {
    if (this.val != null) return;
    this.possibilies &= (511 ^ (1 << (val - 1)));
  }

  reset() {
    this.val = null;
    this.possibilies = 511;
  }

  getHTML() {
    return `<td class="sudoku-cell" id="s-${this.i}-${this.j}">${(this.val != null) ? this.val : " "}</td>`;
  }
}

class SudokuBoard {
  constructor() {
    this.rowValidators = [];
    this.columnValidators = [];
    this.blockValidators = [];
    this.board = [];
    this.initialize();
  }

  initialize() {
    let i = 1;
    while (i <= 9) {
      this.rowValidators.push(new ValidatorSet());
      this.columnValidators.push(new ValidatorSet());
      this.blockValidators.push(new ValidatorSet());
      i++;
    }
    i = 0;
    while (i < 9) {
      let j = 0;
      let tempArr = [];
      while (j < 9) {
        const newCell = new SudokuCell(i, j, null);
        tempArr.push(newCell);
        this.rowValidators[i].addToSet(newCell);
        this.columnValidators[j].addToSet(newCell);
        this.blockValidators[(Math.floor(i/3)*3) + Math.floor(j/3)].addToSet(newCell);
        j++;
      }
      this.board.push(tempArr);
      i++;
    }
  }

  reset() {
    let i = 0;
    while (i < 9) {
      let j = 0;
      while (j < 9) {
        this.board[i][j].reset();
        j++;
      }
      i++;
    }
  }

  validateBoard() {
    let i = 0;
    while (i < 9) {
      if (this.rowValidators[i].validate() == false ||
      this.columnValidators[i].validate() == false ||
      this.blockValidators[i].validate() == false) {
        return false;
      }
      i++;
    }
    return true;
  }

  validateCell(i, j) {
    return (this.rowValidators[i].validate() &&
            this.columnValidators[j].validate() &&
            this.blockValidators[(Math.floor(i/3)*3) + Math.floor(j/3)].validate());
  }

  setValueToCell(i, j, val) {
    const prev_value = this.board[i][j].value;
    const prev_possibilities_set = this.board[i][j].choice_list;
    this.board[i][j].value = val;
    if (this.validateCell(i, j) == false) {
      this.board[i][j].value = prev_value;
      prev_possibilities_set.forEach(item => {
        this.board[i][j].choice_bit = item;
      });
      return false;
    }

    // Once the value has been successfully set, remove the value from other possible cells
    this.rowValidators[i].objects.forEach(obj => {
      obj.remove_choice_bit = val;
    });
    this.columnValidators[j].objects.forEach(obj => {
      obj.remove_choice_bit = val;
    });
    this.blockValidators[(Math.floor(i/3)*3) + Math.floor(j/3)].objects.forEach(obj => {
      obj.remove_choice_bit = val;
    });

    return true;
  }

  getPossibleOptions(i, j) {
    return this.board[i][j].choice_list;
  }

  isSolved(i, j) {
    if (this.board[i][j].value != null) { return true; }
    return false;
  }

  basicSolver(i, j) {
    console.log("Using Basic solver");

    let solution = this.board[i][j].value;
    if (solution == null) {
      if ( !(this.board[i][j].possibilies & (this.board[i][j].possibilies - 1)) ) {
        solution = Math.log2(this.board[i][j].possibilies) + 1;
      }
    }
    return solution;
  }

  advancedSolver() {
    // This makes use of the Crook's algorithm
    console.log("Using advanced solver : Crook's algorithm without Random guessing");

    for (let k = 0; k < 9; k++) {
      let matchOpportunities = [
        this.rowValidators[k].objects,
        this.columnValidators[k].objects,
        this.blockValidators[(Math.floor(k/3)*3) + Math.floor(k/3)].objects
      ];
      for (let opportunity of matchOpportunities) {
        let possible_sets = opportunity.filter(obj => obj.possibilies > 0);
        for (let i = 0; i < possible_sets.length; i++) {
          let preemtive_set = [];
          let others = [];
          for (let j = 0; j < possible_sets.length; j++) {
            if ((possible_sets[i].possibilies | possible_sets[j].possibilies) == possible_sets[i].possibilies) {
              preemtive_set.push(possible_sets[j]);
            } else {
              others.push(possible_sets[j]);
            }
          }
          if (preemtive_set.length == possible_sets[i].choice_list.length) {
            // This is a proper preemtive set.
            for (let obj of others) {
              let testBitStream = obj.possibilies & (obj.possibilies ^ possible_sets[i].possibilies);
              if ( testBitStream > 0 && !(testBitStream & (testBitStream - 1)) ) {
                return {x : obj.x, y : obj.y, value : Math.log2(testBitStream) + 1};
              }
            }
          }
        }
      }
    }

    return null;
  }

  getHTML() {
    let htmlStr = "";
    let i = 0;
    while (i < 9) {
      htmlStr += "<tr class='sudoku-row'>"
      let j = 0;
      while (j < 9) {
        htmlStr += this.board[i][j].getHTML();
        j++;
      }
      htmlStr += "</tr>";
      i++;
    }
    return htmlStr;
  }
}
