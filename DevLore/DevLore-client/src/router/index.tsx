import NavBar from "../components/InnerComponents"
import Search from "../components/Search"

export const privateRoutes = [
    {path: "", element: Search}
]

export const publicRoutes = [
    {path: "/Search", element: NavBar}
]