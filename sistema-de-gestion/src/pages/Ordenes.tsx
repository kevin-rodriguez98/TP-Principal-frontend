import { useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tabla.css";
import { OrdenProduccionContext } from "../Context/OrdenesContext";
import Modal from "../components/modal/Modal";
import { createTheme, ThemeProvider } from "@mui/material";
import TablaOrden from "../components/TablaOrden";

const OrdenProduccionPage = () => {

  const { modal, tipoModal, setTipoModal } = useContext(OrdenProduccionContext)!;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 ordenes-main">
        <section className="card ">

          <div className="table-wrapper">
            <ThemeProvider theme={darkTheme}>
              <TablaOrden />
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

export default OrdenProduccionPage;