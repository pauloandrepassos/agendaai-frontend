"use client"
import { createContext, useContext, useState } from 'react';

const IdContextLanchonete = createContext();

export function useIdLanchonete() {
    return useContext(IdContextLanchonete);
}

export function IdLanchoneteProvider({ children }) {
    const [idLanchonete, setIdLanchonete] = useState(null);

    return (
        <IdContextLanchonete.Provider value={{ idLanchonete, setIdLanchonete }}>
            {children}
        </IdContextLanchonete.Provider>
    );
}
