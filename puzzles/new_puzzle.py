import json
import os


JS_PUZZLE_FILE = os.path.join(os.path.dirname(__file__), "preloaded.js")
JSON_PUZZLE_FILE = os.path.join(os.path.dirname(__file__), "preloaded.json")


class NewPuzzle:
    def __init__(self):
        self.__board = dict.fromkeys(range(9))
        for i in range(10):
            self.__board[i] = dict.fromkeys(range(9), 0)

    def get_value(self, i, j):
        return self.__board.get(i, {}).get(j, None)

    def set_value(self, i, j, val):
        if val == 0:
            # Removing mistaken value
            try:
                self.__board[i][j] = val;
            except keyError:
                pass
            return True
        if self.sanity_checker(i, j, val):
            self.__board[i][j] = val
            return True
        return False

    def sanity_checker(self, i, j, val):
        prev_val = self.get_value(i, j)
        if prev_val == None or not (1 <= val <= 9):
            return False

        failed = False
        self.__board[i][j] = val
        # Check row
        row_elems = [self.__board[i][x] for x in range(9) if self.__board[i][x] != 0]
        if len(set(row_elems)) != len(row_elems):
            failed = True
        # Check column
        if not failed:
            column_elems = [self.__board[x][j] for x in range(9) if self.__board[x][j] != 0]
            if len(set(column_elems)) != len(column_elems):
                failed = True
        # Check box
        if not failed:
            box_elems = []
            box_criteria = ((i // 3) * 3) + (j // 3)
            for x in range(9):
                for y in range(9):
                    if self.__board[x][y] != 0 and ((x // 3) * 3) + (y // 3) == box_criteria:
                        box_elems.append(self.__board[x][y])
            if (len(set(box_elems))) != len(box_elems):
                failed = True
        self.__board[i][j] = prev_val
        return not failed

    def __str__(self):
        lines = []
        lines.append("  " + "".join(f"{i:2d}" for i in range(3)) + " " + "".join(f"{i:2d}" for i in range(3,6)) + " " + "".join(f"{i:2d}" for i in range(6, 9)))
        for i in range(9):
            line = ""
            if i % 3 == 0:
                line += "\n"
            for j in range(9):
                if j == 0:
                    line += f"{i}"
                if j % 3 == 0:
                    line += " "
                line += f"{self.__board[i][j]:2d}"
            lines.append(line)
        return '\n'.join(lines)

    def get_json_data(self):
        data = []
        for i in range(9):
            for j in range(9):
                if self.__board[i][j] != 0:
                    data.append((i, j, self.__board[i][j]))
        return data


if __name__ == "__main__":
    obj = NewPuzzle()

    print("Ctrl+c to quit entering data")
    while True:
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

    choice = "n"
    while True:
        choice = input("\nWould you like to save new puzzle data? (y/n) : ").strip()
        if choice in ["y", "n"]:
            break

    if choice == "y":
        all_data = []
        if os.path.exists(JSON_PUZZLE_FILE):
            with open(JSON_PUZZLE_FILE, "r") as fr:
                try:
                    all_data = json.load(fr)
                except json.decoder.JSONDecodeError:
                    print("\nPrevious data seems to be corrupted, overwriting!")

        all_data.append(obj.get_json_data())

        with open(JSON_PUZZLE_FILE, "w") as fw:
            json.dump(all_data, fw)

        with open(JS_PUZZLE_FILE, "w") as fw:
            fw.write(f"var sudokus={all_data};")
