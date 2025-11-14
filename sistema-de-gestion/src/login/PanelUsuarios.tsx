import Footer from "../components/estaticos/Footer"
import Header from "../components/estaticos/Header"
import UsuariosPanel from "./Usuarios"

const PanelUsuarios = () => {
    return (
        <div className='menu-container '>
            <Header />
            <main>
                <UsuariosPanel />
            </main>
            <Footer />
        </div>
    )
}

export default PanelUsuarios;