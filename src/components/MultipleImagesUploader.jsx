import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiImage, FiX, FiStar, FiCheck, FiAlertTriangle } from 'react-icons/fi';

const Container = styled.div`
  margin-bottom: 20px;
`;

const UploaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
`;

const UploadText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

const UploadSubtext = styled.p`
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
`;

const FileInput = styled.input`
  display: none;
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

const ImagePreviewsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ImagePreviewWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 3/2;
  background-color: #2a3446;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  ${props => props.isCover && `
    border: 3px solid #4cc9f0;
    transform: scale(1.02);
  `}
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* DEFAULT: Hidden (for desktop mouse users) */
  opacity: 0; 
  transition: opacity 0.3s ease;
  
  /* SHOW ON HOVER (Mouse) */
  ${ImagePreviewWrapper}:hover & {
    opacity: 1;
  }

  /* CRITICAL FIX: SHOW ALWAYS ON TOUCH DEVICES */
  @media (hover: none) {
    opacity: 1;
    background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%);
    justify-content: flex-start; /* Move buttons to top so image is visible */
    padding-top: 10px;
  }
`;

const ImageActions = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
`;

const CoverBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #4cc9f0;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.danger ? 'rgba(220, 38, 38, 0.8)' : props.primary ? 'rgba(79, 70, 229, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

`;

const ProgressContainer = styled.div`
  margin-top: 20px;
`;

const ProgressBar = styled.div`
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, #4cc9f0, #7209b7);
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #f87171;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusMessage = styled.div`
  color: ${props => props.type === 'success' ? '#10b981' : '#f87171'};
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/**
 * Multiple Images Uploader Component
 * @param {Object} props - Component props
 * @param {Function} props.onImagesChange - Callback when images are added, removed, or cover is changed
 * @param {Array<Object>} props.initialImages - Initial images list (optional)
 * @param {string} props.maxSize - Maximum file size in MB (default: "5")
 * @param {number} props.maxFiles - Maximum number of files allowed (default: 10)
 */
