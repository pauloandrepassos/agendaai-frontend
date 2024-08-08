import styles from './Input.module.css'

export default function TextInput({ id, label, value, onChange, required = false }) {
    return (
        <div className={styles.field}>
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                id={id}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
}

