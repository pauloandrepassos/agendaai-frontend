'use client';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';
import styles from './CloudinaryUpload.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function CloudinaryUpload({ onURLChange, defaultImage, width, height }) {
  const [imageSelected, setImageSelected] = useState(defaultImage || null);

  function handleUploadSuccess(result) {
    const imageUrl = result.info.secure_url;
    console.log(imageUrl);
    if (onURLChange) {
      onURLChange(imageUrl);
    } else {
      console.warn(
        'Você precisa passar a prop onChange para o formulário de cadastro'
      );
    }
    console.log('Upload bem-sucedido. URL da imagem:', imageUrl);

    setImageSelected(imageUrl);
  }

  return (
    <div className={styles.cloudinary}>
      {imageSelected && (
        <div className={styles.image}>
          <Image
            src={imageSelected}
            alt="Imagem Selecionada"
            width={width}
            height={height}
            style={{ borderRadius: '5px' }}
          />
        </div>
      )}
      {!imageSelected && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={handleUploadSuccess}
          options={{
            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
            cropping: true, // Ativar recorte
            showSkipCropButton: false, // Desativar botão de pular recorte
            croppingAspectRatio: width / height, // Manter proporção
            croppingShowDimensions: true, // Mostrar dimensões do recorte
            sources: ['local']
          }}
        >
          {({ open }) => {
            function handleOnClick(e) {
              e.preventDefault();
              open();
            }

            return (
              <button
                className={styles.upload}
                style={{ width: `${width}px`, height: `${height}px` }}
                onClick={handleOnClick}
              >
                <FontAwesomeIcon icon={faUpload} className={styles.icon}/>
                Enviar imagem
              </button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}

export default CloudinaryUpload;

{/*
  my files, web addres, camera, google drive, dropbox, shutterstock, gettyimages, istock e unsplash
  */}
