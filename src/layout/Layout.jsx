import { Outlet } from "react-router-dom"
import Header from "../components/Header/Header"
import "./layout.css"

const Layout=()=>{

    return (<>
    <div className="h-full w-full p-4 flex">
        <Header />
        <div className="w-5/6">
            <Outlet />
        </div>
    </div>

    </>)
}

export default Layout