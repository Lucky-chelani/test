import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { uploadImage, uploadMultipleImages } from '../utils/imageUtils/storage';
import initializeCategories from '../utils/initializeCategories';
import { prepareTrekData } from '../utils/trekUtils';
import { FiUpload, FiImage, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import MultipleImagesUploader from './MultipleImagesUploader';
import ItineraryManager from './ItineraryManager';
import MonthAvailability from './MonthAvailability';
import DateAvailabilitySelector from './DateAvailabilitySelector';
import { FaMountain } from 'react-icons/fa';
import mapPattern from '../assets/images/map-pattren.png';

// Styled components for the add trek page
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

  /* ADD THIS */
  @media (max-width: 480px) {
    padding: 20px 15px; /* Reduce padding significantly on mobile */
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

// Function to generate a URL-friendly slug from a title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const OrganizerAddTrek = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [trekImages, setTrekImages] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
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
        
        // Check if the user is an organizer
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role !== 'organizer' && userData.role !== 'admin') {
              setError('You do not have permission to add treks.');
              return;
            }
          } else {
            setError('User profile not found.');
            return;
          }
        } catch (err) {
          console.error('Error checking permissions:', err);
          setError('Error checking permissions.');
          return;
        }
        
        // Load categories
        fetchCategories();
      } else {
        setUser(null);
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);    const fetchCategories = async () => {
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
        setError('');
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
  
  const handleAvailableDatesChange = (dates) => {
    setFormData(prev => ({
      ...prev,
      availableDates: dates
    }));
  };
  
  const handleImagesChange = (data) => {
    console.log('Images data received:', data);
    setTrekImages(data.images || []);
    setCoverImageIndex(data.coverIndex || 0);
  };
  
  const handleImageUpload = async (trekId) => {
    if (!trekImages || trekImages.length === 0) return { imageUrl: '', imageUrls: [] };
    
    try {
      setLoading(true);
      setUploadProgress(0);
      
      // Get all files to upload
      const filesToUpload = trekImages
        .filter(img => img && (img.file instanceof File))
        .map(img => img.file);
      
      // If no files, just return
      if (filesToUpload.length === 0) return { imageUrl: '', imageUrls: [] };
      
      // Upload all images
      const imageUrls = await uploadMultipleImages(
        filesToUpload,
        trekId,
        (progress) => setUploadProgress(progress),
        null
      );
      
      // Return the cover image url and all image urls
      const coverImageUrl = imageUrls[coverImageIndex] || imageUrls[0] || '';
      
      return {
        imageUrl: coverImageUrl, // For backward compatibility
        imageUrls: imageUrls,
        coverIndex: coverImageIndex
      };
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload trek images');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.description || !formData.location || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Check if images are uploaded
    if (!trekImages || trekImages.length === 0) {
      setError('Please upload at least one trek image.');
      return;
    }
    
    // Check if any images have valid files
    const validImages = trekImages.filter(img => img && img.file instanceof File);
    if (validImages.length === 0) {
      setError('Please upload valid image files.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Generate a unique ID based on the title
      const trekId = generateSlug(formData.title);
      
      // Upload images first
      const { imageUrl, imageUrls, coverIndex } = await handleImageUpload(trekId);
      
      // Prepare complete trek data with enriched organizer information
      const trekData = await prepareTrekData(
        { 
          ...formData, 
          id: trekId,
          imageUrls: imageUrls,
          coverIndex: coverIndex 
        },
        user,
        imageUrl, // For backward compatibility
        categories
      );
      
      // Add to Firestore
      await addDoc(collection(db, "treks"), trekData);
      
      setSuccess('Trek added successfully!');
      // Reset form
      setFormData({
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
        availableDates: [], // Reset available dates
        highlights: [],
        includedServices: [],
        excludedServices: [],
        equipmentNeeded: [],
        fitnessLevel: 'moderate',
        ageRestriction: { min: 12, max: 65 }
      });
      setTrekImages([]);
      setCoverImageIndex(0);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/organizer/treks');
      }, 2000);
    } catch (error) {
      console.error('Error adding trek:', error);
      setError(`Error adding trek: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/organizer/treks');
  };
  
  return (
    <Page>
      <Container>
        <Header>
          <Title>Add New Trek</Title>
          <Subtitle>Create a new trek experience for your customers</Subtitle>
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
              <Label htmlFor="fitnessLevel">Fitness Level Required</Label>
              <Select
                id="fitnessLevel"
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleInputChange}
              >
                <option value="beginner">Beginner</option>
                <option value="moderate">Moderate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label>Trek Images*</Label>
            <MultipleImagesUploader
              onImagesChange={handleImagesChange}
              maxFiles={10}
              maxSize={10}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Detailed Description</Label>
            <TextArea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              placeholder="Provide more detailed information about the trek experience, terrain, special attractions, etc."
              style={{ minHeight: "150px" }}
            />
          </FormGroup>
          
          {/* Month Availability Selector */}
          <MonthAvailability 
            availableMonths={formData.availableMonths}
            onChange={handleMonthsChange}
          />
          
          {/* Date Availability Selector */}
          <FormGroup>
            <DateAvailabilitySelector
              selectedDates={formData.availableDates}
              onChange={handleAvailableDatesChange}
              label="Trek Available Dates"
              minDate={new Date().toISOString().split('T')[0]} // Today as minimum date
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]} // 2 years from now as max
            />
          </FormGroup>
          
          {/* Itinerary Manager */}
          <ItineraryManager 
            itinerary={formData.itinerary}
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
                  <FiUpload /> Add Trek
                </>
              )}
            </Button>
          </ButtonsContainer>
        </Form>
      </Container>
    </Page>
  );
};

export default OrganizerAddTrek;
