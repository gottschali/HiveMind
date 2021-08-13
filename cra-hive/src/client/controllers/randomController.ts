export default function randomController(submitAction, state) {
    const action = state.actions[Math.floor(Math.random() * state.actions.length)];
    submitAction(action);
}