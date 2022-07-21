let enemyBoardState;

/**
 * This function should return an array containing two numbers, the numbers represent array indexes
 * for guessing where enemeys ships are in a game of battleship.
 *
 * Examples: [0,3], [3,9], [9,9]
 * Constraints: x <= 9, x >= 0, y <= 9, y >= 0
 *
 * @param {boolean} hit - If the previous guess was a hit this is set to true
 * @param {[number, number][]} previousGuesses - Array of the previous guesses made by previous calls to the function
 * @param {number} sunk - Number representing a class of ship if the previous guess sunk it. If no ship was sunk on the previous call this is 0
 *
 * @returns {[number, number]}
 */

function playBattleships(hit, previousGuesses, sunk) {
	if (previousGuesses.length === 0) {
		enemyBoardState = new Array(10).fill(null).map(() => new Array(10).fill(0));
		return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
	}

	let [x, y] = previousGuesses[previousGuesses.length - 1];
	const last16Guesses = previousGuesses.slice(-16);

	if (hit || containsActionableHit(last16Guesses)) {
		if (hit) {
			enemyBoardState[x][y] = true;
		} else {
			enemyBoardState[x][y] = false;
			const lastActionableHit = last16Guesses.reverse().find(([x, y]) => enemyBoardState[x][y] === true && hasValidDirection(x, y));
			if (lastActionableHit) {
				[x, y] = lastActionableHit;
			}
		}

		if (sunk === 0) {
			if (y > 0 && enemyBoardState[x][y - 1] === true && y < 9 && enemyBoardState[x][y + 1] === 0) {
				return [x, y + 1];
			} else if (y < 9 && enemyBoardState[x][y + 1] === true && y > 0 && enemyBoardState[x][y - 1] === 0) {
				return [x, y - 1];
			} else if (x > 0 && enemyBoardState[x - 1][y] === true && x < 9 && enemyBoardState[x + 1][y] === 0) {
				return [x + 1, y];
			} else if (x < 9 && enemyBoardState[x + 1][y] === true && x > 0 && enemyBoardState[x - 1][y] === 0) {
				return [x - 1, y];
			} else if (hasValidDirection(x, y)) {
				let candidateDirection = Math.floor(Math.random() * 4);

				while (!isValidDirection(x, y, candidateDirection)) {
					candidateDirection = Math.floor(Math.random() * 4);
				}

				const [cx, cy] = [
					x + (candidateDirection === 0 ? -1 : candidateDirection === 1 ? 1 : 0),
					y + (candidateDirection === 2 ? -1 : candidateDirection === 3 ? 1 : 0)
				];

				return [cx, cy];
			} else {
				let cx = x,
					cy = y;
				while (cx > 0 && enemyBoardState[cx][cy] === true) {
					cx--;
				}

				if (enemyBoardState[cx][cy] === 0) {
					return [cx, cy];
				}
			}
		} else {
			const shipCoords = getShipCoords(x, y, sunk);

			for (const [x, y] of shipCoords) {
				enemyBoardState[x][y] = sunk;
			}
		}
	}

	if (!hit) {
		enemyBoardState[x][y] = false;
	}

	if (previousGuesses.length < 35) {
		const quadrantGuesses = [0, 0, 0, 0];

		for (const [x, y] of previousGuesses) {
			quadrantGuesses[Math.floor(x / 5) + Math.floor(y / 5) * 2]++;
		}

		let guessQuadrant = quadrantGuesses.indexOf(Math.min(...quadrantGuesses));
		quadrantGuesses.splice(guessQuadrant, 1);

		while (quadrantFull(guessQuadrant)) {
			guessQuadrant = quadrantGuesses.indexOf(Math.min(...quadrantGuesses));
			quadrantGuesses.splice(guessQuadrant, 1);
		}

		let [cx, cy] = generateGuess(guessQuadrant);

		while (enemyBoardState[cx][cy] !== 0) {
			[cx, cy] = generateGuess(guessQuadrant);
		}

		return [cx, cy];
	} else {
		const blanks = findContiguousBlanks();
		const largest = blanks.reduce((a, b) => (a.length > b.length ? a : b), blanks[0]);

		return findCenter(largest);
	}
}

