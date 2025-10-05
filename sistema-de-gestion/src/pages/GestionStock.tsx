import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/modal/Modal";
import "../styles/GestionStock.css";
import { useNavigate } from "react-router-dom";

interface Insumo {
  codigo: number;
  nombre: string;
  categoria: string;
  marca: string;
  cantidad: number;
  lote: string;
}

const GestionStock = () => {
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState<Insumo[]>([
    { codigo: 101, nombre: "Leche", categoria: "Lácteos", marca: "La Serenísima", cantidad: 100, lote: "L001" },
    { codigo: 102, nombre: "Leche", categoria: "Lácteos", marca: "Sancor", cantidad: 80, lote: "L002" },
    { codigo: 103, nombre: "Queso", categoria: "Lácteos", marca: "Milkaut", cantidad: 50, lote: "L003" },
    { codigo: 104, nombre: "Harina", categoria: "Alimentos", marca: "Molinos", cantidad: 30, lote: "L004" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = insumos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(insumos.length / itemsPerPage);

  const [nuevoInsumo, setNuevoInsumo] = useState<Omit<Insumo, "lote"> & { lote: string }>({
    codigo: 0,
    nombre: "",
    categoria: "",
    marca: "",
    cantidad: 0,
    lote: "",
  });

  const [insumoEditar, setInsumoEditar] = useState<Insumo | null>(null);

  const [modal, setModal] = useState<{
    tipo: "confirm" | "success" | "error";
    mensaje: string;
    onConfirm?: () => void;
  } | null>(null);

  const handleAddInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (insumos.some((i) => i.codigo === nuevoInsumo.codigo)) {
      setModal({ tipo: "error", mensaje: "Ya existe un insumo con ese código" });
      return;
    }
    setInsumos([...insumos, { ...nuevoInsumo, codigo: Number(nuevoInsumo.codigo) } as Insumo]);
    setNuevoInsumo({ codigo: 0, nombre: "", categoria: "", marca: "", cantidad: 0, lote: "" });
    setModal({ tipo: "success", mensaje: "Insumo agregado con éxito" });
  };

  const handleDelete = (codigo: number) => {
    setModal({
      tipo: "confirm",
      mensaje: "¿Seguro que deseas eliminar este insumo?",
      onConfirm: () => {
        setInsumos(insumos.filter((i) => i.codigo !== codigo));
        if (insumoEditar?.codigo === codigo) setInsumoEditar(null);
        setModal({ tipo: "success", mensaje: "Insumo eliminado con éxito" });
      },
    });
  };

  const handleUpdateInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (insumoEditar) {
      setInsumos(insumos.map((i) => (i.codigo === insumoEditar.codigo ? insumoEditar : i)));
      setInsumoEditar(null);
      setModal({ tipo: "success", mensaje: "Insumo actualizado con éxito" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 gestion-stock">
        <h2 className="titulo">Gestión de Stock</h2>

        <section className="card">
          <h3>Alta de Insumo</h3>
          <form className="formulario" onSubmit={handleAddInsumo}>
            <input
              type="text"
              placeholder="Código de producto"
              value={nuevoInsumo.codigo === 0 ? "" : nuevoInsumo.codigo}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setNuevoInsumo({ ...nuevoInsumo, codigo: Number(value) });
              }}
              required
            />
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoInsumo.nombre}
              onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Categoría"
              value={nuevoInsumo.categoria}
              onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, categoria: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Marca"
              value={nuevoInsumo.marca}
              onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, marca: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Stock"
              value={nuevoInsumo.cantidad === 0 ? "" : nuevoInsumo.cantidad}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setNuevoInsumo({ ...nuevoInsumo, cantidad: Number(value) });
              }}
              required
            />
            <input
              type="text"
              placeholder="Lote"
              value={nuevoInsumo.lote}
              onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, lote: e.target.value })}
              required
            />
            <button type="submit" className="btn-guardar">Guardar</button>
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
                <th>Stock</th>
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
                  <td data-label="Cantidad">{item.cantidad}</td>
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
            <span>Página {currentPage} de {totalPages}</span>
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
                placeholder="Stock"
                value={insumoEditar.cantidad}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setInsumoEditar({ ...insumoEditar, cantidad: Number(value) });
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
      <button onClick={() => navigate("/")} className="btn-guardar">Volver</button>
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