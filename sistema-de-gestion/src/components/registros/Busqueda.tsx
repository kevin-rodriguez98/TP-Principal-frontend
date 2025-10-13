import React, { useContext, useEffect } from "react";
import { RiResetRightFill } from "react-icons/ri";
import { RegistroContext } from "../../Context/RegistroContext";
import "../../styles/cuadroBusqueda.css";

const Busqueda = () => {
    // Si el contexto fuera null, le damos valores por defecto para evitar errores
    const { filtros, setFiltros } = useContext(RegistroContext) || {
        filtros: { codigo: "", nombre: "", marca: "", categoria: "", lote: "" },
        setFiltros: () => { },
    };

    useEffect(() => {
        setFiltros({
            codigo: "",
            nombre: "",
            categoria: "",
            marca: "",
            lote: "",
            tipo: "",
            proveedor: "",
            destino: "",
            responsable: "",
        });

    }, []);

    const handleFilter = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFiltros((prev: any) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleReset = (e?: React.FormEvent) => {
        e?.preventDefault();
        setFiltros({
            codigo: "",
            nombre: "",
            categoria: "",
            marca: "",
            lote: "",
            tipo: "",
            proveedor: "",
            destino: "",
            responsable: "",
        });
    };

    return (
        <form className="form-buscar" onSubmit={(e) => { e.preventDefault(); handleReset(); }}>
            <input
                type="text"
                name="codigo"
                value={filtros.codigo || ""}
                placeholder="Código..."
                onChange={handleFilter}
            />

            <input
                type="text"
                name="nombre"
                value={filtros.nombre || ""}
                placeholder="Nombre..."
                onChange={handleFilter}
            />

            <select name="marca" value={filtros.marca || ""} onChange={handleFilter}>

                <option value="">Marca</option>
                <option value="La Serenísima">La Serenísima</option>
                <option value="Sancor">Sancor</option>
                <option value="Milkaut">Milkaut</option>
                <option value="Yougurisímo">Yougurisímo</option>
                <option value="Ilolay">Ilolay</option>
                <option value="La Paulina">La Paulina</option>
                <option value="Tregar">Tregar</option>
            </select>


            <select name="categoria" value={filtros.categoria || ""} onChange={handleFilter}>
                <option value="">Categoría</option>
                <option value="Bebidas lácteas">Bebidas lácteas</option>
                <option value="Quesos">Quesos</option>
                <option value="Postres">Postres</option>
                <option value="crema">Crema</option>
                <option value="manteca">Manteca</option>
                <option value="helado">Helado</option>
                <option value="congelados">Congelados</option>
            </select>

            <input
                type="text"
                name="lote"
                value={filtros.lote || ""}
                placeholder="Lote..."
                onChange={handleFilter}
            />

            <select name="tipo" value={filtros.tipo || ""} onChange={handleFilter}>
                <option value="">tipo</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
            </select>



            <input
                type="text"
                name="proveedor"
                value={filtros.proveedor || ""}
                placeholder="Proveedor..."
                onChange={handleFilter}
            />

            {/* <input
                type="text"
                name="destino"
                value={filtros.destino || ""}
                placeholder="Destino..."
                onChange={handleFilter}
            /> */}

            {/* <input
                type="text"
                name="responsable"
                value={filtros.responsable || ""}
                placeholder="Responsable..."
                onChange={handleFilter}
            /> */}

            <button type="submit" title="Reiniciar filtros" className="btn-reset">
                <RiResetRightFill />
            </button>
        </form>
    );
};

export default Busqueda;
