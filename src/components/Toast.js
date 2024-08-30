import Link from 'next/link';
import styles from './Toast.module.css';

const Toast = ({ message, type, link }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <p>{message}</p>
      {link && (
        <Link className={styles.link} href={link}>Ver cesto</Link>
      )}
    </div>
  );
};

export default Toast;
