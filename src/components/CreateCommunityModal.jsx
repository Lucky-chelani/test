import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { FiX, FiMessageCircle, FiImage, FiMapPin, FiAlignLeft, FiUpload, FiCheck, FiAlertTriangle, FiLock } from 'react-icons/fi';
import { uploadImage, getCommunityImagePath } from '../utils/imageUtils/storage';

// Styled components for the modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #5390D9;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #5390D9;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    box-shadow: 0 0 0 2px rgba(83, 144, 217, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    box-shadow: 0 0 0 2px rgba(83, 144, 217, 0.2);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  input {
    width: 18px;
    height: 18px;
    accent-color: #5390D9;
  }
  
  label {
    font-weight: 500;
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }
`;

const CreateButton = styled(Button)`
  background-color: #5390D9;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #4a81c4;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  margin-top: 5px;
  font-size: 0.9rem;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 10px;
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover .image-overlay {
    opacity: 1;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: filter 0.2s;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 8px;
  
  button {
    background-color: #ffffff;
    color: #333;
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: #f0f7ff;
  color: #2563eb;
  border-radius: 8px;
  cursor: pointer;
  gap: 8px;
  font-weight: 500;
  border: 1px dashed #93c5fd;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e0f2fe;
    border-color: #60a5fa;
    transform: translateY(-1px);
  }
`;

const UploadProgressContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
`;

const UploadProgress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4CC9F0 0%, #7400B8 100%);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const UploadStatus = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.error ? '#ef4444' : '#10b981'};
  font-size: 0.9rem;
`;

const CreateCommunityModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    featured: false
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  const fileInputRef = useRef(null);
  
  // Check if current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setCheckingAdmin(true);
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }
        
        // Trusted admin email
        if (currentUser.email === 'luckychelani950@gmail.com') {
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }
        
        // Check Firestore for admin role
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          console.warn('Non-admin user attempted to access community creation modal');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    if (isOpen) {
      checkAdminStatus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Show loading or access denied for non-admins
  if (checkingAdmin) {
    return (
      <ModalOverlay>
        <ModalContainer style={{ maxWidth: '400px', textAlign: 'center', padding: '40px 20px' }}>
          <p>Checking permissions...</p>
        </ModalContainer>
      </ModalOverlay>
    );
  }
  
  if (!isAdmin) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContainer style={{ maxWidth: '400px', textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '40px', color: '#e53e3e', marginBottom: '20px' }}>
            <FiLock />
          </div>
          <h3 style={{ marginBottom: '15px' }}>Access Denied</h3>
          <p style={{ marginBottom: '20px' }}>
            Only administrators can create communities.
          </p>
          <Button type="button" onClick={onClose} style={{ margin: '0 auto' }}>
            Close
          </Button>
        </ModalContainer>
      </ModalOverlay>
    );
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File is too large. Please select an image under 5MB.');
      return;
    }
    
    setSelectedFile(file);
    setUploadError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image file first.');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      
      // Generate a temporary ID for the storage path
      const tempId = `temp-${Date.now()}`;
      const path = getCommunityImagePath(tempId);
      
      console.log(`Uploading image to path: ${path}`);
      
      // Add admin metadata
      const currentUser = auth.currentUser;
      const metadata = {
        adminUpload: 'true',
        createdBy: currentUser ? currentUser.uid : 'admin',
        createdAt: new Date().toISOString()
      };
      
      console.log('Adding admin metadata:', metadata);
      
      // Upload image with progress tracking and admin metadata
      const imageUrl = await uploadImage(
        selectedFile,
        path,
        (progress) => {
          console.log(`Upload progress: ${progress}%`);
          setUploadProgress(progress);
        },
        metadata
      );
      
      console.log(`Upload complete. Image URL: ${imageUrl}`);
      
      // Update form data with the image URL
      setFormData({
        ...formData,
        imageUrl
      });
      
      setIsUploading(false);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      ...formData,
      imageUrl: ''
    });
    setUploadProgress(0);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Double check admin status before submitting
    if (!isAdmin) {
      setErrors({
        submit: 'Only administrators can create communities.'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setUploadError(null);
      setErrors({});
      
      // If there's a selected file but it hasn't been uploaded yet, upload it now
      let finalImageUrl = formData.imageUrl;
      if (selectedFile && !formData.imageUrl) {
        try {
          setIsUploading(true);
          console.log('Uploading image during form submission...');
          
          const currentUser = auth.currentUser;
          const tempId = `temp-${Date.now()}`;
          const path = getCommunityImagePath(tempId);
          
          const metadata = {
            adminUpload: 'true',
            createdBy: currentUser ? currentUser.uid : 'admin',
            createdAt: new Date().toISOString()
          };
          
          console.log('Uploading with admin metadata:', metadata);
          
          finalImageUrl = await uploadImage(
            selectedFile, 
            path, 
            (progress) => {
              console.log(`Upload progress during submission: ${progress}%`);
              setUploadProgress(progress);
            },
            metadata
          );
          
          console.log(`Image upload during submission complete. URL: ${finalImageUrl}`);
          setIsUploading(false);
          
        } catch (uploadError) {
          console.error('Error uploading image during submission:', uploadError);
          setErrors({
            submit: 'Failed to upload image. Please try again.'
          });
          setIsUploading(false);
          setSubmitting(false);
          return;
        }
      }
      
      // Create a unique ID for the community
      const uniqueId = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + 
        '-' + Date.now().toString().substring(7); // Add a timestamp suffix for uniqueness
      
      // Add document to Firestore
      const newCommunity = {
        name: formData.name,
        desc: formData.description,
        location: formData.location || null,
        img: finalImageUrl || null,
        id: uniqueId,
        members: [],
        memberCount: 0,
        messageCount: 0,
        featured: formData.featured,
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      };
      
      console.log('Creating new community document with data:', JSON.stringify(newCommunity));
      
      const docRef = await addDoc(collection(db, 'chatrooms'), newCommunity);
      
      console.log('Community created with ID:', docRef.id);
      
      // Call the success callback with the created community
      if (onSuccess) {
        onSuccess({
          ...newCommunity,
          docId: docRef.id
        });
      }
      
      onClose(); // Close modal on success
      
    } catch (error) {
      console.error('Error creating community:', error);
      setErrors({
        submit: error.message || 'Failed to create community. Please try again.'
      });
      setSubmitting(false);
    }
  };
  
  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <FiMessageCircle />
            Create New Community
          </ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close">
            <FiX />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="name">
                <FiMessageCircle />
                Community Name*
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter community name"
                maxLength={100}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="location">
                <FiMapPin />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where is this community based? (Optional)"
                maxLength={100}
              />
              {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="description">
                <FiAlignLeft />
                Description*
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this community is about"
                maxLength={500}
              />
              {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="imageUpload">
                <FiImage />
                Community Image
              </Label>
              
              <FileInput 
                type="file" 
                id="imageUpload" 
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleFileSelect} 
              />
              
              {!previewUrl ? (
                <FileInputLabel htmlFor="imageUpload">
                  <FiUpload />
                  Select image file (JPEG, PNG) - Max 5MB
                </FileInputLabel>
              ) : (
                <ImagePreviewContainer>
                  <ImagePreview src={previewUrl} alt="Preview" />
                  <ImageOverlay className="image-overlay">
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      <FiUpload />
                    </button>
                    <button type="button" onClick={removeImage}>
                      <FiX />
                    </button>
                  </ImageOverlay>
                </ImagePreviewContainer>
              )}
              
              {selectedFile && !formData.imageUrl && (
                <Button 
                  type="button" 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  style={{ marginTop: '10px' }}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              )}
              
              {isUploading && (
                <UploadProgressContainer>
                  <UploadProgress progress={uploadProgress} />
                </UploadProgressContainer>
              )}
              
              {uploadProgress === 100 && formData.imageUrl && (
                <UploadStatus>
                  <FiCheck /> Image uploaded successfully
                </UploadStatus>
              )}
              
              {uploadError && (
                <UploadStatus error>
                  <FiAlertTriangle /> {uploadError}
                </UploadStatus>
              )}
            </InputGroup>
            
            <Checkbox>
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">Make this community featured</label>
            </Checkbox>
            

            
            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
            
            <ButtonGroup>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <CreateButton type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Community'}
              </CreateButton>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateCommunityModal;
