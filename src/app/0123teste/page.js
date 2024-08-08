"use client"
import ImageUpload from "@/components/CloudinaryUpload";
import NumberInput from "@/components/Form/NumberInput";
import PriceInput from "@/components/Form/PriceInput";
import { useState } from "react";


export default function TestPage() {
    const [preco, setPreco] = useState(0);

    return (
        <div>
            <label htmlFor="preco">Preço:</label>
            <PriceInput
                id="preco"
                value={preco}
                onChange={(valor) => setPreco(valor)}
            />
        </div>
    );
}