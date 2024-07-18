"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { decodeToken, isTokenValid } from "@/services/Token";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function Home() {
  const [token, setToken] = useState('')
  const router = useRouter()
  
  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const { isValid, status } = isTokenValid(storedToken);
        if (isValid) {
          const decodedToken = decodeToken(storedToken);
          if (decodedToken) {
            switch (decodedToken.papel) {
              case "admin":
                router.push("/admin");
                break;
              case "gerente":
                router.push("/gerente");
                break;
              case "cliente":
                router.push("/home");
                break;
              default:
                router.push("/inicio");
                break;
            }
          }
        } else if (status === "expirado") {
          router.push("/auth/login");
        } else {
          router.push("/inicio");
        }
      } else {
        router.push("/inicio");
      }
    };
    fetchData();
  }, [router]);

  return (
    <main className={styles.main}>
      <Loading />
    </main>
  );
}
