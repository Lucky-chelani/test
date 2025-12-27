import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaSave, FaTimes, FaArrowLeft, FaUser, FaEnvelope, FaBirthdayCake, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import mapPattern from '../assets/images/map-pattren.png';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const buttonFlare = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 100px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(20, 30, 48, 0.92) 0%, rgba(0, 0, 0, 0.85) 100%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px 60px 24px;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-3px);
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 0 15px;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const EditForm = styled.form`
  background: rgba(25, 28, 35, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #4CC9F0, #FF6B6B, #FFD166, #4CC9F0);
    background-size: 300% 100%;
    animation: ${buttonFlare} 6s infinite ease-in-out;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  margin: 0 0 20px 0;
  padding-left: 10px;
  border-left: 3px solid #4CC9F0;
`;

// Replace your existing FormGroup with this:
const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
  transition: all 0.3s ease;

  /* This highlights the label/icon when user types in the input */
  &:focus-within {
    label {
      color: #4CC9F0;
      text-shadow: 0 0 10px rgba(76, 201, 240, 0.3);
    }
    
    svg {
      transform: scale(1.2);
      filter: drop-shadow(0 0 5px rgba(76, 201, 240, 0.5));
    }
  }

  /* Smooth transition for the label items */
  label, svg {
    transition: all 0.3s ease;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.75rem;
  margin-top: 6px;
  font-weight: 500;
  /* Change color based on props */
  color: ${props => props.$isNearLimit ? '#FF6B6B' : 'rgba(255, 255, 255, 0.5)'};
  transition: color 0.3s ease;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-size: 1rem;
  gap: 8px;
  
  svg {
    color: #4CC9F0;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${props => props.$isError ? 'rgba(255, 87, 87, 0.6)' : 'rgba(255, 255, 255, 0.15)'};
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  
  &:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: ${props => props.$isError ? 'rgba(255, 87, 87, 0.8)' : 'rgba(76, 201, 240, 0.5)'};
    box-shadow: 0 0 0 2px ${props => props.$isError ? 'rgba(255, 87, 87, 0.3)' : 'rgba(76, 201, 240, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
  width: 140px;
  height: 140px;
  cursor: pointer;
  transition: transform 0.3s ease;

  /* Glow effect behind the avatar */
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4CC9F0, #FF6B6B);
    z-index: -1;
    opacity: 0.6;
    transition: all 0.3s ease;
  }

  /* 👇 HOVER EFFECTS ADDED HERE 👇 */
  &:hover {
    transform: scale(1.05); /* Slight zoom */
    
    &::after {
      opacity: 1; /* Brighten the glow */
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      filter: blur(10px); /* Soften the glow */
    }
  }
`;

const Avatar = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    font-size: 1rem;
  }

  ${AvatarContainer}:hover ~ & {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(to right, #4CC9F0, #4361EE);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(76, 201, 240, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const CancelButton = styled.button`
  background: linear-gradient(to right, #d32f2f, #ff5252);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(211, 47, 47, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormFieldContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Change 'styled.div' to 'styled(motion.div)'
const Alert = styled(motion.div)`
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  background: ${props => props.type === 'error' ? 'rgba(255, 87, 87, 0.2)' : 'rgba(76, 201, 240, 0.2)'};
  border-left: 4px solid ${props => props.type === 'error' ? '#FF5757' : '#4CC9F0'};
  color: ${props => props.type === 'error' ? '#FF5757' : '#4CC9F0'};
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  
  svg {
    margin-right: 10px;
    font-size: 1.2rem;
  }
`;

const LoadingIndicator = styled.div`
  display: inline-block;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top: 3px solid #4CC9F0;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  animation: ${rotate} 1s linear infinite;
`;

const ErrorText = styled.div`
  color: #ff5757;
  font-size: 0.85rem;
  margin-top: 5px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  
  &::before {
    content: "⚠️";
    margin-right: 5px;
    font-size: 0.9rem;
  }
`;


const LoadingText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
  margin-top: 100px;
  color: #ffffff;
  font-weight: 500;
  
  &::before {
    content: '';
    width: 50px;
    height: 50px;
    border: 3px solid rgba(76, 201, 240, 0.3);
    border-top: 3px solid #4CC9F0;
    border-radius: 50%;
    margin-bottom: 20px;
    animation: ${rotate} 1s linear infinite;
  }
  
  .loading-dots {
    display: inline-block;
    &::after {
      content: '...';
      display: inline-block;
      animation: ${shimmer} 1.5s infinite;
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 8px;
  font-size: 0.875rem;
  color: #ff6b6b;
`;


// Add this new component
const BackgroundDecoration = styled.div`
  position: absolute;
  top: 15%;
  right: 5%;
  font-size: 25rem;
  color: rgba(255, 255, 255, 0.02); /* Very subtle transparency */
  z-index: 1;
  transform: rotate(-15deg);
  pointer-events: none; /* Ensures clicks pass through it */
  animation: ${float} 6s ease-in-out infinite;

  @media (max-width: 1200px) {
    font-size: 15rem;
    top: 10%;
    right: -5%;
  }
  
  @media (max-width: 768px) {
    display: none; /* Hide on mobile to save space */
  }
`;

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [formErrors, setFormErrors] = useState({});
  
  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    // Phone validation (optional field)
    if (formData.phone && !/^[0-9+\-\s()]{7,15}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    // Bio validation (optional, but limit length)
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = "Bio cannot exceed 500 characters";
    }
    
    // Date of birth validation
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      
      if (dobDate > today) {
        errors.dob = "Date of birth cannot be in the future";
      }
      
      // Check if the user is at least 13 years old
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 13);
      if (dobDate > minAge) {
        errors.dob = "You must be at least 13 years old";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        // Get user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        // Set the avatar URL from auth
        setAvatarURL(currentUser.photoURL || '');
        
        // Set form data
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFormData({
            name: userData.name || currentUser.displayName || '',
            email: currentUser.email || '',
            dob: userData.dob || '',
            phone: userData.phone || '',
            location: userData.location || '',
            bio: userData.bio || ''
          });
        } else {
          setFormData({
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            dob: '',
            phone: '',
            location: '',
            bio: ''
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAlert({
          show: true,
          message: "Failed to load profile data. Please try again.",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
    const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setAlert({
          show: true,
          message: "Image is too large. Please select an image under 2MB.",
          type: "error"
        });
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setAlert({
          show: true,
          message: "Please select an image file (JPEG, PNG, etc.)",
          type: "error"
        });
        return;
      }
      
      // Preview the selected image
      setAvatarURL(URL.createObjectURL(file));
      setAvatar(file);
      
      // Show success message
      setAlert({
        show: true,
        message: "Image selected successfully. Click 'Save Changes' to upload.",
        type: "success"
      });
      
      // Auto-hide message after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 3000);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First validate the form
    if (!validateForm()) {
      // Show error message for validation failures
      setAlert({
        show: true,
        message: "Please fix the errors in the form before submitting.",
        type: "error"
      });
      return;
    }
    
    setUpdating(true);
    setAlert({ show: false, message: '', type: '' });
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Validate form data before submitting
    if (!validateForm()) {
      setUpdating(false);
      return;
    }
    
    try {
      let photoURL = currentUser.photoURL;
      
      // Show intermediate feedback
      setAlert({
        show: true,
        message: avatar ? "Uploading profile picture..." : "Saving your profile...",
        type: "success"
      });
      
      // Upload new avatar if provided
      if (avatar) {
        try {
          const storageRef = ref(storage, `avatars/${currentUser.uid}`);
          await uploadBytes(storageRef, avatar);
          photoURL = await getDownloadURL(storageRef);
          setAlert({
            show: true,
            message: "Profile picture uploaded successfully! Saving other information...",
            type: "success"
          });
        } catch (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          setAlert({
            show: true,
            message: "Failed to upload profile picture, but we'll still save your other information.",
            type: "error"
          });
        }
      }
      
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: formData.name,
        photoURL: photoURL
      });
        // First check if user document exists
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      // If user document doesn't exist, create it
      if (!userDoc.exists()) {
        // Import needed for setDoc
        const { setDoc } = await import('firebase/firestore');
        
        await setDoc(userDocRef, {
          name: formData.name,
          dob: formData.dob,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          email: currentUser.email,
          uid: currentUser.uid,
          role: 'user', // Default role
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // If document exists, just update it
        await updateDoc(userDocRef, {
          name: formData.name,
          dob: formData.dob,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          updatedAt: new Date()
        });
      }
      
      setAlert({
        show: true,
        message: "Profile updated successfully!",
        type: "success"
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        show: true,
        message: "Failed to update profile. Please try again.",
        type: "error"
      });
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <Page>
        <Container>
          <LoadingText>
            Loading your profile
            <span className="loading-dots"></span>
          </LoadingText>
        </Container>
      </Page>
    );
  }
  
  return (
    <Page>
      <BackgroundDecoration>
        <FaUser /> 
      </BackgroundDecoration>
      <Container>
        <PageHeader>
          <BackButton onClick={() => navigate('/profile')}>
            <FaArrowLeft /> Back
          </BackButton>
          <PageTitle>Edit Your Profile</PageTitle>
        </PageHeader>
        
        <AnimatePresence> {/* Wrap in AnimatePresence if you import it from framer-motion */}
          {alert.show && (
            <Alert 
              type={alert.type}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {alert.type === 'error' ? <FaTimes /> : <FaSave />}
              {alert.message}
            </Alert>
          )}
        </AnimatePresence>
        
        <EditForm onSubmit={handleSubmit}>
          <AvatarSection>
            <AvatarContainer>
              <Avatar src={avatarURL || 'https://via.placeholder.com/200x200'} alt="Profile Avatar" />
            </AvatarContainer>
            <UploadButton htmlFor="avatar-upload">
              <FaUpload /> Change Profile Picture
            </UploadButton>
            <FileInput 
              id="avatar-upload" 
              type="file" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </AvatarSection>
          
          <FormSection>
            <SectionTitle>Personal Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <FormLabel><FaUser /> Full Name</FormLabel>                <FormInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  $isError={!!formErrors.name}
                />
                {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <FormLabel><FaEnvelope /> Email Address</FormLabel>
                <FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="Your email address"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel><FaBirthdayCake /> Date of Birth</FormLabel>                <FormInput
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  $isError={!!formErrors.dob}
                />
                {formErrors.dob && <ErrorText>{formErrors.dob}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <FormLabel><FaPhoneAlt /> Phone Number</FormLabel>                <FormInput
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  $isError={!!formErrors.phone}
                />
                {formErrors.phone && <ErrorText>{formErrors.phone}</ErrorText>}
              </FormGroup>
            </FormRow>
            <FormGroup>
              <FormLabel><FaMapMarkerAlt /> Location</FormLabel>              <FormInput
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                $isError={!!formErrors.location}
              />
              {formErrors.location && <ErrorText>{formErrors.location}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <FormLabel>Bio</FormLabel>              <FormInput
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                style={{ height: '100px', resize: 'vertical' }}
                $isError={!!formErrors.bio}
              />
              <CharCount $isNearLimit={formData.bio.length > 450}>
                {formData.bio.length} / 500 characters
              </CharCount>
              {formErrors.bio && <ErrorText>{formErrors.bio}</ErrorText>}
            </FormGroup>
          </FormSection>
          
          <ButtonGroup>
            <SubmitButton type="submit" disabled={updating}>
              {updating ? (
                <>
                  <LoadingIndicator /> Updating...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </SubmitButton>
            <CancelButton type="button" onClick={() => navigate('/profile')}>
              <FaTimes /> Cancel
            </CancelButton>
          </ButtonGroup>
        </EditForm>
      </Container>
    </Page>
  );
};


export default EditProfile;
