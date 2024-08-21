"use client"
import React, { createContext, useContext, useState } from 'react';

const CestoContext = createContext();

export function CestoProvider({ children }) {
    const [cesto, setCesto] = useState(null);

    return (
        <CestoContext.Provider value={{ cesto, setCesto }}>
            {children}
        </CestoContext.Provider>
    );
}

export function useCesto() {
    return useContext(CestoContext);
}
