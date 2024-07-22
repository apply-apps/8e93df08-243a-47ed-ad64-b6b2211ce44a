// Filename: index.js
// Combined code from all files

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const CELL_SIZE = 20;
const GRID_SIZE = 15;
const { width, height } = Dimensions.get('window');
const BOARD_WIDTH = GRID_SIZE * CELL_SIZE;
const BOARD_HEIGHT = GRID_SIZE * CELL_SIZE;
const directions = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
};

export default function App() {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState(directions.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') setDirection(directions.UP);
      if (e.key === 'ArrowDown') setDirection(directions.DOWN);
      if (e.key === 'ArrowLeft') setDirection(directions.LEFT);
      if (e.key === 'ArrowRight') setDirection(directions.RIGHT);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction, isGameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      setIsGameOver(true);
      return;
    }

    if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomPosition());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const restartGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setFood(getRandomPosition());
    setDirection(directions.RIGHT);
    setIsGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.board}>
        {snake.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              { top: segment.y * CELL_SIZE, left: segment.x * CELL_SIZE },
            ]}
          />
        ))}
        <View
          style={[
            styles.food,
            { top: food.y * CELL_SIZE, left: food.x * CELL_SIZE },
          ]}
        />
      </View>
      {isGameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <TouchableOpacity onPress={restartGame} style={styles.button}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '20px',
    backgroundColor: '#2a2a2a',
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: '#c2c2c2',
    position: 'relative',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#000',
    position: 'absolute',
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'red',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gameOverText: {
    fontSize: 30,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});