import { useState, useEffect } from "react";
import styles from './Input.module.css';

function PriceInput({ label, value, onChange, currencySymbol = "R$", ...props }) {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // Define o valor inicial formatado ao montar o componente
        setInputValue(formatPrice(value || 0));
    }, [value]);

    function formatPrice(value) {
        if (isNaN(value)) value = 0;
        
        // Formata como moeda.
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        });
    }

    function handleChange(e) {
        const newValue = e.target.value;
        setInputValue(formatPrice(newValue));
        
        // Remove o símbolo de moeda para enviar o valor numérico para o onChange
        const numericValue = parseFloat(newValue.replace(/\D/g, "")) / 100;
        onChange(numericValue);
    }

    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input
                {...props}
                type="text"
                value={inputValue}
                onChange={handleChange}
                className={styles.priceInput}
            />
        </div>
    );
}

export default PriceInput;
