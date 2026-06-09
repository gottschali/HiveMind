
export function getColor(team) {
    // use the enums!
    if (team === 'black') return 'blue';
    else if (team === 'white') return 'red';
    else return 'grey';
}
export function getResult(result) {
    const whiteLost = result[0];
    const blackLost = result[1];
    if (whiteLost && blackLost) {
        return 'tie';
    } else if (whiteLost) {
        return getColor('black') + " won";
    } else if (blackLost) {
        return getColor('white') + " won";
    } else {
        return "undecided";
    }
}
