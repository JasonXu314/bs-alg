<p align="center">
  <img src="https://i.imgur.com/l85vjZI.png" alt="Battleship" />
</p>

# Stepsize Algorithms Exercise
This repository contains everything you need to complete the Stepsize algorithms exercise using Javascript.

There are 3 tasks to complete in this exercise, the goal is to build the core components to simulate a game of [Battleship](https://en.wikipedia.org/wiki/Battleship_(game))!

<p align="center">
  <img src="https://i.imgur.com/VeVWCuT.gif" alt="Simulation animation" />
</p>

## Table of Contents
- [Stepsize Algorithms Exercise](#stepsize-algorithms-exercise)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Task 1 - 2D Array Manipulation](#task-1---2d-array-manipulation)
  - [Task 2 - Lets Play!](#task-2---lets-play)
    - [Example Game](#example-game)
      - [Game Start](#game-start)
      - [Round 1](#round-1)
      - [Round 2](#round-2)
  - [Task 3 - Debrief](#task-3---debrief)
  - [Submission](#submission)

## Getting Started

To get started on this task you will need a copy of this repository. Either clone it using Git

```
git clone https://github.com/Stepsize/algorithms-exercise
```

**Or [download it as a `.zip` file](https://github.com/Stepsize/algorithms-exercise/archive/master.zip)**

Inside the repository there is a `bin` folder, this contains binaries for Linux, macOS, and Windows that are required to test your implementations and help you accomplish your mission!

You can test the binary by running it
```
./bin/battleship-[linux/macos/win]
```

You will get an output like this:

```
Stepsize algorithms take-home exercise

VERSION
  battleship/1.0.0 darwin-x64 node-v10.4.1

USAGE
  $ battleship [COMMAND]

COMMANDS
  benchmark  benchmark two strategies against each other
  help       display help for battleship
  play       play against the enemy
  testBoard  test a game board generation function
```

Included are also two boilerplate files for your functions to be written in. These are `task1.js` and `task2.js`.

Once you have a copy of the repository and have confirmed that the binary is working for you, you're ready to get started with your mission!

## Task 1 - 2D Array Manipulation

For this task, write a function that returns a 2-dimensional array (an array of arrays). This array represents the game board for Battleship.

This function should be able to be called multiple times and return different valid game boards.

If you are unfamiliar with the game, the conditions for a game board are as follows:

The game board is a 10 x 10 grid.

This could be represented in code like so.
```javascript
let board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
```

For this version, the board must be populated with 5 ships of different lengths.

| Name       | Length | ID     |
| ---------- | ------ | ------ |
| Carrier    | 5      | 1      |
| Battleship | 4      | 2      |
| Cruiser    | 3      | 3      |
| Submarine  | 3      | 4      |
| Destroyer  | 2      | 5      |

The ships must be placed on the board either vertically or horizontally, not diagonally. They cannot hang off the board, wrap around edges or overlap each other. Ships can touch each other.

To place the ships on the board you must populate/generate the two-dimensional array with integers representing the different ships (eg. the Carrier is represented by 1).

An example board could look like this in code.

```javascript
let board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 3, 0, 0, 0, 5, 5, 1],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
```

Write your implementation of this function in the `task1.js` file

To test your generation function you can run

```
./bin/battleship-[linux/macos/win] testBoard -b task1.js
```

If your implementation is valid you will get an output like this:

![Game board rendering](https://i.imgur.com/TcCf7MY.png)

If there is an error with your implementation the tool will tell you what is wrong, it will also attempt to draw it in the console.

You can use `console.log` in your generator function to get more information while you are writing your implementation. It's recommended to remove these logs once you are finished.

## Task 2 - Lets Play!
![Big boat](https://media.giphy.com/media/h3XSBAn1xTg7m/giphy.gif)

Now that we have a game board, we can play!

To play a game of Battleship you need to "guess" where the enemy has placed their ships on their board. A game is played in rounds and a round is split into turns. Let's take a quick look at an example game.

### Example Game

#### Game Start
At the start of a game, the player and the enemy both arrange ships on their boards. The player does not know the positions of the enemy's ships and vice versa.

Below you can see the layout of the board for this example game.

|     |0|1|2|3|4|5|6|7|8|9|  |     |0|1|2|3|4|5|6|7|8|9|
|-    |-|-|-|-|-|-|-|-|-|-| -|-    |-|-|-|-|-|-|-|-|-|-|
|**0**|2|2|2|2| | | | | | |  |**0**| | | | | | | | | | |
|**1**| | | | | | | | | | |  |**1**| | | | | | | | | | |
|**2**| | | |3| | | | | | |  |**2**| | | | | | | | | | |
|**3**| | | |3| | | | | | |  |**3**| | | | | | | | | | |
|**4**| | | |3| | | | | | |  |**4**| | | | | | | | | | |
|**5**| | | | | |1|1|1|1|1|  |**5**| | | | | | | | | | |
|**6**| | | | | | | | | | |  |**6**| | | | | | | | | | |
|**7**| |5| | | | | | | | |  |**7**| | | | | | | | | | |
|**8**| |5| | | |4|4|4| | |  |**8**| | | | | | | | | | |
|**9**| | | | | | | | | | |  |**9**| | | | | | | | | | |

#### Round 1
1. Player guesses [2,6]  
2. Player has hit the Enemy ship  
3. Enemy guesses [0,1]  
4. Enemy misses  
5. End of round.  

|     |0|1|2|3|4|5|6|7|8|9|  |     |0|1|2|3|4|5|6|7|8|9|
|-    |-|-|-|-|-|-|-|-|-|-| -|-    |-|-|-|-|-|-|-|-|-|-|
|**0**|2|2|2|2| | | | | | |  |**0**| | | | | | | | | | |
|**1**|O| | | | | | | | | |  |**1**| | | | | | | | | | |
|**2**| | | |3| | | | | | |  |**2**| | | | | | | | | | |
|**3**| | | |3| | | | | | |  |**3**| | | | | | | | | | |
|**4**| | | |3| | | | | | |  |**4**| | | | | | | | | | |
|**5**| | | | | |1|1|1|1|1|  |**5**| | | | | | | | | | |
|**6**| | | | | | | | | | |  |**6**| | |X| | | | | | | |
|**7**| |5| | | | | | | | |  |**7**| | | | | | | | | | |
|**8**| |5| | | |4|4|4| | |  |**8**| | | | | | | | | | |
|**9**| | | | | | | | | | |  |**9**| | | | | | | | | | |

#### Round 2
1. Player guesses [2,7]  
2. Player has hit the Enemy ship  
3. Enemy announces player has sunk their Submarine  
4. Enemy guesses [5,5]  
5. The enemy has hit Player ship  
6. End of round.  

|     |0|1|2|3|4|5|6|7|8|9|  |     |0|1|2|3|4|5|6|7|8|9|
|-    |-|-|-|-|-|-|-|-|-|-| -|-    |-|-|-|-|-|-|-|-|-|-|
|**0**|2|2|2|2| | | | | | |  |**0**| | | | | | | | | | |
|**1**|O| | | | | | | | | |  |**1**| | | | | | | | | | |
|**2**| | | |3| | | | | | |  |**2**| | | | | | | | | | |
|**3**| | | |3| | | | | | |  |**3**| | | | | | | | | | |
|**4**| | | |3| | | | | | |  |**4**| | | | | | | | | | |
|**5**| | | | | |X|1|1|1|1|  |**5**| | | | | | | | | | |
|**6**| | | | | | | | | | |  |**6**| | |X| | | | | | | |
|**7**| |5| | | | | | | | |  |**7**| | |X| | | | | | | |
|**8**| |5| | | |4|4|4| | |  |**8**| | | | | | | | | | |
|**9**| | | | | | | | | | |  |**9**| | | | | | | | | | |

Round's continue until the player has sunk all of the enemy's ships or the enemy has sunk all of your ships.

---

To play a game you need to write a function that returns an array of 2 integers that represent coordinates on the board to attack. Design a strategy to find and sink all the enemy's ships before they sink yours. Write this function in `task2.js`;

The file has an empty function included for you to write your implementation the function accepts 3 arguments. These arguments provide useful data for you to inform your guesses.

The first argument is a boolean that represents the result of the last round of play, this is a boolean. When this is `true` it means the previous guess was correct and hit a ship. To sink a ship you need to hit all the squares it populates.

The second argument is an array containing all your previous guesses.

A third argument is an integer that indicates if the last result sank a ship. If a ship has sunk this integer will represent the class of ship that sank (numbers 1 - 5). If no ship sunk this is 0.

```javascript
function play(hit, previousGuesses, sank){
  // lastGuessResult: false
  // previousGuesses: [[0,0],[1,5],[2,8]]
  // sank: 0
  return [0,0]
}
```

You do not need to use all the arguments in your implementation, they are there for convenience. You can also add more state into the global scope if needed.

To test your function you can simulate a game by running the following command.
```bash
./bin/battleship-[linux/macos/win] play -b task1.js -s task2.js -r
```

This will use your board generation function from Task 1, If you would prefer to use a built in random board generator you can omit the `-b` flag. This will generate a random board for you to play with.

```bash
./bin/battleship-[linux/macos/win] play -s task2.js -r
```

⚠️ If you are having issues with the emoji's in your terminal you can add the `--disableEmoji` option to the `play` command. For more help, you can pass the `--help` option to the command.

You can omit the `-r` flag to stop the simulation being rendered to your console and just print the result.

Your enemy will be making guesses against you as well. The goal is to write an algorithm that can beat the enemy's strategy.

![Boom](https://media.giphy.com/media/p1qMSDFlZ9Xmo/giphy.gif)

You can also test your function without simulating a full game by using the following command.

```
./bin/battleship-[linux/macos/win] testStrategy -s task2.js
```

## Task 3 - Debrief
Now that you have completed your mission we would like you to write a little about it.

Try to answer the following questions.

* How does your board generation algorithm work?
* What challenges did you face while writing your board generation algorithm?
* Did you consider any alternative implementations and if so why did you not pursue them?
* How does your play strategy algorithm work?
* Can you think of any better strategies?
* Are there any optimisations you could make to either algorithm?
* What was the best & worst part about this exercise? How could it be made better for other participants?

## Submission

To submit your solutions, archive the task files and a file containing your answers to task 3 in a zip or tar.

Send this archive via email to [join@stepsize.com](mailto:join@stepsize.com)