function hasValidDirection(x, y) {
	return [0, 1, 2, 3].some((direction) => isValidDirection(x, y, direction));
}

function isValidDirection(x, y, direction) {
	switch (direction) {
		case 0:
			return x > 0 && enemyBoardState[x - 1][y] === 0;
		case 1:
			return x < 9 && enemyBoardState[x + 1][y] === 0;
		case 2:
			return y > 0 && enemyBoardState[x][y - 1] === 0;
		case 3:
			return y < 9 && enemyBoardState[x][y + 1] === 0;
	}
}

function getShipCoords(x, y, shipId) {
	const shipLength = getShipLength(shipId);
	let horizontal = true,
		vertical = true;

	let hx = x;
	while (hx > 0 && enemyBoardState[hx - 1][y] === true) {
		hx--;
	}

	if (hx + shipLength <= 9) {
		for (let i = 0; i < shipLength; i++) {
			if (enemyBoardState[hx + i][y] !== true) {
				horizontal = false;
				break;
			}
		}
	} else {
		horizontal = false;
	}

	let vy = y;
	while (vy > 0 && enemyBoardState[x][vy - 1] === true) {
		vy--;
	}

	if (vy + shipLength <= 9) {
		for (let i = 0; i < shipLength; i++) {
			if (enemyBoardState[x][vy + i] !== true) {
				vertical = false;
				break;
			}
		}
	} else {
		vertical = false;
	}

	const out = [];

	if (horizontal) {
		for (let i = 0; i < shipLength; i++) {
			out.push([hx + i, y]);
		}
	} else if (vertical) {
		for (let i = 0; i < shipLength; i++) {
			out.push([x, vy + i]);
		}
	}

	return out;
}

function quadrantFull(quadrant) {
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			if (enemyBoardState[i + (quadrant % 2) * 5][j + Math.floor(quadrant / 2) * 5] === 0) {
				return false;
			}
		}
	}

	return true;
}

function generateGuess(quadrant) {
	return [Math.floor(Math.random() * 5) + 5 * (quadrant % 2), Math.floor(Math.random() * 5) + 5 * Math.floor(quadrant / 2)];
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

function includesPoint(arr, x, y) {
	return arr.some(([a, b]) => a === x && b === y);
}

function containsActionableHit(previousGuesses) {
	return previousGuesses.some(([x, y]) => enemyBoardState[x][y] === true && hasValidDirection(x, y));
}

function findContiguousBlanks() {
	const out = [];

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			if (enemyBoardState[i][j] === 0 && !out.some((blank) => includesPoint(blank, i, j))) {
				out.push(exploreBlank(i, j, []));
			}
		}
	}

	return out;
}

function exploreBlank(x, y, visited) {
	const out = [[x, y]];
	visited.push([x, y]);

	if (x > 0 && enemyBoardState[x - 1][y] === 0 && !visited.some(([a, b]) => a === x - 1 && b === y)) {
		out.push(...exploreBlank(x - 1, y, visited));
	}
	if (x < 9 && enemyBoardState[x + 1][y] === 0 && !visited.some(([a, b]) => a === x + 1 && b === y)) {
		out.push(...exploreBlank(x + 1, y, visited));
	}
	if (y > 0 && enemyBoardState[x][y - 1] === 0 && !visited.some(([a, b]) => a === x && b === y - 1)) {
		out.push(...exploreBlank(x, y - 1, visited));
	}
	if (y < 9 && enemyBoardState[x][y + 1] === 0 && !visited.some(([a, b]) => a === x && b === y + 1)) {
		out.push(...exploreBlank(x, y + 1, visited));
	}

	return out;
}

function findCenter(blank) {
	const [ax, ay] = blank.reduce(([tx, ty], [x, y]) => [tx + x, ty + y], [0, 0]).map((c) => Math.floor(c / blank.length));

	return blank.reduce((out, cur) => (distance(cur, [ax, ay]) < distance(out, [ax, ay]) ? cur : out), blank[0]);
}

function distance([x1, y1], [x2, y2]) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

module.exports.default = playBattleships;
