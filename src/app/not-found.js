// /app/not-found.js
import Link from 'next/link';
import styles from './page.module.css'

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1>404 - Página Não Encontrada</h1>
      <p>Oops! A página que você está procurando não existe.</p>
      <Link href="/">
        Voltar para a página inicial
      </Link>
    </div>
  );
}
