# Sudoku

Play the game online in [here](https://dvaruas.github.io/sudoku/) :point_left:

## Features

* Pre-loaded puzzles (a few).
* Helper mode to get hints for the cells.
* Auto-solver capable of solving medium-complexity cells.
  * Auto-solver powered by **Crook's algorithm** to solve hard puzzles. See
    details of algorithm
    [here](https://www.ams.org/notices/200904/tx090400460p.pdf).
  * **Caveat :** Crook's algorithm has a provision for random guessing which is
    not done by us. Guessing would need the solver to solve the board completely
    to make sure it's guess is correct.

## Code Structure

* For just the core functionality librray of sudoku, check out [core](src/core/).
* Functionality supporting HTML components in page are in [html](src/html/).
  They are built on top of [core](src/core/).
* The preloaded puzzles can be found in [data](src/data/).

Built with **TypeScript**, :wrench:  
bundled with **Webpack**, :space_invader:  
and,  
hosted with **Github**.. :octocat:
