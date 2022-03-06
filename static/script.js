$(document).ready(function () {
  function setSudokuTableAttrs() {
    let tableSize = Math.floor(Math.min(window.innerHeight, window.innerWidth) * 0.8);
    tableSize = Math.floor(Math.min(window.innerHeight, window.innerWidth) * 0.8);
    let marginFromTop = (window.innerHeight - tableSize) / 2;
    let marginFromLeft = (window.innerWidth - tableSize) / 2;

    let marginFromLeftForButton = marginFromLeft - (tableSize / 20) - 5;
    let marginFromLeftForRightButton = marginFromLeft + tableSize + 5;
    let spaceBetweenButtons = (tableSize / 20) + 20;

    $('#sudoku-board')
      .attr({
        'width': tableSize,
        'height': tableSize,
      })
      .css({
        'margin-top': marginFromTop,
        'margin-left': marginFromLeft,
      });

    $(".sudoku-cell")
      .css({
        'width': tableSize / 13,
        'height': tableSize / 13,
        'font-size': tableSize / 40,
      });

    $(".button-icons")
      .attr({
        'width': tableSize / 20,
        'height': tableSize / 20,
      });

    $("#github-btn")
      .css({
        'top': marginFromTop,
        'left': marginFromLeftForButton,
      });

    $("#load-random")
      .css({
        'top': marginFromTop + spaceBetweenButtons,
        'left': marginFromLeftForButton,
      });

    $("#edit-mode")
      .css({
        'top': marginFromTop + (spaceBetweenButtons * 2),
        'left': marginFromLeftForButton,
      });

    $("#reset")
      .css({
        'top': marginFromTop + (spaceBetweenButtons * 3),
        'left': marginFromLeftForButton,
      });

    $("#helper-mode")
      .css({
        'top': marginFromTop,
        'left': marginFromLeftForRightButton,
      });

    $("#solve-next")
      .css({
        'top': marginFromTop + spaceBetweenButtons,
        'left': marginFromLeftForRightButton,
      });
  }

  // set all attributes on the initial table
  setSudokuTableAttrs();

  // on resize of the window
  $(window).resize(() => {
    // set all attributes for table on resized window
    setSudokuTableAttrs();
  });

  // switch off helper mode initially
  $("#helper-mode-on").addClass("d-none");

  var board = new SudokuBoard();
  var intVal = null;
  var blinkCounter = 0;
  var currBlinkSelector = null;

  function colorBlink(elemSelector, success) {
    if (intVal) {
      clearInterval(intVal);
      intVal = null;
      blinkCounter = 0;
      if (currBlinkSelector != null) {
        $(currBlinkSelector).removeClass('sudoku-success sudoku-fail');
        currBlinkSelector = null;
      }
    }
    intVal = setInterval(function () {
      if (blinkCounter == 6) {
        clearInterval(intVal);
        intVal = null;
        blinkCounter = 0;
        currBlinkSelector = null;
      } else {
        currBlinkSelector = elemSelector;
        $(elemSelector).removeClass("sudoku-help");
        if (blinkCounter % 2 == 0) {
          if (success == true) { $(elemSelector).addClass("sudoku-success"); }
          else { $(elemSelector).addClass("sudoku-fail"); }
        } else {
          if (success == true) { $(elemSelector).removeClass("sudoku-success"); }
          else { $(elemSelector).removeClass("sudoku-fail"); }
        }
        blinkCounter++;
      }
    }, 200);
  }

  function updateHelperText() {
    if (!$("#helper-mode").hasClass("enabled")) { return; }

    $(".sudoku-cell").each(function () {
      let matchCellID = /s-([0-9])-([0-9])/g.exec($(this).attr("id"));
      let cellIndex = { i: parseInt(matchCellID[1]), j: parseInt(matchCellID[2]) };
      let opts = board.getPossibleOptions(cellIndex.i, cellIndex.j);
      if (opts.length > 0) {
        $(this).addClass("sudoku-help");
        $(this).html(opts.join(" , "));
      } else {
        $(this).removeClass("sudoku-help");
      }
    });
  }

  // Initial display of sudoku board
  $("#sudoku-board").html(function () {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let i = 0;
    while (i < 9) {
      let j = 0;
      while (j < 9) {
        let indx = (j + (3 * (i % 3)) + Math.floor(i / 3)) % 9;
        board.setValueToCell(i, j, nums[indx]);
        j++;
      }
      i++;
    }
    return board.getHTML();
  });

  function mode_change(mode_name, mode_status) {
    if (mode_name == "edit") {
      if (mode_status == "on") {
        $("#edit-mode").addClass("enabled");
        $('.sudoku-cell').addClass("sudoku-editable");
      } else if (mode_status == "off") {
        $("#edit-mode").removeClass("enabled");
        $('.sudoku-cell').removeClass("sudoku-editable sudoku-editcell");
      }
    } else if (mode_name == "helper") {
      if (mode_status == "on") {
        $("#helper-mode").addClass("enabled");
      } else if (mode_status == "off") {
        $(".sudoku-cell").removeClass("sudoku-help");
        $("#helper-mode").removeClass("enabled");
      }
    }
  }

  $("#edit-mode").click(function () {
    $("#edit-grid").addClass("d-none");
    $("#sudoku-board").html(board.getHTML());

    if ($(this).hasClass("enabled")) {
      mode_change("edit", "off");
    } else {
      mode_change("helper", "off");
      mode_change("edit", "on");

      $(".sudoku-cell").click(function (e) {
        $(".sudoku-cell").removeClass("sudoku-editcell");
        $(this).addClass("sudoku-editcell");

        let elementPos = $(this).offset();
        let matchCellID = /s-([0-9])-([0-9])/g.exec($(this).attr("id"));
        let cellIndex = { i: parseInt(matchCellID[1]), j: parseInt(matchCellID[2]) };

        // Make changes to the edit pane
        $("#edit-grid").css({ top: (elementPos.top + 40) + "px", left: (elementPos.left + 40) + "px" });
        $("#edit-grid").removeClass("d-none");
        let prevVal = $(this).html()
        $("#edit-grid-val").val(prevVal);
        $("#edit-grid-icon").off().click(function () {
          $("#edit-grid").addClass("d-none");
          $(`#s-${cellIndex.i}-${cellIndex.j}`).removeClass("sudoku-editcell");
          let enteredVal = $("#edit-grid-val").val().trim();
          if (prevVal === enteredVal) {
            // Nothing has changed, so nothing to do here
            return;
          }
          let accepted = true;
          if (enteredVal === "") {
            // This is not a valid number, ignore!
            accepted = false;
          } else if (!isNaN(parseFloat(enteredVal)) && isFinite(enteredVal) && Number.isInteger(parseInt(enteredVal))) {
            enteredValInt = parseInt(enteredVal);
            if (board.setValueToCell(cellIndex.i, cellIndex.j, enteredValInt)) {
              $(`#s-${cellIndex.i}-${cellIndex.j}`).html(enteredVal);
            } else {
              accepted = false;
            }
          } else {
            accepted = false;
          }
          if (accepted == true) {
            // An indication of success
            colorBlink(`#s-${cellIndex.i}-${cellIndex.j}`, true);
          } else {
            // An indication of failure
            colorBlink(`#s-${cellIndex.i}-${cellIndex.j}`, false);
          }
        });
      });
    }
  });

  $("#helper-mode").click(function () {
    $("#sudoku-board").html(board.getHTML());
    $("#edit-grid").addClass("d-none");

    if ($(this).hasClass("enabled")) {
      // disable helper mode
      $("#helper-mode-on").addClass("d-none");
      $("#helper-mode-off").removeClass("d-none");
      mode_change("helper", "off");
    } else {
      // enable helper mode
      $("#helper-mode-off").addClass("d-none");
      $("#helper-mode-on").removeClass("d-none");
      mode_change("edit", "off");
      mode_change("helper", "on");
      updateHelperText();

      // set an appropriate size for the helper text
    }
  });

  $("#solve-next").click(function () {
    if ($(this).prop("disabled")) { return; }

    $("#edit-grid").addClass("d-none");
    mode_change("edit", "off");

    let solution = board.basicSolver();
    if (solution == null) {
      // Pulling out the big gun..!!
      solution = board.advancedSolver();
      if (solution == null) {
        // Might have a chance with basic solver now!
        solution = board.basicSolver();
      }
    }

    if (solution != null && solution != true) {
      board.setValueToCell(solution.x, solution.y, solution.value);
      $(`#s-${solution.x}-${solution.y}`).html(`${solution.value}`);
      colorBlink(`#s-${solution.x}-${solution.y}`, true);
    }

    updateHelperText();

    // Next option would be to make random guesses, which is something we do not do!
  });

  $("#load-random").click(function () {
    board.reset();
    $("#solve-next").prop("disabled", false);
    mode_change("edit", "off");
    mode_change("helper", "off");
    $("#edit-grid").addClass("d-none");
    let indx = Math.floor(Math.random() * sudokus.length);
    for (let [row_num, entry] of sudokus[indx].entries()) {
      let temp_bins = Number(entry).toString().padStart(9, "0").match(/.{1,1}/g);
      for (let col_num = 0; col_num < 9; col_num++) {
        board.setValueToCell(row_num, col_num, temp_bins[col_num]);
      }
    }
    $("#sudoku-board").html(board.getHTML());
    setSudokuTableAttrs();
  });

  $("#reset").click(function () {
    board.reset();
    $("#solve-next").prop("disabled", true);
    $("#sudoku-board").html(board.getHTML());
    mode_change("edit", "off");
    mode_change("helper", "off");
    $("#edit-grid").addClass("d-none");
  });
});
