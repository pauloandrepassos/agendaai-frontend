import React, { useState } from "react"

interface ImageUploadProps {
    label: string
    onChange: (file: FileList | null) => void
    error?: string
    height?: string
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, onChange, error, height = "11rem", disabled }) => {
    const [preview, setPreview] = useState<string | null>(null)

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files[0]) {
            const file = files[0]
            setPreview(URL.createObjectURL(file))
            onChange(files)
        }
    }

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium">{label}</label>
            <div
                className={`relative w-full border-dashed border-2 flex items-center justify-center rounded-lg ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
                style={{ height, zIndex: 1 }}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    disabled={disabled}
                />
                {preview ? (
                    <img
                        src={preview}
                        alt="Pré-visualização"
                        className="object-cover w-full h-full rounded-lg pointer-events-none"
                    />
                ) : (
                    <span className="text-gray-400">Clique para adicionar uma imagem</span>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}

export default ImageUpload