"use client"
import PrivateRouter from "@/components/PrivateRouter"
import styles from "./perfil.module.css"
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import { apiUrl } from "@/config/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import CloudinaryUploadUserImage from "@/components/CloudinaryUploadUserImage"

export default function UserProfilePage() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null)
  
    useEffect(() => {
      const fetchUserData = async () => {
        const storedToken = localStorage.getItem("token");
  
        if (storedToken) {
            setToken(storedToken)
          try {
            const response = await fetch(`${apiUrl}/user`, {
              method: "GET",
              headers: {
                "token": `${storedToken}`,
                "Content-Type": "application/json"
              }
            });
  
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              console.error("Erro ao buscar dados do usuário.");
            }
          } catch (error) {
            console.error("Erro na requisição:", error);
          }
        }
      };
  
      fetchUserData();
    }, []);
  
    function handleImageChange(newImageUrl) {
      setUser((prevUser) => ({ ...prevUser, imagem: newImageUrl }));
    }
  
    return (
      <PrivateRouter>
        <div className={styles.container}>
          <Navbar />
          <div className={styles.content}>
            {user ? (
              <div className={styles.userProfile}>
                <div className={styles.userImageContainer}>
                  {!user.imagem && (
                    <div className={styles.userImage}>
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                  <CloudinaryUploadUserImage
                    onURLChange={handleImageChange}
                    defaultImage={user.imagem}
                    width={200}
                    height={200}
                    token={token}
                  />
                </div>
                <div className={styles.userInfo}>
                  <h1>{user.nome}</h1>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Último Login:</strong> {user.ultimo_login ? new Date(user.ultimo_login).toLocaleString() : 'Nunca'}</p>
                  <p><strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                  <p><strong>Atualizado em:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p>Carregando informações do usuário...</p>
            )}
          </div>
        </div>
      </PrivateRouter>
    );
  }
  
