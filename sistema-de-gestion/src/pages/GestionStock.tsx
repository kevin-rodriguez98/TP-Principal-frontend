import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/modal/Modal";
import "../styles/GestionStock.css";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { InsumoContext } from '../Context/InsumoContext';


const GestionStock = () => {
  const navigate = useNavigate();

  const { insumos, nuevoInsumo, setNuevoInsumo, insumoEditar, setInsumoEditar, modal, setModal,
    handleAddInsumo, handleDelete, handleUpdateInsumo } = useContext(InsumoContext)!;

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
          <h3>Alta de Insumo</h3>
          <form
            className="formulario"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddInsumo(e);
            }}
          >
            <input
              type="text"
              placeholder="Código de producto"
              value={nuevoInsumo.codigo}
              onChange={(e) =>
                setNuevoInsumo({ ...nuevoInsumo, codigo: e.target.value.trim() })
              }
              required
            />

            <input
              type="text"
              placeholder="Nombre"
              value={nuevoInsumo.nombre}
              onChange={(e) =>
                setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value.trim() })
              }
              required
            />

            <input
              type="text"
              placeholder="Categoría"
              value={nuevoInsumo.categoria}
              onChange={(e) =>
                setNuevoInsumo({ ...nuevoInsumo, categoria: e.target.value.trim() })
              }
              required
            />

            <input
              type="text"
              placeholder="Marca"
              value={nuevoInsumo.marca}
              onChange={(e) =>
                setNuevoInsumo({ ...nuevoInsumo, marca: e.target.value.trim() })
              }
              required
            />

            <input
              type="number"
              placeholder="Cantidad"
              value={nuevoInsumo.stock || ""}
              min="1"
              onChange={(e) =>
                setNuevoInsumo({
                  ...nuevoInsumo,
                  stock: Number(e.target.value) || 0,
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Lote"
              value={nuevoInsumo.lote}
              onChange={(e) =>
                setNuevoInsumo({ ...nuevoInsumo, lote: e.target.value.trim() })
              }
              required
            />

            <input
              type="text"
              placeholder="Unidad"
              value={nuevoInsumo.unidad}
              onChange={(e) =>
                setNuevoInsumo({ ...nuevoInsumo, unidad: e.target.value.trim() })
              }
              required
            />

            <input
              type="number"
              placeholder="Umbral mínimo"
              value={nuevoInsumo.umbralMinimoStock || ""}
              min="0"
              onChange={(e) =>
                setNuevoInsumo({
                  ...nuevoInsumo,
                  umbralMinimoStock: Number(e.target.value) || 0,
                })
              }
              required
            />

            <button type="submit" className="btn-guardar">
              Guardar
            </button>
          </form>
        </section>


        <section className="card">
          <h3>Lista de Insumos</h3>
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
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Anterior</button>
            <span>Página {currentPage}-{totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Siguiente</button>
          </div>
        </section>

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
        <button onClick={() => navigate("/")} className="btn-guardar btn-volver">Volver</button>
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