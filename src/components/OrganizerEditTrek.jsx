import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { uploadImage, uploadMultipleImages, deleteImage, getTrekImagePath } from '../utils/images';
import initializeCategories from '../utils/initializeCategories';
import { prepareTrekData, fetchOrganizerDetails } from '../utils/trekUtils';
import { FiUpload, FiImage, FiAlertTriangle, FiCheck, FiArrowLeft } from 'react-icons/fi';
import MultipleImagesUploader from './MultipleImagesUploader';
import ItineraryManager from './ItineraryManager';
import MonthAvailability from './MonthAvailability';
import DateAvailabilitySelector from './DateAvailabilitySelector';
import { FaMountain } from 'react-icons/fa';
import mapPattern from '../assets/images/map-pattren.png';

// Styled components (reusing styles from OrganizerAddTrek component)
const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-attachment: fixed; 
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 100px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(20, 30, 48, 0.92) 0%, rgba(0, 0, 0, 0.85) 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 2;
  color: #fff;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
`;

const Form = styled.form`
  background: rgba(30, 40, 60, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* FIX: Reduce internal form padding on mobile */
  @media (max-width: 480px) {
    padding: 20px 15px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #1a2234;
    color: #fff;
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ImagePreview = styled.div`
  margin-top: 16px;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${props => props.primary ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' : 'transparent'};
  color: #fff;
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'};
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #FF5252 0%, #FF6B6B 100%)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
  color: #fff;
  
  svg {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 87, 87, 0.2);
  border-left: 4px solid #FF5757;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(76, 175, 80, 0.2);
  border-left: 4px solid #4CAF50;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    flex-shrink: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 10px 0;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 20px;
  
  &:hover {
    color: #fff;
  }
`;

const OrganizerEditTrek = () => {
  const { id: trekId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [trekImages, setTrekImages] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [originalImageUrls, setOriginalImageUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    location: '',
    difficulty: 'medium',
    days: 1,
    category: '',
    price: 0,
    rating: 4.0,
    reviews: 0,
    status: 'active',
    itinerary: [],
    availableMonths: [],
    availableDates: [], // New field for specific available dates
    highlights: [],
    includedServices: [],
    excludedServices: [],
    equipmentNeeded: [],
    fitnessLevel: 'moderate',
    ageRestriction: { min: 12, max: 65 }
  });
  
  // Check authentication and authorization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Check if the user is an organizer
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (!userDoc.exists()) {
            setError('User profile not found.');
            setLoading(false);
            return;
          }
          
          const userData = userDoc.data();
          if (userData.role !== 'organizer' && userData.role !== 'admin') {
            setError('You do not have permission to edit treks.');
            setLoading(false);
            return;
          }
          
          // Fetch trek details
          const treksRef = collection(db, 'treks');
          const q = query(treksRef, where("id", "==", trekId));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            setError('Trek not found.');
            setLoading(false);
            return;
          }
          
          const trekDoc = querySnapshot.docs[0];
          const trekData = trekDoc.data();
          
          // Check if the user is the organizer of this trek or an admin
          if (trekData.organizerId !== currentUser.uid && userData.role !== 'admin') {
            setError('You do not have permission to edit this trek.');
            setLoading(false);
            return;
          }
          
          // Set form data from trek document
          setFormData({
            ...trekData,
            availableDates: trekData.availableDates || [], // Load existing available dates
          });
          
          // Load images
          if (trekData.imageUrls && trekData.imageUrls.length > 0) {
            // Handle multiple images
            const images = trekData.imageUrls.map((url, idx) => ({
              url,
              id: `existing-${idx}`,
              name: `Trek image ${idx + 1}`
            }));
            setTrekImages(images);
            setOriginalImageUrls(trekData.imageUrls);
            setCoverImageIndex(trekData.coverIndex || 0);
          } else if (trekData.image) {
            // Handle legacy single image
            setTrekImages([{
              url: trekData.image,
              id: 'existing-0',
              name: 'Trek image 1'
            }]);
            setOriginalImageUrls([trekData.image]);
          }
          
          // Load categories
          fetchCategories();
          
          setLoading(false);
        } catch (err) {
          console.error('Error loading trek:', err);
          setError('Error loading trek data.');
          setLoading(false);
        }
      } else {
        setUser(null);
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [trekId, navigate]);    const fetchCategories = async () => {
    try {
      setLoading(true);
      // This will initialize categories if they don't exist yet
      const categoriesList = await initializeCategories();
      
      if (!categoriesList || categoriesList.length === 0) {
        console.warn('No categories found or initialized');
        setError('No trek categories found. Please contact an administrator.');
        setCategories([]);
      } else {
        console.log(`Loaded ${categoriesList.length} categories`);
        setCategories(categoriesList);
        // Clear any category-related error
        if (error && error.includes('categories')) {
          setError('');
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error loading trek categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleItineraryChange = (newItinerary) => {
    setFormData(prev => ({
      ...prev,
      itinerary: newItinerary,
      days: newItinerary.length // Update days count to match itinerary length
    }));
  };
  
  const handleMonthsChange = (months) => {
    setFormData(prev => ({
      ...prev,
      availableMonths: months
    }));
  };
  
  const handleImagesChange = (data) => {
    setTrekImages(data.images);
    setCoverImageIndex(data.coverIndex);
  };
  
  const handleImageUpload = async () => {
    try {
      // No new images to upload
      if (!trekImages || trekImages.length === 0) {
        return { 
          imageUrl: originalImageUrls[0] || '', 
          imageUrls: originalImageUrls,
          coverIndex: coverImageIndex
        };
      }
      
      setLoading(true);
      setUploadProgress(0);
      
      // Filter out images that need uploading (have file property)
      const imagesNeedingUpload = trekImages.filter(img => img.file);
      const filesToUpload = imagesNeedingUpload.map(img => img.file);
      
      // If no new files, return original/existing images
      if (filesToUpload.length === 0) {
        const allUrls = trekImages.map(img => img.url);
        return { 
          imageUrl: allUrls[coverImageIndex] || allUrls[0] || '',
          imageUrls: allUrls,
          coverIndex: coverImageIndex
        };
      }
      
      // Upload new images
      const newImageUrls = await uploadMultipleImages(
        filesToUpload,
        trekId,
        (progress) => setUploadProgress(progress),
        null
      );
      
      // Combine existing URLs with new URLs
      const existingUrls = trekImages
        .filter(img => !img.file)
        .map(img => img.url);
      
      const allImageUrls = [...existingUrls];
      
      // Insert new URLs in the right positions
      let newUrlIndex = 0;
      trekImages.forEach((img, idx) => {
        if (img.file) {
          allImageUrls[idx] = newImageUrls[newUrlIndex];
          newUrlIndex++;
        }
      });
      
      // Make sure we have a cover image URL
      const coverImageUrl = allImageUrls[coverImageIndex] || allImageUrls[0] || '';
      
      return {
        imageUrl: coverImageUrl, // For backward compatibility
        imageUrls: allImageUrls,
        coverIndex: coverImageIndex
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload trek image');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.description || !formData.location || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Check if at least one image is provided
    if (!trekImages || trekImages.length === 0) {
      setError('Please provide at least one trek image.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Upload images
      const { imageUrl, imageUrls, coverIndex } = await handleImageUpload();
      
      // Find the trek document by ID
      const treksRef = collection(db, 'treks');
      const q = query(treksRef, where("id", "==", trekId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Trek not found.');
      }
      
      const trekDoc = querySnapshot.docs[0];      // Refresh organizer details to ensure data consistency
      const updatedOrganizerDetails = await fetchOrganizerDetails(user.uid);
      
      // Prepare trek data with enriched organizer information and preserve existing fields
      const baseData = { 
        ...formData, 
        image: imageUrl,
        imageUrls: imageUrls,
        coverIndex: coverIndex,
        updatedAt: new Date().toISOString()
      };
      
      // Get category name for display
      const selectedCategory = categories.find(cat => cat.id === formData.category);
      const categoryName = selectedCategory ? selectedCategory.name : '';
      baseData.categoryName = categoryName;
      
      // Merge with organizer details (but keep existing organizerId)
      const trekData = {
        ...baseData,
        ...updatedOrganizerDetails,
        organizerId: baseData.organizerId || user.uid // Preserve original organizerId if it exists
      };
      
      await updateDoc(doc(db, 'treks', trekDoc.id), trekData);
      
      setSuccess('Trek updated successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/organizer/treks');
      }, 2000);
    } catch (error) {
      console.error('Error updating trek:', error);
      setError(`Error updating trek: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/organizer/treks');
  };
  
  if (loading) {
    return (
      <Page>
        <Container>
          <LoadingContainer>
            <FaMountain />
            <p>Loading trek details...</p>
          </LoadingContainer>
        </Container>
      </Page>
    );
  }
  
  return (
    <Page>
      <Container>
        <BackButton onClick={() => navigate('/organizer/treks')}>
          <FiArrowLeft /> Back to My Treks
        </BackButton>
        
        <Header>
          <Title>Edit Trek</Title>
          <Subtitle>Update your trek details</Subtitle>
        </Header>
        
        {error && (
          <ErrorMessage>
            <FiAlertTriangle />
            {error}
          </ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage>
            <FiCheck />
            {success}
          </SuccessMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Trek Title*</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter trek title"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description*</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the trek experience"
              required
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="location">Location*</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Trek location"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="extreme">Extreme</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="category">Category*</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="days">Duration (days)</Label>
              <Input
                type="number"
                id="days"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                min="1"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Trek Images*</Label>
            <MultipleImagesUploader
              onImagesChange={handleImagesChange}
              initialImages={trekImages}
              maxFiles={10}
              maxSize={10}
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  height: '4px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    background: 'linear-gradient(90deg, #4cc9f0 0%, #7209b7 100%)',
                    height: '100%',
                    width: `${uploadProgress}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label>Detailed Description</Label>
            <TextArea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription || ''}
              onChange={handleInputChange}
              placeholder="Provide more detailed information about the trek experience, terrain, special attractions, etc."
              style={{ minHeight: "150px" }}
            />
          </FormGroup>
          
          {/* Month Availability Selector */}
          <MonthAvailability 
            availableMonths={formData.availableMonths || []}
            onChange={handleMonthsChange}
          />
          
          <FormGroup>
            <DateAvailabilitySelector
              selectedDates={formData.availableDates}
              onChange={(dates) => setFormData(prev => ({ ...prev, availableDates: dates }))}
              label="Trek Available Dates"
              minDate={new Date().toISOString().split('T')[0]}
              // Set max date to 2 years from now or whatever logic you prefer
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]}
            />
          </FormGroup>
          
          {/* Itinerary Manager */}
          <ItineraryManager 
            itinerary={formData.itinerary || []}
            onChange={handleItineraryChange}
          />
          
          <ButtonsContainer>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            
            <Button type="submit" primary disabled={loading}>
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <FiUpload /> Save Changes
                </>
              )}
            </Button>
          </ButtonsContainer>
        </Form>
      </Container>
    </Page>
  );
};

export default OrganizerEditTrek;
