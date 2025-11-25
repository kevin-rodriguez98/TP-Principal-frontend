

export interface Posiciones {
    [key: string]: { x: number; y: number };
}
export interface Estante {
    id: string;
    sectorId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    posiciones: Posiciones;
}

export type Sector = {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};



export const SECTORES: Sector[] = [
    { id: "recepcion", name: "Recepción", x: 20, y: 20, width: 350, height: 150, color: "#FFE9C6" },
    { id: "camara-mp", name: "Cámara Insumos (Frío)", x: 400, y: 20, width: 300, height: 150, color: "#CFEFFF" },
    { id: "camara-pt", name: "Cámara Prod. Terminados", x: 740, y: 20, width: 300, height: 150, color: "#D8F5D8" },
    { id: "packaging", name: "Depósito Packaging", x: 20, y: 200, width: 350, height: 220, color: "#F3DCFF" },
    { id: "insumos-secos", name: "Depósito Insumos Secos", x: 400, y: 200, width: 640, height: 220, color: "#FFF9CC" },
    { id: "despacho", name: "Área Despacho", x: 20, y: 440, width: 1020, height: 150, color: "#FFD6D6" },
];

export const ESTANTES: Estante[] = [
    // ===================== RECEPCIÓN MP =====================
    {
        id: "rec-1",
        sectorId: "recepcion",
        x: 40,
        y: 60,
        width: 140,
        height: 60,
        posiciones: {
            A1: { x: 20, y: 20 },
            A2: { x: 60, y: 20 },
            A3: { x: 100, y: 20 },
        },
    },
    {
        id: "rec-2",
        sectorId: "recepcion",
        x: 200,
        y: 60,
        width: 140,
        height: 60,
        posiciones: {
            A1: { x: 20, y: 20 },
            A2: { x: 60, y: 20 },
            A3: { x: 100, y: 20 },
        },
    },

    // ===================== CÁMARA MP (FRÍO) =====================
    {
        id: "cm-1",
        sectorId: "camara-mp",
        x: 420,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            B1: { x: 20, y: 20 },
            B2: { x: 60, y: 20 },
        },
    },
    {
        id: "cm-2",
        sectorId: "camara-mp",
        x: 560,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            B1: { x: 20, y: 20 },
            B2: { x: 60, y: 20 },
        },
    },

    // ===================== CÁMARA PRODUCTOS TERMINADOS =====================
    {
        id: "p-1",
        sectorId: "camara-pt",
        x: 760,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            C1: { x: 20, y: 20 },
            C2: { x: 60, y: 20 },
        },
    },
    {
        id: "p-2",
        sectorId: "camara-pt",
        x: 900,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            C1: { x: 20, y: 20 },
            C2: { x: 60, y: 20 },
        },
    },

    // ===================== DEPÓSITO PACKAGING =====================
    {
        id: "pack-1",
        sectorId: "packaging",
        x: 40,
        y: 240,
        width: 140,
        height: 70,
        posiciones: {
            D1: { x: 20, y: 20 },
            D2: { x: 60, y: 20 },
            D3: { x: 100, y: 20 },
        },
    },
    {
        id: "pack-2",
        sectorId: "packaging",
        x: 200,
        y: 240,
        width: 140,
        height: 70,
        posiciones: {
            D1: { x: 20, y: 20 },
            D2: { x: 60, y: 20 },
            D3: { x: 100, y: 20 },
        },
    },
    {
        id: "pack-3",
        sectorId: "packaging",
        x: 40,
        y: 330,
        width: 140,
        height: 70,
        posiciones: {
            D4: { x: 20, y: 20 },
            D5: { x: 60, y: 20 },
            D6: { x: 100, y: 20 },
        },
    },
    {
        id: "pack-4",
        sectorId: "packaging",
        x: 200,
        y: 330,
        width: 140,
        height: 70,
        posiciones: {
            D4: { x: 20, y: 20 },
            D5: { x: 60, y: 20 },
            D6: { x: 100, y: 20 },
        },
    },

    // ===================== INSUMOS SECOS =====================
    {
        id: "ins-1",
        sectorId: "insumos-secos",
        x: 420,
        y: 240,
        width: 160,
        height: 70,
        posiciones: {
            E1: { x: 20, y: 20 },
            E2: { x: 60, y: 20 },
            E3: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-2",
        sectorId: "insumos-secos",
        x: 600,
        y: 240,
        width: 160,
        height: 70,
        posiciones: {
            E1: { x: 20, y: 20 },
            E2: { x: 60, y: 20 },
            E3: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-3",
        sectorId: "insumos-secos",
        x: 780,
        y: 240,
        width: 160,
        height: 70,
        posiciones: {
            E1: { x: 20, y: 20 },
            E2: { x: 60, y: 20 },
            E3: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-4",
        sectorId: "insumos-secos",
        x: 420,
        y: 330,
        width: 160,
        height: 70,
        posiciones: {
            E4: { x: 20, y: 20 },
            E5: { x: 60, y: 20 },
            E6: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-5",
        sectorId: "insumos-secos",
        x: 600,
        y: 330,
        width: 160,
        height: 70,
        posiciones: {
            E4: { x: 20, y: 20 },
            E5: { x: 60, y: 20 },
            E6: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-6",
        sectorId: "insumos-secos",
        x: 780,
        y: 330,
        width: 160,
        height: 70,
        posiciones: {
            E4: { x: 20, y: 20 },
            E5: { x: 60, y: 20 },
            E6: { x: 100, y: 20 },
        },
    },

    // ===================== DESPACHO =====================
    {
        id: "desp-1",
        sectorId: "despacho",
        x: 40,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
    {
        id: "desp-2",
        sectorId: "despacho",
        x: 260,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
    {
        id: "desp-3",
        sectorId: "despacho",
        x: 480,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
    {
        id: "desp-4",
        sectorId: "despacho",
        x: 700,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
];