import { Outlet } from "react-router-dom"
import Header from "../components/Header/Header"
import "./layout.css"

const Layout = () => {
    

    return (<>
        <div className="BaseLayout">
            <div className="header-box">
                <Header />
            </div>
            <div className="Outlet">
                <Outlet />
            </div>
        </div>

    </>)
}

export default Layout