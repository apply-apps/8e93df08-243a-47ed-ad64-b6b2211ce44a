// Filename: index.js
// Combined code from all files
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const CELL_SIZE = 20;
const GRID_SIZE = 15;
const { width, height } = Dimensions.get('window');
const BOARD_WIDTH = GRID_SIZE * CELL_SIZE;

const directions = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
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

  const handleGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) setDirection(directions.RIGHT);
      else setDirection(directions.LEFT);
    } else {
      if (translationY > 0) setDirection(directions.DOWN);
      else setDirection(directions.UP);
    }
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <PanGestureHandler onGestureEvent={handleGestureEvent}>
          <View style={styles.board}>
            {snake.map((segment, index) => (
              <View
                key={index}
                style={[
                  styles.cell,
                  { top: segment.y * CELL_SIZE, left: segment.x * CELL_SIZE }
                ]}
              />
            ))}
            <View
              style={[
                styles.food,
                { top: food.y * CELL_SIZE, left: food.x * CELL_SIZE }
              ]}
            />
          </View>
        </PanGestureHandler>
        {isGameOver && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity onPress={restartGame} style={styles.button}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_WIDTH,
    backgroundColor: '#c2c2c2',
    position: 'relative'
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#000',
    position: 'absolute'
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'red',
    position: 'absolute'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  gameOverText: {
    fontSize: 30,
    color: 'white',
    marginBottom: 20
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5
  },
  buttonText: {
    color: 'white'
  }
});