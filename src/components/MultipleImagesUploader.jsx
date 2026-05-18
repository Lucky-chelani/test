import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiImage, FiX, FiStar, FiCheck, FiAlertTriangle } from 'react-icons/fi';

/* ==========================================================================
   STYLED COMPONENTS (Premium Modern UI)
   ========================================================================== */
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UploaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.$isDragging ? '#10b981' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.$isDragging ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0, 0, 0, 0.25)'};
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
  
  &:hover {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.$isDragging ? '#10b981' : '#8b5cf6'};
  margin-bottom: 12px;
  transition: color 0.3s ease;
`;

const UploadText = styled.p`
  margin: 0 0 8px 0;
  color: #f8fafc;
  font-size: 1.1rem;
  font-weight: 700;
`;

const UploadSubtext = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
`;

const SelectButton = styled.button`
  margin-top: 16px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ImagePreviewsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 10px;
`;

const ImagePreviewWrapper = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background-color: #1e293b;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid ${props => props.$isCover ? '#10b981' : 'transparent'};
  
  ${props => props.$isCover && `
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0; 
  transition: opacity 0.2s ease;
  
  ${ImagePreviewWrapper}:hover & {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
    background: linear-gradient(to bottom, rgba(15,23,42,0.8) 0%, transparent 50%);
    justify-content: flex-start;
    padding-top: 10px;
  }
`;

const CoverBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #10b981;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const ActionButton = styled.button`
  background: ${props => props.$danger ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'};
  color: white;
  border: 1px solid ${props => props.$danger ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.2s;
  
  &:hover {
    background: ${props => props.$danger ? '#dc2626' : '#8b5cf6'};
    border-color: ${props => props.$danger ? '#dc2626' : '#8b5cf6'};
    transform: scale(1.05);
  }

  @media (hover: none) {
    width: 32px;
    height: 32px;
    padding: 0;
    justify-content: center;
    span { display: none; } /* Hide text on mobile to save space */
  }
`;

const Notification = styled(motion.div)`
  color: ${props => props.$type === 'error' ? '#ef4444' : '#10b981'};
  background: ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  border: 1px solid ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

/* ==========================================================================
   MAIN COMPONENT LOGIC
   ========================================================================== */
const MultipleImagesUploader = ({ 
  onImagesChange,
  initialImages = [],
  initialCoverIndex = 0,
  maxSize = 10, // INCREAED TO 10MB
  maxFiles = 10
}) => {
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(initialCoverIndex || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  const fileInputRef = useRef(null);

  // Initialize perfectly on mount
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      const formattedImages = initialImages.map((img, idx) => ({
        id: `init-${idx}-${Date.now()}`,
        file: typeof img === 'string' ? null : img,
        url: typeof img === 'string' ? img : URL.createObjectURL(img)
      }));
      setImages(formattedImages);
    }
  }, []);

  const triggerNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000);
  };

  // Safe callback to parent (Fixes the object vs array bug!)
  const notifyParent = (newImagesList, newCoverIdx) => {
    // Extract back to just strings or Files for TrekAdmin.jsx
    const rawFilesOrUrls = newImagesList.map(item => item.file ? item.file : item.url);
    // Send exact two arguments: (imagesArray, coverIndex)
    onImagesChange(rawFilesOrUrls, newCoverIdx);
  };

  const processFiles = (filesList) => {
    const newFiles = Array.from(filesList);
    let validCount = 0;
    const currentCount = images.length;
    
    if (currentCount >= maxFiles) {
      return triggerNotify(`Maximum of ${maxFiles} images reached.`, 'error');
    }

    const processedImages = [];
    const maxBytes = maxSize * 1024 * 1024;

    for (let file of newFiles) {
      if (currentCount + validCount >= maxFiles) break;

      if (!file.type.startsWith('image/')) {
        triggerNotify('Only image files (JPG, PNG, WEBP) are allowed.', 'error');
        continue;
      }

      if (file.size > maxBytes) {
        triggerNotify(`File "${file.name}" exceeds the ${maxSize}MB limit.`, 'error');
        continue;
      }

      processedImages.push({
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        file: file,
        url: URL.createObjectURL(file)
      });
      validCount++;
    }

    if (processedImages.length > 0) {
      const updatedImages = [...images, ...processedImages];
      const newCoverIndex = updatedImages.length === processedImages.length ? 0 : coverIndex;
      
      setImages(updatedImages);
      setCoverIndex(newCoverIndex);
      notifyParent(updatedImages, newCoverIndex);
      
      triggerNotify(`${processedImages.length} image(s) added successfully.`);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Safe file select (No .focus() crash)
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Clear input so same file can be uploaded again if deleted
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Safe click trigger (Fault Tolerant against null refs)
  const triggerFileSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Only click, NEVER focus()
    } else {
      triggerNotify("File uploader is initializing, please try again.", 'error');
    }
  };

  const removeImage = (e, indexToRemove) => {
    e.preventDefault();
    e.stopPropagation();

    // Revoke memory
    if (images[indexToRemove].file) {
      URL.revokeObjectURL(images[indexToRemove].url);
    }

    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    let newCoverIndex = coverIndex;

    // Shift cover index safely
    if (coverIndex === indexToRemove) {
      newCoverIndex = 0;
    } else if (coverIndex > indexToRemove) {
      newCoverIndex = coverIndex - 1;
    }

    setImages(updatedImages);
    setCoverIndex(newCoverIndex);
    notifyParent(updatedImages, newCoverIndex);
  };

  const setAsCover = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCoverIndex(index);
    notifyParent(images, index);
  };

  return (
    <Container>
      <UploaderHeader>
        <Title>
          <FiImage color="#8b5cf6" />
          Gallery Assets ({images.length}/{maxFiles})
        </Title>
      </UploaderHeader>
      
      {images.length < maxFiles && (
        <UploadArea 
          onClick={triggerFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          $isDragging={isDragging}
        >
          <UploadIcon $isDragging={isDragging}>
            <FiUploadCloud />
          </UploadIcon>
          <UploadText>Click or drop images here</UploadText>
          <UploadSubtext>JPG, PNG, or WEBP (max. {maxSize}MB per file)</UploadSubtext>
          
          <SelectButton type="button" onClick={triggerFileSelect}>
            Select Files
          </SelectButton>
          
          <FileInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
          />
        </UploadArea>
      )}

      <AnimatePresence>
        {notification.message && (
          <Notification 
            $type={notification.type}
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {notification.type === 'error' ? <FiAlertTriangle /> : <FiCheck />}
            {notification.message}
          </Notification>
        )}
      </AnimatePresence>
      
      {images.length > 0 && (
        <ImagePreviewsContainer>
          <AnimatePresence>
            {images.map((image, index) => (
              <ImagePreviewWrapper 
                key={image.id}
                $isCover={index === coverIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {index === coverIndex && (
                  <CoverBadge><FiStar size={12} /> Cover</CoverBadge>
                )}
                
                <img src={image.url} alt={`Gallery Asset ${index + 1}`} />
                
                <ImageOverlay>
                  {index !== coverIndex && (
                    <ActionButton type="button" onClick={(e) => setAsCover(e, index)}>
                      <FiStar size={14} /> <span>Make Cover</span>
                    </ActionButton>
                  )}
                  <ActionButton type="button" $danger onClick={(e) => removeImage(e, index)}>
                    <FiX size={14} /> <span>Remove</span>
                  </ActionButton>
                </ImageOverlay>
              </ImagePreviewWrapper>
            ))}
          </AnimatePresence>
        </ImagePreviewsContainer>
      )}
    </Container>
  );
};

export default MultipleImagesUploader;