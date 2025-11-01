import { useContext } from "react";
import { InsumoContext } from "../Context/InsumoContext";
import { createTheme, ThemeProvider } from "@mui/material";
import { ModalContext } from "../components/modal/ModalContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/modal/Modal";
import TablaInsumos from "../components/Tables/insumos/TablaInsumos";
import "../styles/tablas.css";




const GestionStock = () => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })
  const { isLoading } = useContext(InsumoContext)!;
  const { modal, setModal } = useContext(ModalContext)!;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 insumos-main">
        <h2 className="titulo">Gestión de Stock</h2>
        <section className="card">
          <div className="table-wrapper">
            <ThemeProvider theme={darkTheme}>
              <TablaInsumos />
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
  );
};

export default GestionStock;
