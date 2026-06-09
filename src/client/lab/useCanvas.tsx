import { useRef, useEffect } from 'react'

const useCanvas = (draw, options={fps: 20}) => {

    const canvasRef = useRef(null)
    const fps = options.fps;

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId
        const render = () => {
            frameCount++
            draw(context, frameCount)
            resizeCanvasToDisplaySize(canvas);
            resizeCanvas(canvas);
            setTimeout(() => {
                animationFrameId = window.requestAnimationFrame(render);
            }, 1000 / fps);
        }
        render()
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])
    return canvasRef
}
export default useCanvas

function resizeCanvas(canvas) {
    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio:ratio=1 } = window
        const context = canvas.getContext('2d')
        canvas.width = width*ratio
        canvas.height = height*ratio
        context.scale(ratio, ratio)
        return true
    }

    return false
}
function resizeCanvasToDisplaySize(canvas) {

    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      return true // here you can return some usefull information like delta width and delta height instead of just true
      // this information can be used in the next redraw...
    }

    return false
  }
