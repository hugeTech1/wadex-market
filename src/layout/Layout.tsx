import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useStoreContext } from "../context/StoreContext";

const Layout = () => {
    const { loading } = useStoreContext();
    if(loading) return null;
    
    return (
        <div className="mx-auto">

            {/* Navbar always at top */}
            <Nav />

            {/* Page content */}
            <main>
                <Outlet />
            </main>

            {/* Footer always at bottom */}
            <Footer />
        </div>
    );
};

export default Layout;