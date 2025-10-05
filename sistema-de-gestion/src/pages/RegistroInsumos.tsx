import "../styles/GestionStock.css";
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useNavigate } from "react-router-dom";

const RegistroInsumos = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 gestion-stock">
                <h2 className="titulo">Registro de Insumos</h2>

                <section className="card">
                    <h3>Ingreso de Insumo</h3>
                    <form className="formulario">
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <button type="submit" className="btn-guardar">Guardar</button>
                    </form>
                </section>

                <section className="card">
                    <h3>Egreso de Insumos</h3>
                    <form className="formulario">
                        <input
                            type="text"
                            placeholder="  "
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={""}
                            // onChange={ }
                            required
                        />
                        <button type="submit" className="btn-guardar">Guardar</button>
                    </form>


                </section>

                <button onClick={() => navigate("/")} className="btn-guardar btn-volver">Volver</button>
            </main>
            <Footer />

        </div>
    )
}

export default RegistroInsumos
