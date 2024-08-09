import styles from './LancheModal.module.css';
import Image from 'next/image';

export default function LancheModal({ lanche, onClose }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>{lanche.nome}</h2>
                <div className={styles.modalContent}>
                    <div className={styles.imageArea}>
                        <img src={lanche.imagem} alt={lanche.nome}/>
                    </div>
                    <div className={styles.infoArea}>
                        <p>{lanche.descricao}</p>
                        <p><strong>Preço: R$ {lanche.preco.toFixed(2)}</strong> </p>
                        <button onClick={onClose}>Adicionar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
