'use client';

import { wsApiUrl } from '@/config/api';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Toast from '@/components/Toast';
import { useCesto } from '@/context/CestoContext';

export default function ClienteLayout({ children }) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const { setCesto } = useCesto();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const ws = new WebSocket(`${wsApiUrl}?token=${token}`);

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'pedidoRetirado') {
                    setToastMessage('Seu pedido foi retirado!');
                    setToastType('success');
                    setShowToast(true);

                    setTimeout(() => {
                        setShowToast(false);
                    }, 5000);
                } else if (message.type === 'cestoAtualizado') {
                    setCesto(message.cesto);

                    if (!pathname.startsWith('/lanchonete/')) {
                        setToastMessage('Lanche adicionado no cesto!');
                        setToastType('success');
                        setShowToast(true);

                        setTimeout(() => {
                            setShowToast(false);
                        }, 5000);
                    }
                }
            };

            return () => {
                ws.close();
            };
        }
    }, [setCesto, pathname]);

    return (
        <div>
            {children}
            {showToast && <Toast type={toastType} message={toastMessage} />}
        </div>
    );
}
