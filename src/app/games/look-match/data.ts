// src/app/games/look-match/data.ts

// Định nghĩa kiểu dữ liệu cho một cặp
export type Pair = {
  id: number;
  emoji: string;
  word: string;
};

// Định nghĩa kiểu cho các màn chơi
type LevelsData = {
  [key: number]: Pair[];
};

// Dữ liệu game, được sắp xếp theo level
export const levels: LevelsData = {
  // Level 1
  1: [
    { id: 1, emoji: "🍎", word: "Apple" },
    { id: 2, emoji: "🐱", word: "Cat" },
    { id: 3, emoji: "🧃", word: "Juice" },
    { id: 4, emoji: "🚗", word: "Car" },
    { id: 5, emoji: "📚", word: "Book" },
  ],
  // Level 2
  2: [
    { id: 6, emoji: "🐶", word: "Dog" },
    { id: 7, emoji: "🏠", word: "House" },
    { id: 8, emoji: "☀️", word: "Sun" },
    { id: 9, emoji: "🌙", word: "Moon" },
    { id: 10, emoji: "⭐️", word: "Star" },
  ],
  // Level 3
  3: [
    { id: 11, emoji: "🐘", word: "Elephant" },
    { id: 12, emoji: "🍌", word: "Banana" },
    { id: 13, emoji: "🚲", word: "Bike" },
    { id: 14, emoji: "⏰", word: "Clock" },
    { id: 15, emoji: "🔑", word: "Key" },
  ],
  4: [
    { id: 16, emoji: "🍇", word: "Grapes" },
    { id: 17, emoji: "🐸", word: "Frog" },
    { id: 18, emoji: "🎈", word: "Balloon" },
    { id: 19, emoji: "🌳", word: "Tree" },
    { id: 20, emoji: "💡", word: "Light" },
  ],
  5: [
    { id: 21, emoji: "🍓", word: "Strawberry" },
    { id: 22, emoji: "🐵", word: "Monkey" },
    { id: 23, emoji: "🎵", word: "Music" },
    { id: 24, emoji: "🌈", word: "Rainbow" },
    { id: 25, emoji: "📷", word: "Camera" },
  ],
};