// components/OrderChart.tsx
"use client"; // Adicione isso se estiver usando Next.js 13+ com App Router

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Registre os componentes necessários do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface OrderChartProps {
    labels: string[];
    data: number[];
}

export default function OrderChart({ labels, data }: OrderChartProps) {
    const chartData = {
        labels: labels, // Dias, semanas ou meses
        datasets: [
            {
                label: "Pedidos",
                data: data, // Número de pedidos
                borderColor: "rgba(75, 192, 192, 1)", // Cor da linha
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Cor de fundo
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Pedidos ao Longo do Tempo",
            },
        },
    };

    return <Line data={chartData} options={options} />;
}