import Header from '../components/estaticos/Header.tsx'
import HomeOperaciones from '../components/estaticos/HomeOperaciones.tsx'
import Footer from '../components/estaticos/Footer.tsx'
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
