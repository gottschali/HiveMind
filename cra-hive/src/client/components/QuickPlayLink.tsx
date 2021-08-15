import { Link } from "react-router-dom"


export default function QuickPlayLink() {
    return <Link to = {{
        pathname: "/play/test"
    }}
    > Play! </Link>
}