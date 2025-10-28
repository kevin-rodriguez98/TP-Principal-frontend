import { useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tablas.css";
import { ProductosContext } from "../Context/ProductosContext";
import Modal from "../components/modal/Modal";
import { createTheme, ThemeProvider } from "@mui/material";
import TablaProductos from "../components/Tables/ordenes/TablaProductos";

const ProduccionPage = () => {

  const { modal, isLoading, setModal } = useContext(ProductosContext)!;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 productos-main">
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

      {modal && !isLoading  && (
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

export default ProduccionPage;