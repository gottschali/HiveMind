import Canvas from './Canvas'
import * as HEX from '../../shared/hexlib'
import { State } from '../../shared/model/state'


const orientation = HEX.orientation_pointy;
const layout = HEX.Layout(orientation, new HEX.Point(10, 10), new HEX.Point(500, 250))

export default function BackgroundCanvas() {
    const state = new State();

    const draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = "#000000";
        state.apply(state.actions[Math.floor(Math.random() * state.actions.length)]);
        for (const hex of state.hive.map.keys()) {
            ctx.beginPath()
            const corners = HEX.polygon_corners(layout, hex);
            ctx.moveTo(corners[5].x + 50, corners[5].y + 50);
            corners.forEach(p => {
                ctx.lineTo(p.x + 50, p.y + 50);
            })
            ctx.fill();
        }
    }
    return <Canvas draw={draw} />
}
