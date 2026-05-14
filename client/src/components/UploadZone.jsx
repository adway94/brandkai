import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadZone({ image, onImageChange }) {
  const onDrop = useCallback((accepted) => {
    const file = accepted[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    onImageChange({ file, preview })
  }, [onImageChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      style={{
        ...styles.zone,
        borderColor: isDragActive ? '#6366f1' : '#333',
        background: isDragActive ? '#1a1a2e' : '#1a1a1a',
      }}
    >
      <input {...getInputProps()} />

      {image ? (
        <div style={styles.preview}>
          <img src={image.preview} alt="Ad a analizar" style={styles.img} />
          <p style={styles.changeHint}>Hacé clic o arrastrá para cambiar la imagen</p>
        </div>
      ) : (
        <div style={styles.placeholder}>
          <span style={styles.icon}>🖼</span>
          <p style={styles.text}>
            {isDragActive ? 'Soltá la imagen acá' : 'Arrastrá una imagen o hacé clic para seleccionar'}
          </p>
          <p style={styles.hint}>JPG, PNG, WEBP o GIF · Máx 5MB</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  zone: {
    border: '2px dashed',
    borderRadius: 12,
    padding: 24,
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    textAlign: 'center',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '20px 0',
  },
  icon: {
    fontSize: 40,
  },
  text: {
    color: '#ccc',
    fontSize: 15,
  },
  hint: {
    color: '#555',
    fontSize: 13,
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  img: {
    maxHeight: 280,
    maxWidth: '100%',
    borderRadius: 8,
    objectFit: 'contain',
  },
  changeHint: {
    color: '#555',
    fontSize: 13,
  },
}
