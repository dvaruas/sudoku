import os
import re

from typing import Optional, TypeVar


JS_PUZZLE_FILE = os.path.join(os.path.dirname(__file__), "preloaded.js")


T = TypeVar('T', bound="PuzzleInstance")
class PuzzleInstance:
    def __init__(self):
        self.board = dict.fromkeys(range(9))
        for i in range(9):
            self.board[i] = dict.fromkeys(range(9), 0)

    @classmethod
    def create_from_string(cls: T, string_list: str) -> T:
        neu_obj = cls()
        all_num_strs = [s.strip() for s in string_list.split(",")]
        for i, num_string in enumerate(all_num_strs):
            num_string = num_string.rjust(9, '0')
            for j in range(9):
                neu_obj.set_value(i, j, int(num_string[j]))
        return neu_obj

    def get_value(self, i: int, j: int) -> Optional[int]:
        return self.board.get(i, {}).get(j, None)

    def set_value(self, i: int, j: int, val: int) -> bool:
        if val == 0:
            # Removing mistaken value
            try:
                self.board[i][j] = val;
            except keyError:
                pass
            return True
        if self.sanity_checker(i, j, val):
            self.board[i][j] = val
            return True
        return False

    def sanity_checker(self, i: int, j: int, val: int) -> bool:
        prev_val = self.get_value(i, j)
        if prev_val == None or not (1 <= val <= 9):
            return False

        failed = False
        self.board[i][j] = val
        # Check row
        row_elems = [self.board[i][x] for x in range(9) if self.board[i][x] != 0]
        if len(set(row_elems)) != len(row_elems):
            failed = True
        # Check column
        if not failed:
            column_elems = [self.board[x][j] for x in range(9) if self.board[x][j] != 0]
            if len(set(column_elems)) != len(column_elems):
                failed = True
        # Check box
        if not failed:
            box_elems = []
            box_criteria = ((i // 3) * 3) + (j // 3)
            for x in range(9):
                for y in range(9):
                    if self.board[x][y] != 0 and ((x // 3) * 3) + (y // 3) == box_criteria:
                        box_elems.append(self.board[x][y])
            if (len(set(box_elems))) != len(box_elems):
                failed = True
        self.board[i][j] = prev_val
        return not failed

    def __str__(self) -> str:
        lines = []
        lines.append("  " + "".join(f"{i:2d}" for i in range(3)) + " " + \
                     "".join(f"{i:2d}" for i in range(3,6)) + " " + \
                     "".join(f"{i:2d}" for i in range(6, 9)))
        for i in range(9):
            line = ""
            if i % 3 == 0:
                line += "\n"
            for j in range(9):
                if j == 0:
                    line += f"{i}"
                if j % 3 == 0:
                    line += " "
                line += f"{self.board[i][j]:2d}" if self.board[i][j] > 0 else " -"
            lines.append(line)
        return '\n'.join(lines)

    def __eq__(self, other: T) -> bool:
        for i in range(9):
            for j in range(9):
                if self.get_value(i, j) != other.get_value(i, j):
                    return False
        return True

    def get_writable_data(self) -> str:
        data = []
        for i in range(9):
            data_item = 0
            for j in range(9):
                data_item = (data_item * 10) + self.board[i][j]
            data.append(data_item)
        return str(data)


class PuzzleSet:
    def __init__(self):
        self.puzzles = []

    def add_new_puzzle(self, obj: PuzzleInstance) -> bool:
        if self.is_not_unique(obj) == False:
            self.puzzles.append(obj)
            return True
        return False

    def is_not_unique(self, obj: PuzzleInstance) -> bool:
        return any([other_obj == obj for other_obj in self.puzzles])

    def get_writable_data(self) -> str:
        return "[{}]".format(",".join([obj.get_writable_data() for obj in self.puzzles]))


if __name__ == "__main__":
    continue_script = True

    obj = PuzzleInstance()
    print("Ctrl+c to quit entering data")
    while continue_script:
        print(obj)
        try:
            i = int(input("\nEnter row number : "))
            j = int(input("Enter column number : "))
            val = int(input("Enter Value : "))
            if obj.set_value(i, j, val) == False:
                print("\nWas unable to set the value")
        except ValueError:
            pass
        except KeyboardInterrupt:
            break
        except EOFError:
            # We wish to opt out of the script
            continue_script = False

    choice = "n"
    while continue_script:
        choice = input("\nWould you like to save new puzzle data? (y/n) : ").strip()
        if choice in ["y", "n"]:
            break

    if choice == "y":
        pset_obj = PuzzleSet()

        # Parse and get all previous puzzle data
        if os.path.exists(JS_PUZZLE_FILE):
            previous_data = ""
            with open(JS_PUZZLE_FILE, "r") as fr:
                previous_data = fr.read()
            data_lists = re.findall(r"\[([\d ,]*)\]", previous_data)
            for item_string in data_lists:
                n_obj = PuzzleInstance.create_from_string(item_string)
                pset_obj.add_new_puzzle(n_obj)

        # Adding the newly created puzzle to previous list
        if pset_obj.add_new_puzzle(obj) == False:
            print("Did not add entered puzzle to the set, since it already exists!")
        else:
            with open(JS_PUZZLE_FILE, "w") as fw:
                fw.write(f"var sudokus={pset_obj.get_writable_data()};")
