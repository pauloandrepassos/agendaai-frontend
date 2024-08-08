import styles from './Input.module.css'

export default function SelectInput({ id, label, value, onChange, options, required = false }) {
    return (
        <div className={styles.field}>
            <label htmlFor={id}>{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Escolha o tipo do lanche</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}