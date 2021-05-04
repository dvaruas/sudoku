class ValidatorSet {
  constructor() { this.setObjects = []; }
  get objects() { return this.setObjects; }
  addToSet(obj) { this.setObjects.push(obj); }
  validate() {
    let temp = Array(10).fill(null);
    temp[0] = undefined;
    for (const obj of this.setObjects) {
      if (obj.value != null) {
        if (temp[obj.value] === undefined || temp[obj.value] == 1) { return false; }
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
    this.possibilies &= ~(1 << (val - 1));
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

  basicSolver() {
    console.log("Using Basic solver");

    let solvedCount = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j].value == null) {
          if ( !(this.board[i][j].possibilies & (this.board[i][j].possibilies - 1)) ) {
            return {'x' : i, 'y' : j, 'value' : Math.log2(this.board[i][j].possibilies) + 1};
          }
        } else {
          solvedCount += 1;
        }
      }
    }

    if (solvedCount == 81) {
      // The board is completely solved
      return true;
    }

    return null;
  }

  advancedSolver() {
    // This makes use of the Crook's algorithm
    console.log("Using advanced solver : Crook's algorithm without Random guessing");

    // Finding solution through forced numbers
    for (let k = 0; k < 9; k++) {
      let matchOpportunities = [
        this.rowValidators[k].objects,
        this.columnValidators[k].objects,
        this.blockValidators[k].objects
      ];
      for (let opportunity of matchOpportunities) {
        let possible_sets = opportunity.filter(obj => obj.possibilies > 0);

        for (let i = 0; i < possible_sets.length; i++) {
          let testBitStream = possible_sets[i].possibilies;
          for (let j = 0; j < possible_sets.length; j++) {
            if ( i != j ) {
              testBitStream &= ~possible_sets[j].possibilies;
              if (testBitStream == 0) { break; }
            }
          }
          if ( testBitStream > 0 && !(testBitStream & (testBitStream - 1)) ) {
            return {x : possible_sets[i].x, y : possible_sets[i].y, value : Math.log2(testBitStream) + 1};
          }
        }
      }
    }

    // Finding solution through pre-emptive sets
    let finalSets = [];
    for (let k = 2; k < 9; k++) {
      let matchOpportunities = {
        "row" : this.rowValidators[k].objects,
        "column" : this.columnValidators[k].objects,
        "block" : this.blockValidators[k].objects
      };

      for (let oType in matchOpportunities) {
        let possible_sets = matchOpportunities[oType].filter(obj => obj.possibilies > 0);
        let elemsList = [];
        possible_sets.forEach((obj, indx) => elemsList.push({ 'obj' : [obj], 'mask' : (1 << indx) }));

        let comboSet = {1 : elemsList};
        for (let i = 2; i < possible_sets.length; i++) {
          comboSet[i] = [];
          for (let entry of comboSet[i-1]) {
            for (let singleObj of comboSet[1]) {
              if ((entry.mask | singleObj.mask) != entry.mask) {
                let newObj = [...entry.obj];
                newObj.push(singleObj.obj[0]);
                comboSet[i].push({ 'obj' : newObj, 'mask' : (entry.mask | singleObj.mask)} );
              }
            }
          }
        }

        for (let i = 2; i < possible_sets.length; i++) {
          let checkElements = comboSet[i].filter(cElem => {
            let objMask = cElem.obj.reduce((res, obj) => res |= obj.possibilies, 0);
            return cElem.obj.length == (Number(objMask).toString(2).match(/1/g) || []).length;
          });
          checkElements.forEach(elem => finalSets.push({"objs" : elem.obj, "type" : oType}));
        }
      }
    }

    for (let objList of finalSets) {
      let otherObjects = [];
      let objX = objList.objs[0].x;
      let objY = objList.objs[0].y;

      if (objList.type == "row") {
        otherObjects = this.rowValidators[objX].objects.filter(obj => !objList.objs.includes(obj));
      } else if (objList.type == "column") {
        otherObjects = this.columnValidators[objY].objects.filter(obj => !objList.objs.includes(obj));
      } else if (objList.type == "block") {
        otherObjects = this.blockValidators[(Math.floor(objX/3)*3) + Math.floor(objY/3)].objects.filter(obj => !objList.objs.includes(obj));
      }

      let cumulativeBit = objList.objs.reduce((res, obj) => res |= obj.possibilies, 0);
      let theList = [];
      for (let indx = 0; indx < 9; indx++) {
        if ((cumulativeBit & (1 << indx)) != 0) {
          theList.push(indx + 1);
        }
      }

      otherObjects.forEach(obj => {
        theList.forEach(listItem => {
          obj.remove_choice_bit = listItem;
        });
      });

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
