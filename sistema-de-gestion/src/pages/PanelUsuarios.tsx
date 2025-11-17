import { createTheme, CssBaseline, darkScrollbar, ThemeProvider } from "@mui/material";
import Footer from "../components/estaticos/Footer"
import TablaUsuarios from "../login/Usuarios"

const PanelUsuarios = () => {

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: { main: "#90caf9" },
            secondary: { main: "#f48fb1" },
            background: {
                default: "#121212",
                paper: "#1e1e1e",
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: darkScrollbar(),
                },
            },
        },
    });
    return (
        <div className='menu-container'>
            <main>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <TablaUsuarios />
                </ThemeProvider>
            </main>
            <Footer />
        </div>
    )
}

export default PanelUsuarios;