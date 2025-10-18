import Header from '../components/Header.tsx'
import HomeOperaciones from '../components/HomeOperaciones.tsx'
import Footer from '../components/Footer.tsx'
import "../styles/Menu.css";

const Menu = () => {
    return (
        <div className='menu-container '>
            <Header />
            <main>
                <HomeOperaciones />
            </main>
            <Footer />
        </div>
    )
}

export default Menu
