import styles from './Input.module.css'

export default function NumberInput({ id, label, placeholder, value, onChange, required = false }) {
    return (
        <div className={styles.field}>
            <label htmlFor={id}>{label}</label>
            <input
                type="number"
                id={id}
                placeholder='0'
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
}
