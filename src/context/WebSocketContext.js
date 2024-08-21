'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { wsApiUrl } from '@/config/api';

const WebSocketContext = createContext();

export function useWebSocket() {
    return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
    const [cesto, setCesto] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const ws = new WebSocket(`${wsApiUrl}?token=${token}`);

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'cestoAtualizado') {
                    setCesto(message.cesto);
                    setToastMessage("Lanche adicionado no cesto!");
                    setToastType("success");
                    setShowToast(true);

                    setTimeout(() => {
                        setShowToast(false);
                    }, 5000);
                } else if (message.type === 'pedidoRetirado') {
                    setToastMessage("Seu pedido foi retirado!");
                    setToastType("success");
                    setShowToast(true);

                    setTimeout(() => {
                        setShowToast(false);
                    }, 5000);
                }
            };

            return () => {
                ws.close();
            };
        }
    }, []);

    return (
        <WebSocketContext.Provider value={{ cesto, showToast, toastMessage, toastType }}>
            {children}
        </WebSocketContext.Provider>
    );
}
