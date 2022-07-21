/**
 * This function must return a two-dimensional array that represents
 * a board for the game battleship
 *
 * @returns {number[][]}
 */

function generateBattleshipBoard() {
	const board = new Array(10).fill(null).map(() => new Array(10).fill(0));

	for (let shipId = 1; shipId <= 5; shipId++) {
		const shipLength = getShipLength(shipId);
		let x = Math.floor(Math.random() * 10),
			y = Math.floor(Math.random() * 10);

		if (hasValidDirection(board, x, y, shipLength)) {
			let direction = Math.floor(Math.random() * 4);

			while (!isValidDirection(board, x, y, shipLength, direction)) {
				direction = Math.floor(Math.random() * 4);
			}

			for (let i = 0; i < shipLength; i++) {
				if (direction === 0) {
					board[x - i][y] = shipId;
				} else if (direction === 1) {
					board[x + i][y] = shipId;
				} else if (direction === 2) {
					board[x][y - i] = shipId;
				} else if (direction === 3) {
					board[x][y + i] = shipId;
				}
			}
		} else {
			shipId--;
		}
	}

	return board;
}

function isValidDirection(board, x, y, shipLength, direction) {
	switch (direction) {
		case 0:
			if (x - shipLength < 0) {
				return false;
			}
		case 1:
			if (x + shipLength >= 10) {
				return false;
			}
		case 2:
			if (y - shipLength < 0) {
				return false;
			}
		case 3:
			if (y + shipLength >= 10) {
				return false;
			}
	}

	for (let i = 0; i < shipLength; i++) {
		switch (direction) {
			case 0:
				if (board[x - i][y] !== 0) {
					return false;
				}
			case 1:
				if (board[x + i][y] !== 0) {
					return false;
				}
			case 2:
				if (board[x][y - i] !== 0) {
					return false;
				}
			case 3:
				if (board[x][y + i] !== 0) {
					return false;
				}
		}
	}

	return true;
}

function hasValidDirection(board, x, y, shipLength) {
	return [0, 1, 2, 3].some((direction) => isValidDirection(board, x, y, shipLength, direction));
}

function getShipLength(shipId) {
	switch (shipId) {
		case 1:
			return 5;
		case 2:
			return 4;
		case 3:
			return 3;
		case 4:
			return 3;
		case 5:
			return 2;
		default:
			return 0;
	}
}

module.exports.default = generateBattleshipBoard;
