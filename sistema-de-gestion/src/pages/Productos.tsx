import { useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tablas.css";
import { ProductosContext } from "../Context/ProductosContext";
import Modal from "../components/modal/Modal";
import { createTheme, ThemeProvider } from "@mui/material";
import TablaProductos from "../components/Tables/TablaProductos";

const ProduccionPage = () => {

  const { modal, tipoModal, setTipoModal } = useContext(ProductosContext)!;

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
              <TablaProductos />
            </ThemeProvider>
          </div>
        </section>
      </main>
      <Footer />

      {tipoModal && modal &&  (
        <Modal
          tipo={modal.tipo}
          mensaje={modal.mensaje}
          onConfirm={modal.onConfirm}
          onClose={() => setTipoModal(null)}
        />
      )}
    </div>
  );
};

export default ProduccionPage;