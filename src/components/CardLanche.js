import Link from "next/link";
import styles from './CardLanche.module.css'

export default function CardLanche({ id, nome, preco, imagem, url }) {
    return (
        <Link href={url || `/lanche/${id}`} key={id} className={styles.card}>
            <div className={styles.cardImage}>
                <img src={imagem} alt={nome} />
            </div>
            <div className={styles.divInfo}>
                <h3>{nome}</h3>
                <h2>R$ {preco.toFixed(2)}</h2>
            </div>
        </Link>
    )
}