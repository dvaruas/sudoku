$(document).ready(function() {
  var board = new SudokuBoard();
  var intVal = null;
  var blinkCounter = 0;

  function colorBlink(elemSelector, blinkColor) {
    if (intVal) {
      clearInterval(intVal);
      intVal = null;
      blinkCounter = 0;
      $(".sudoku-cell").removeAttr("style");
    }
    intVal = setInterval(function() {
      if (blinkCounter == 6) {
        $(elemSelector).removeAttr("style");
        clearInterval(intVal);
        intVal = null;
        blinkCounter = 0;
      } else {
        if (blinkCounter % 2 == 0) {
          $(elemSelector).css("background-color", blinkColor);
          $(elemSelector).css("color", "white");
          $(elemSelector).css("font-weight", "bold");
        } else {
          $(elemSelector).css("background-color", "");
          $(elemSelector).css("color", "");
          $(elemSelector).css("font-weight", "");
        }
        blinkCounter++;
      }
    }, 200);
  }

  // Initial display of sudoku board
  $("#sudoku-board").html(function() {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let i = 0;
    while (i < 9) {
      let j = 0;
      while (j < 9) {
        let indx = (j+(3*(i%3))+Math.floor(i/3))%9;
        board.setValueToCell(i, j, nums[indx]);
        j++;
      }
      i++;
    }
    return board.getHTML();
  });

  $("#edit-mode").click(function() {
    if ($(this).hasClass("enabled")) {
      // if already enabled, then disable it
      $(this).removeClass("enabled");
      $("#sudoku-board").html(board.getHTML());
      $("#edit-grid").addClass("d-none");
    } else {
      // enable the edit-mode
      $(this).addClass("enabled");
      $("#sudoku-board").html(board.getHTML());
      $("#helper-mode").removeClass("enabled");
      $(".sudoku-cell").addClass("cell-edit");
      $("#edit-grid").addClass("d-none");
      $(".sudoku-cell").click(function(e) {
        $(".sudoku-cell").removeAttr("style");
        $(this).css("background-color", "#2d949c");
        let elementPos = $(this).offset();
        let matchCellID = /s-([0-9])-([0-9])/g.exec($(this).attr("id"));
        let cellIndex = {i : parseInt(matchCellID[1]), j : parseInt(matchCellID[2])};
        $("#edit-grid").css({top : (elementPos.top + 40) + "px", left : (elementPos.left + 40)+ "px"});
        $("#edit-grid").removeClass("d-none");
        let prevVal = $(this).html()
        $("#edit-grid-val").val(prevVal);
        $("#edit-grid-icon").off().click(function() {
          $("#edit-grid").addClass("d-none");
          let enteredVal = $("#edit-grid-val").val().trim();
          if (prevVal === enteredVal) {
            // Nothing has changed, just return
            return;
          }
          let accepted = true;
          if (enteredVal === "") {
            // Do not accept this as a valid answer, once filled and accepted it's done!
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
            colorBlink(`#s-${cellIndex.i}-${cellIndex.j}`, "green");
          } else {
            colorBlink(`#s-${cellIndex.i}-${cellIndex.j}`, "red");
          }
        });
      });
    }
  });

  $("#helper-mode").click(function() {
    if ($(this).hasClass("enabled")) {
      // if already enabled, then disable it
      $(this).removeClass("enabled");
      $("#sudoku-board").html(board.getHTML());
    } else {
      // enable the helper mode
      $(this).addClass("enabled");
      $("#edit-mode").removeClass("enabled");
      $("#edit-grid").addClass("d-none");
      $("#sudoku-board").html(board.getHTML());
      $(".sudoku-cell").each(function() {
        let matchCellID = /s-([0-9])-([0-9])/g.exec($(this).attr("id"));
        let cellIndex = {i : parseInt(matchCellID[1]), j : parseInt(matchCellID[2])};
        let opts = board.getPossibleOptions(cellIndex.i, cellIndex.j);
        if (opts.length > 0) {
          $(this).html(opts.join(" , "));
          $(this).css("background-color", "#f7f7f7");
          $(this).css("font-size", "10px");
        }
      });
    }
  });

  $("#solve-next").click(function() {
    $("#edit-grid").addClass("d-none");

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board.isSolved(i, j)) { continue; }
        let solution = board.basicSolver(i, j);
        if (solution != null) {
          $(`#s-${i}-${j}`).html(`${solution}`);
          board.setValueToCell(i, j, solution);
          colorBlink(`#s-${i}-${j}`, "green");
          return;
        }
      }
    }

    // pulling out the big gun
    let solution = board.advancedSolver();
    if (solution != null) {
      $(`#s-${solution.x}-${solution.y}`).html(`${solution.value}`);
      board.setValueToCell(solution.x, solution.y, solution.value);
      colorBlink(`#s-${solution.x}-${solution.y}`, "green");
    }

    // Next option would be to guess the answer, which is not something we do!
  });

  $("#load-random").click(function() {
    board.reset();
    $("#helper-mode").removeClass("enabled");
    $("#edit-mode").removeClass("enabled");
    $("#edit-grid").addClass("d-none");
    let indx = Math.floor(Math.random() * sudokus.length);
    for (let entry of sudokus[indx]) {
      board.setValueToCell(entry[0], entry[1], entry[2]);
    };
    $("#sudoku-board").html(board.getHTML());
  });

  $("#reset").click(function() {
    board.reset();
    $("#sudoku-board").html(board.getHTML());
    $("#helper-mode").removeClass("enabled");
    $("#edit-mode").removeClass("enabled");
    $("#edit-grid").addClass("d-none");
  });
});
