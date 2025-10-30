import { useContext } from "react";
import { Movimiento_producto_context } from "../Context/Movimiento_producto_context.tsx";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import Footer from '../components/Footer.tsx'
import Header from '../components/Header.tsx'
import TablaRegistro from "../components/Tables/registros/TablaRegistro.tsx";
import "../styles/tablas.css";
import Modal from "../components/modal/Modal.tsx";

const RegistroInsumos = () => {
    const { modal, isLoading, setModal } = useContext(Movimiento_producto_context)!;

    const darkTheme = createTheme({
        palette: {
            mode: 'dark'
        }
    })

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 registros-main">
                <h2 className="titulo">Registro de Insumos</h2>
                <section className="card">
                    <div className="table-wrapper ">
                        <ThemeProvider theme={darkTheme}>
                            <TablaRegistro />
                        </ThemeProvider>
                    </div>
                </section>
            </main>
            <Footer />

            {modal && !isLoading && (
                <Modal
                    tipo={modal.tipo}
                    mensaje={modal.mensaje}
                    onConfirm={modal.onConfirm}
                    onClose={() => setModal(null)}
                />
            )}
        </div>


    )
}

export default RegistroInsumos