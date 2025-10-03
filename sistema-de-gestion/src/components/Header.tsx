import '../styles/Nav.css'
const Header = () => {

    const estilosTitulo = {
        fontFamily: "Times New Roman",
        fontSize:"26px",
        color:'white'
    };

    return (
        <div>
            <nav className="nav">
                <div className="logo">
                    <h1 style={estilosTitulo}>Frozen Lácteos</h1>
                </div>

            </nav>
        </div>
    )
}

export default Header
