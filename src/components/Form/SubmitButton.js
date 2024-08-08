import styles from './Form.module.css'

export default function SubmitButton({ text, isLoading }) {
    return (
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Carregando...' : text}
        </button>
    );
}
