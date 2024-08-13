'use client';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';
import styles from './CloudinaryUpload.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from '@/config/api';

function CloudinaryUploadUserImage({ token, onURLChange, defaultImage, width, height }) {
    const [imageSelected, setImageSelected] = useState(defaultImage || null);
    const [isEditing, setIsEditing] = useState(false);
    const [erro, setErro] = useState('não há erro')
  
    function handleUploadSuccess(result) {
      const imageUrl = result.info.secure_url;
      setImageSelected(imageUrl);
      setIsEditing(true);
    }
  
    function handleCancel() {
      setImageSelected(defaultImage);
      setIsEditing(false);
    }
  
    async function handleSave() {
      if (token && imageSelected) {
        try {
          const response = await fetch(`${apiUrl}/user/alterar-foto`, {
            method: "PUT",
            headers: {
              "token": `${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ imagem: imageSelected })
          });
  
          if (response.ok) {
            const updatedUser = await response.json();
            setIsEditing(false);
            if (onURLChange) onURLChange(updatedUser.user.imagem);
          } else {
            console.error("Erro ao salvar a imagem.");
            setErro('Erro ao salvar a imagem.')
          }
        } catch (error) {
            setErro(`Erro na requisição:", error`)
          console.error("Erro na requisição:", error);
        }
      }
    }
  
    return (
      <div className={styles.cloudinary}>
        {imageSelected && (
          <div className={styles.userImage}>
            <img src={imageSelected} alt="Imagem Selecionada" />
          </div>
        )}
  
        {!isEditing && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleUploadSuccess}
            options={{
              clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
              cropping: true,
              croppingAspectRatio: width / height,
              sources: ['local']
            }}
          >
            {({ open }) => (
              <button
                className={styles.uploadUserImage}
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
              >
                Alterar imagem
              </button>
            )}
          </CldUploadWidget>
        )}
  
        {isEditing && (
          <div className={styles.editOptions}>
            <button onClick={handleCancel} className={styles.cancelButton}>Cancelar</button>
            <button onClick={handleSave} className={styles.saveButton}>Salvar</button>
          </div>
        )}
      </div>
    );
  }
  

export default CloudinaryUploadUserImage;

{/*
  my files, web addres, camera, google drive, dropbox, shutterstock, gettyimages, istock e unsplash
  */}
