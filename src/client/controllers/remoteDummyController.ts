export default function remoteDummy (submitAction, state) {
        return ({
            highlighted: [],
            handleBoardClick: () => console.log("Remote player's turn"),
            handleDropClick: () => console.log("Remote player's turn")
        });
}