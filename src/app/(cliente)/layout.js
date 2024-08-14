'use client'

import { wsApiUrl } from '@/config/api'
import React, { useEffect, useState } from 'react'
import Toast from '@/components/Toast' // Certifique-se de ajustar o caminho para o seu componente Toast

export default function ClienteLayout({ children }) {
    const elementoTeste = 'asas'

    return (
        <div>
            {React.cloneElement(children, { elementoTeste })}
        </div>
    )
}
