const cp = require('child_process');

let wins = 0,
	buf = cp.execSync('.\\bin\\battleship-win.exe play -s task2.js');

while (buf.includes('Winner: Player')) {
	buf = cp.execSync('.\\bin\\battleship-win.exe play -s task2.js');
	wins++;
}

console.log(`${((wins - 1) / wins) * 100}% of`, wins + 1, 'games');
