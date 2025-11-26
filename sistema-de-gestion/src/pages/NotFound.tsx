export default function NotFound404() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <div className="text-center animate-pulse">

                <h1 className="text-6xl font-bold mb-4 text-neon-pink drop-shadow-[0_0_18px_#ff00ff]">
                    404
                </h1>
                <p className="text-xl text-neon-blue font-light drop-shadow-[0_0_12px_#00eaff]">
                    Página no encontrada
                </p>
            </div>

            <p className="mt-8 text-neon-green drop-shadow-[0_0_10px_#39ff14]">
                Parece que esta sección del sistema no existe o fue movida.
            </p>

            <a
                href="/"
                className="mt-10 px-6 py-3 bg-neon-pink text-black font-semibold rounded-xl shadow-[0_0_15px_#ff00ff] hover:bg-neon-blue hover:shadow-[0_0_20px_#00eaff] transition-all"
            >
                Volver al inicio
            </a>
        </div>
    );
}