const MultipleImagesUploader = ({ 
  onImagesChange,
  initialImages = [],
  maxSize = 5,
  maxFiles = 10
}) => {
  const [images, setImages] = useState(initialImages);
  const [coverIndex, setCoverIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileSelect = (e) => {
    console.log("File selection triggered", e);
    
    // Prevent any accidental form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!e || !e.target || !e.target.files) {
      setError("No files were selected or the browser doesn't support the File API");
      return;
    }
    
    const files = Array.from(e.target.files);
    console.log(`${files.length} files selected`, files);
    
    if (!files.length) {
      console.log("No files in selection");
      return;
    }
    
    if (images.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images. Please select fewer files.`);
      return;
    }
    
    setError('');
    setStatus('Processing images...');
    
    const newImages = [];
    const maxSizeBytes = maxSize * 1024 * 1024;
    
    // Process each file
    files.forEach(file => {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('One or more files are not valid images. Please select only JPG, PNG, or WEBP files.');
        return;
      }
      
      // Validate file size
      if (file.size > maxSizeBytes) {
        setError(`One or more files exceed the maximum size limit of ${maxSize}MB.`);
        return;
      }
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      
      newImages.push({
        file,
        preview: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        id: Date.now() + Math.random().toString(36).substr(2, 9)
      });
    });
    
    // Add new images to state
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    
    // If this is the first image, set it as cover
    if (images.length === 0 && newImages.length > 0) {
      setCoverIndex(0);
    }
    
    // Extract the files in the format needed by the parent component
    const imageFilesForParent = updatedImages.map(img => {
      // If it's just a string URL, return it directly
      if (typeof img === 'string') return img;
      // If it's a file object wrapped in our preview object, return the file
      if (img.file instanceof File) return img.file;
      // Otherwise return the original object
      return img;
    });
    
    console.log("Images to pass to parent:", updatedImages);
    
    // Notify parent component
    onImagesChange({
      images: updatedImages,
      coverIndex: images.length === 0 ? 0 : coverIndex
    });
    
    // Set success status
    if (newImages.length > 0) {
      setStatus(`${newImages.length} image${newImages.length > 1 ? 's' : ''} added successfully`);
      setTimeout(() => setStatus(''), 3000);
    }
    
    // Clear input value to allow selecting the same file again
    if (e.target && e.target.value !== undefined) {
      e.target.value = '';
    }
  };
  
  // Remove an image by index
  const removeImage = (indexToRemove) => {
    // Revoke preview URL to prevent memory leak
    if (images[indexToRemove]?.preview) {
      URL.revokeObjectURL(images[indexToRemove].preview);
    }
    
    // Remove the image
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    
    // Update cover index if needed
    if (coverIndex === indexToRemove) {
      // Set the first image as cover if exists, otherwise reset to 0
      const newCoverIndex = updatedImages.length > 0 ? 0 : 0;
      setCoverIndex(newCoverIndex);
    } else if (coverIndex > indexToRemove) {
      // Adjust cover index when removing an image before the cover
      setCoverIndex(coverIndex - 1);
    }
    
    // Extract the files in the format needed by the parent component
    const imageFilesForParent = updatedImages.map(img => {
      // If it's just a string URL, return it directly
      if (typeof img === 'string') return img;
      // If it's a file object wrapped in our preview object, return the file
      if (img.file instanceof File) return img.file;
      // Otherwise return the original object
      return img;
    });
    
    console.log("Images after removal:", imageFilesForParent);
    
    // Notify parent component with the new cover index logic
    const newCoverIndex = updatedImages.length > 0 
      ? (coverIndex >= indexToRemove ? Math.max(0, coverIndex - 1) : coverIndex) 
      : 0;
    
    onImagesChange({
      images: updatedImages,
      coverIndex: newCoverIndex
    });
  };
  
  // Set an image as cover
  const setAsCover = (index) => {
    setCoverIndex(index);
    
    // Extract the files in the format needed by the parent component
    const imageFilesForParent = images.map(img => {
      // If it's just a string URL, return it directly
      if (typeof img === 'string') return img;
      // If it's a file object wrapped in our preview object, return the file
      if (img.file instanceof File) return img.file;
      // Otherwise return the original object
      return img;
    });
    
    console.log("Images after setting cover:", imageFilesForParent);
    
    // Notify parent component
    onImagesChange({
      images: images,
      coverIndex: index
    });
    
    setStatus('Cover image updated');
    setTimeout(() => setStatus(''), 2000);
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        dataTransfer.items.add(e.dataTransfer.files[i]);
      }
      
      // Create a fake event object to reuse handleFileSelect
      const fakeEvent = { target: { files: dataTransfer.files } };
      handleFileSelect(fakeEvent);
    }
  };
  
  // Function to trigger file selection dialog
  const triggerFileSelect = (e) => {
    if (e) {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Stop event propagation to parent elements
    }
    
    // Log for debugging
    console.log("Upload area clicked, triggering file select");
    
    // Ensure the ref exists before trying to use it
    if (fileInputRef && fileInputRef.current) {
      // Direct click approach
      fileInputRef.current.click();
      
      // Secondary focus+click approach as fallback
      setTimeout(() => {
        fileInputRef.current.focus();
        fileInputRef.current.click();
      }, 50);
    } else {
      console.error("File input reference is not available");
    }
  };

  return (
    <Container>
      <UploaderHeader>
        <Title>
          <FiImage />
          Trek Images ({images.length}/{maxFiles})
        </Title>
      </UploaderHeader>
      
      {images.length < maxFiles && (
        <UploadArea 
          onClick={triggerFileSelect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <UploadIcon>
            <FiUpload />
          </UploadIcon>
          <UploadText>Click or drop images here to upload</UploadText>
          <UploadSubtext>
            JPG, PNG, or WEBP (max. {maxSize}MB per file)
          </UploadSubtext>
          <button 
            onClick={triggerFileSelect}
            style={{
              marginTop: '15px',
              background: '#4cc9f0',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Select Images
          </button>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            name="trek-images"
            id="trek-images-upload"
            tabIndex="-1"
          />
        </UploadArea>
      )}
      
      {isUploading && (
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={uploadProgress} />
          </ProgressBar>
          <UploadSubtext>Uploading {Math.round(uploadProgress)}%</UploadSubtext>
        </ProgressContainer>
      )}
      
      {error && (
        <ErrorMessage>
          <FiAlertTriangle />
          {error}
        </ErrorMessage>
      )}
      
      {status && (
        <StatusMessage type="success">
          <FiCheck />
          {status}
        </StatusMessage>
      )}
      
      {images.length > 0 && (
        <ImagePreviewsContainer>
          {images.map((image, index) => (
            <ImagePreviewWrapper 
              key={image.id || index}
              isCover={index === coverIndex}
            >
              <ImagePreview 
                src={image.preview || image.url} 
                alt={`Trek image ${index + 1}`} 
              />
              
              {index === coverIndex && (
                <CoverBadge>
                  <FiStar size={12} />
                  Cover
                </CoverBadge>
              )}
              
              <ImageOverlay>
                <ImageActions>
                  {index !== coverIndex && (
                    <ActionButton 
                      onClick={() => setAsCover(index)}
                      title="Set as cover image"
                      primary
                    >
                      <FiStar size={14} />
                    </ActionButton>
                  )}
                  <ActionButton 
                    onClick={() => removeImage(index)} 
                    danger
                    title="Remove image"
                  >
                    <FiX size={14} />
                  </ActionButton>
                </ImageActions>
              </ImageOverlay>
            </ImagePreviewWrapper>
          ))}
        </ImagePreviewsContainer>
      )}
    </Container>
  );
};

export default MultipleImagesUploader;
