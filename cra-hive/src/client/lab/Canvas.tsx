import useCanvas from './useCanvas'

const Canvas = props => {
    const { draw } = props;
    const canvasRef = useCanvas(draw, {fps: 3});
    return <canvas ref={canvasRef} style={{
       width: "100%",
       height: "100%",
       display: "block",
       position: "absolute",
       top: 0,
       left: 0,
       zIndex: -9999}} />
}

export default Canvas
