import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/modal/Modal";
import "../styles/GestionStock.css";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { InsumoContext } from '../Context/InsumoContext';
import Form_Alta from "../components/Form_Alta";
import Form_Registro from "../components/Form_Registro";


const GestionStock = () => {
  const navigate = useNavigate();

  const { insumos, insumoEditar, setInsumoEditar, modal, setModal, handleDelete, handleUpdateInsumo, open, setOpen, openEditor, setOpenEditor } = useContext(InsumoContext)!;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = insumos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(insumos.length / itemsPerPage);

  return (

    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 gestion-stock">
        <h2 className="titulo">Gestión de Stock</h2>
        <section className="card">
          <h3 className='tituloSeccion'>Lista de Insumos</h3>
          <table>
            <thead>
              <tr>
                <th>Código de producto</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Cantidad</th>
                <th>Lote</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.codigo}>
                  <td data-label="Código">{item.codigo}</td>
                  <td data-label="Nombre">{item.nombre}</td>
                  <td data-label="Categoría">{item.categoria}</td>
                  <td data-label="Marca">{item.marca}</td>
                  <td data-label="Cantidad">{item.stock}</td>
                  <td data-label="Lote">{item.lote}</td>
                  <td data-label="Acciones" className="actions">
                    <button className="btn-editar" onClick={() => setInsumoEditar(item)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleDelete(item.codigo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="paginacion">
            <button className="btn-paginacion" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Anterior</button>
            <span>Página {currentPage}-{totalPages}</span>
            <button className="btn-paginacion" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Siguiente</button>
          </div>
        </section>

        <section className="card">
          <h3 className='tituloSeccion'>Lista de Registros</h3>
          <table>
            <thead>
              <tr>
                <th>Código de producto</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Cantidad</th>
                <th>Lote</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.codigo}>
                  <td data-label="Código">{item.codigo}</td>
                  <td data-label="Nombre">{item.nombre}</td>
                  <td data-label="Categoría">{item.categoria}</td>
                  <td data-label="Marca">{item.marca}</td>
                  <td data-label="Cantidad">{item.stock}</td>
                  <td data-label="Lote">{item.lote}</td>
                  <td data-label="Acciones" className="actions">
                    <button className="btn-editar" onClick={() => setInsumoEditar(item)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleDelete(item.codigo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="paginacion">
            <button className="btn-paginacion" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Anterior</button>
            <span>Página {currentPage}-{totalPages}</span>
            <button className="btn-paginacion" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Siguiente</button>
          </div>
        </section>
        <button onClick={() => navigate("/")} className="btn-volver">Volver</button>

        {/* === BOTONES FLOTANTES === */}
        <div className="fab-container">
          <button
            className="fab fab-alta"
            onClick={() => {
              setOpen(true);
              setOpenEditor(false);
            }}
          >
            +
          </button>
          <button
            className="fab fab-registro"
            onClick={() => {
              setOpenEditor(true);
              setOpen(false);
            }}
          >
            ⇄
          </button>
        </div>

        {/* === FORMULARIO DE ALTA === */}
        {open && !openEditor && (
          <div className="overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setOpen(false)}>
                X
              </button>
              <h2>Alta de Insumo</h2>
              <Form_Alta />
            </div>
          </div>
        )}

        {/* === FORMULARIO DE REGISTRO === */}
        {openEditor && (
          <div className="overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setOpenEditor(false)}>
                X
              </button>
              <h2>Registro de Movimiento</h2>
              <Form_Registro />
            </div>
          </div>
        )}


        {insumoEditar && (
          <section className="card">
            <h3>Editar Insumo</h3>
            <form className="formulario" onSubmit={handleUpdateInsumo}>
              <input
                type="text"
                placeholder="Nombre"
                value={insumoEditar.nombre}
                onChange={(e) => setInsumoEditar({ ...insumoEditar, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Categoría"
                value={insumoEditar.categoria}
                onChange={(e) => setInsumoEditar({ ...insumoEditar, categoria: e.target.value })}
              />
              <input
                type="text"
                placeholder="Marca"
                value={insumoEditar.marca}
                onChange={(e) => setInsumoEditar({ ...insumoEditar, marca: e.target.value })}
              />
              <input
                type="text"
                placeholder="cantidad"
                value={insumoEditar.stock}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setInsumoEditar({ ...insumoEditar, stock: Number(value) });
                }}
              />
              <input
                type="text"
                placeholder="Lote"
                value={insumoEditar.lote}
                onChange={(e) => setInsumoEditar({ ...insumoEditar, lote: e.target.value })}
              />
              <button type="submit" className="btn-actualizar">Actualizar</button>
            </form>
          </section>
        )}
      </main>
      <Footer />

      {modal && (
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