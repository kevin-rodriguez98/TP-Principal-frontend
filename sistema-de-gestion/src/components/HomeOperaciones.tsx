import { useContext } from 'react';
import { OpContext } from '../Context/OpContext';
import Operacion from './Operacion.tsx'
import '../styles/Main.css'


const HomeOperaciones = () => {

    const { modulos } = useContext(OpContext)!;

    return (
        <div className='div-main'>
            <div className='div-titulo'>
                <h2>Menu de operaciones</h2>
            </div>
            <div className='div-OP'>
                {modulos.map((mod, i) => (
                    <Operacion key={i} modulo={mod} />
                ))}
            </div>
        </div>
    )
}

export default HomeOperaciones
