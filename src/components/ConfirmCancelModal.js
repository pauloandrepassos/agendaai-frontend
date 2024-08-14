import styles from './ConfirmCancelModal.module.css'

export default function ConfirmCancelModal({ visible, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar" }) {
    if (!visible) return null

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button onClick={onCancel} className={styles.cancelButton}>{cancelText}</button>
                    <button onClick={onConfirm} className={styles.confirmButton}>{confirmText}</button>
                </div>
            </div>
        </div>
    )
}
