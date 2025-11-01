import { useContext } from "react";
import { OrdenesContext } from "../Context/OrdenesContext";
import { createTheme, ThemeProvider } from "@mui/material";
import { ModalContext } from "../components/modal/ModalContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/modal/Modal";
import TablaOrden from "../components/Tables/ordenes/TablaOrden";
import "../styles/tablas.css";

const OrdenProduccionPage = () => {

  const { isLoading } = useContext(OrdenesContext)!;
  const { modal, setModal } = useContext(ModalContext)!;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 ordenes-main">
        <h2 className="titulo">Órdenes de Producción</h2>
        <section className="card ">
          <div className="table-wrapper">
            <ThemeProvider theme={darkTheme}>
              <TablaOrden />
            </ThemeProvider>
          </div>
          <div>
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

export default OrdenProduccionPage;