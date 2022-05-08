export enum Value {
  NONE = -1,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
}

export const ValuesList = [
  Value.ONE,
  Value.TWO,
  Value.THREE,
  Value.FOUR,
  Value.FIVE,
  Value.SIX,
  Value.SEVEN,
  Value.EIGHT,
  Value.NINE,
];

export const StringToValue: (vStr: string) => Value = (vStr) => {
  switch (vStr) {
    case "1":
      return Value.ONE;
    case "2":
      return Value.TWO;
    case "3":
      return Value.THREE;
    case "4":
      return Value.FOUR;
    case "5":
      return Value.FIVE;
    case "6":
      return Value.SIX;
    case "7":
      return Value.SEVEN;
    case "8":
      return Value.EIGHT;
    case "9":
      return Value.NINE;
    default:
      return Value.NONE;
  }
};
