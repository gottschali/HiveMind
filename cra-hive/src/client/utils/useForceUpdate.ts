import { useState } from "react";

export default function useForceUpdate(){
    const [, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}
