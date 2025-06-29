import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where } from "firebase/firestore";
import { initializeTreks } from "../utils/initializeTreks";
import { FiTrash, FiEdit, FiSave, FiX, FiPlusCircle, FiLogIn, FiUpload, FiImage, FiCalendar, FiMap } from 'react-icons/fi';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { uploadImage, deleteImage, getTrekImagePath, getValidImageUrl, uploadMultipleImages } from "../utils/images";
import MultipleImagesUploader from './MultipleImagesUploader';
import ItineraryManager from './ItineraryManager';
import MonthAvailability from './MonthAvailability';
import DateAvailabilitySelector from './DateAvailabilitySelector';

// Styled components for the admin interface
const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin: 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 12px 18px;
  background: ${props => props.primary ? '#5390D9' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.primary ? '#fff' : '#fff'};
  border: 1px solid ${props => props.primary ? '#5390D9' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#4a81c4' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const TreksTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 120px 120px;
  background: #f2f7ff;
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e4e9f2;
  
  @media (max-width: 1000px) {
    grid-template-columns: 80px 1fr 100px 120px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    ${props => !props.alwaysShow && `
      margin-top: 6px;
      font-size: 0.9rem;
      color: #666;
    `}
  }
`;

const TrekRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 120px 120px;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e9f2;
  align-items: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafc;
  }
  
  @media (max-width: 1000px) {
    grid-template-columns: 80px 1fr 100px 120px;
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
`;

const TrekImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-color: #e9ecef;
`;

const TrekTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #222;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-top: 10px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.color || 'transparent'};
  color: ${props => props.textColor || '#666'};
  border: 1px solid ${props => props.color ? props.color : '#ddd'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const FormContainer = styled.div`
  background: #1e2330;
  color: white;
  border-radius: 12px;
  padding: 25px;
  margin-top: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 25px;
  color: white;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  
  &:focus {
    border-color: #5390D9;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  
  &:focus {
    border-color: #5390D9;
    outline: none;
  }
  
  option {
    background: #2a3446;
    color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  transition: border 0.2s;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  
  &:focus {
    border-color: #5390D9;
    outline: none;
  }
`;

const ImageUploadContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-color: #e9ecef;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: #5390D9;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background: #4a81c4;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 4px;
  margin: 10px 0;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #5390D9;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ImageActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 15px;
`;

const FormFullWidth = styled.div`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const Message = styled.div`
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  background-color: ${props => props.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(22, 163, 74, 0.2)'};
  border: 1px solid ${props => props.error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(22, 163, 74, 0.5)'};
  color: ${props => props.error ? '#ff7b7b' : '#4ade80'};
  font-weight: 500;
`;

// Cloudflare image optimization helper
const getCloudflareImageUrl = (originalUrl, width = 800) => {
  // If the image is already a Cloudflare URL, return it as is or add transformations
  if (originalUrl?.includes('cloudflare')) {
    // Add any Cloudflare transformation parameters if needed
    return originalUrl;
  }
  
  // For non-Cloudflare URLs, you would typically use your Cloudflare Worker URL
  // This is just a placeholder - replace with your actual Cloudflare worker URL
  return originalUrl;
};

// Admin login form component
const AdminLogin = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '100px auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>
      
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px'
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#5390D9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {loading ? 'Logging in...' : (
            <>
              <FiLogIn />
              Login to Admin Panel
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const TrekAdmin = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrek, setEditingTrek] = useState(null);
  const [message, setMessage] = useState({ text: '', error: false });
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
    // Admin emails that are allowed access
  const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'harsh68968@gmail.com', 'youremail@example.com']; // Replace with your actual email
  
  // Form state for adding/editing trek
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    country: 'India',
    location: '',
    difficulty: 'Easy',
    days: 1,
    price: '',
    season: '',
    rating: 5.0,
    reviews: 0,
    image: '',
    description: '',
    organizerId: '', // Add organizerId field
    organizerName: '', // Add organizerName field
    imageUrls: [], // Initialize imageUrls as an empty array
    coverIndex: 0, // Default cover image index
    availableMonths: [], // Initialize available months as an empty array
    availableDates: [], // Initialize available dates as an empty array
    itinerary: [], // Initialize itinerary as an empty array
    detailedDescription: '' // Detailed description field
  });
  
  // Image upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Organizers list state
  const [organizers, setOrganizers] = useState([]);
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);
  
  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthLoading(false);
      
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        // User is authenticated and is an admin
        setUser(currentUser);
        fetchTreks();
        fetchOrganizers(); // Fetch organizers when authenticated
      } else if (currentUser) {
        // User is authenticated but not an admin
        signOut(auth); // Sign them out
        setUser(null);
        setLoginError("You don't have admin access.");
      } else {
        // User is not authenticated
        setUser(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Function to fetch all users with organizer role
  const fetchOrganizers = async () => {
    try {
      setLoadingOrganizers(true);
      const usersCollection = collection(db, "users");
      const organizerQuery = query(usersCollection, where("role", "in", ["organizer", "admin"]));
      const organizersSnapshot = await getDocs(organizerQuery);
      
      const organizersList = organizersSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        organizationName: doc.data().organizationDetails?.name || doc.data().name,
        role: doc.data().role
      }));
      
      setOrganizers(organizersList);
      setLoadingOrganizers(false);
    } catch (error) {
      console.error('Error fetching organizers:', error);
      setLoadingOrganizers(false);
    }
  };
  
  const handleLogin = async (email, password) => {
    try {
      setAuthLoading(true);
      setLoginError("");
      
      // Add your email to ADMIN_EMAILS to get access
      if (!ADMIN_EMAILS.includes(email)) {
        setLoginError("This email doesn't have admin access.");
        setAuthLoading(false);
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      // The auth state change will trigger the effect above
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message);
      setAuthLoading(false);
    }
  };
  
  const handleLogout = () => {
    signOut(auth);
  };
  
  const fetchTreks = async () => {
    try {
      setLoading(true);
      
      // Ensure the treks collection exists
      const treksCollection = collection(db, "treks");
      
      // First try to get existing treks
      const treksSnapshot = await getDocs(treksCollection);
      const treksData = treksSnapshot.docs.map(doc => ({
        docId: doc.id, // Store the Firestore document ID
        ...doc.data()
      }));
      
      setTreks(treksData);
      
      // If no treks and this is the first time, initialize sample treks
      if (treksData.length === 0) {
        setMessage({ 
          text: "No treks found. Click 'Initialize Sample Treks' to add sample data.",
          error: false 
        });
      }
    } catch (err) {
      console.error("Error fetching treks:", err);
      setMessage({ text: "Failed to load treks: " + err.message, error: true });
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
  
  // Handler for multiple images
  const handleImagesChange = (images, coverIndex) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: Array.isArray(images) ? images : [],
      coverIndex: coverIndex
    }));
  };
  
  // Handler for itinerary changes
  const handleItineraryChange = (itinerary) => {
    setFormData(prev => ({
      ...prev,
      itinerary
    }));
  };
  
  // Handler for available months
  const handleMonthsChange = (months) => {
    setFormData(prev => ({
      ...prev,
      availableMonths: months
    }));
  };
  
  // Handler for available dates
  const handleAvailableDatesChange = (dates) => {
    console.log("🗓️ Available dates changed:", dates);
    console.log("📊 This is just updating form state, NOT saving to database");
    setFormData(prev => ({
      ...prev,
      availableDates: dates
    }));
  };
  
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      country: 'India',
      location: '',
      difficulty: 'Easy',
      days: 1,
      price: '',
      season: '',
      rating: 5.0,
      reviews: 0,
      image: '',
      imageUrls: [],
      coverIndex: 0,
      description: '',
      detailedDescription: '',
      itinerary: [],
      availableMonths: [],
      availableDates: [], // Reset available dates
      organizerId: '',
      organizerName: '',
      includedServices: [],
      excludedServices: [],
      highlights: []
    });
    setEditingTrek(null);
    setImageFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    
    // Reset file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };
  
  const handleAddNewClick = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleEditTrek = (trek) => {
    setFormData({
      id: trek.id || '',
      title: trek.title || '',
      country: trek.country || 'India',
      location: trek.location || '',
      difficulty: trek.difficulty || 'Easy',
      days: trek.days || 1,
      price: trek.price || '',
      season: trek.season || '',
      rating: trek.rating || 5.0,
      reviews: trek.reviews || 0,
      image: trek.image || '',
      // Make sure imageUrls is always an array
      imageUrls: Array.isArray(trek.imageUrls) ? trek.imageUrls : [],
      coverIndex: trek.coverIndex || 0,
      description: trek.description || '',
      detailedDescription: trek.detailedDescription || '',
      itinerary: Array.isArray(trek.itinerary) ? trek.itinerary : [],
      availableMonths: Array.isArray(trek.availableMonths) ? trek.availableMonths : [],
      availableDates: Array.isArray(trek.availableDates) ? trek.availableDates : [], // Load existing available dates
      organizerId: trek.organizerId || '',
      organizerName: trek.organizerName || '',
      includedServices: Array.isArray(trek.includedServices) ? trek.includedServices : [],
      excludedServices: Array.isArray(trek.excludedServices) ? trek.excludedServices : [],
      highlights: Array.isArray(trek.highlights) ? trek.highlights : []
    });
    setEditingTrek(trek.docId);
    setShowForm(true);
  };
    const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setMessage({ text: "Please select an image file (jpg, png, etc)", error: true });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Image file is too large. Please select an image under 5MB.", error: true });
        return;
      }
      
      setImageFile(file);
      
      // Create a preview URL
      const previewURL = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: previewURL // This is a temporary preview URL
      }));
    }
  };
    const handleImageUpload = async (trekId) => {
    if (!imageFile) {
      // If there's no new image file, return the existing image URL
      return formData.image;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a storage path for the trek image
      const storagePath = getTrekImagePath(trekId);
      
      // Upload using our utility function
      const downloadURL = await uploadImage(
        imageFile, 
        storagePath, 
        (progress) => {
          setUploadProgress(progress);
        }
      );
      
      setIsUploading(false);
      setUploadProgress(0);
      setImageFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      return downloadURL;
    } catch (error) {
      setIsUploading(false);
      setMessage({ text: "Image upload failed: " + error.message, error: true });
      console.error("Error uploading image:", error);
      throw error;
    }
  };
    const removeExistingImage = async () => {
    if (formData.image && formData.image.includes('firebasestorage')) {
      try {
        // Use our utility function to delete the image
        await deleteImage(formData.image);
      } catch (error) {
        console.error("Error removing image:", error);
        // Continue even if delete fails (URL might be invalid or file already removed)
      }
    }
    
    // Clear the image URL in form data
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSave = async (e) => {
    console.log("🚨 SAVE FUNCTION CALLED!", {
      eventType: e?.type,
      hasPreventDefault: !!(e && e.preventDefault),
      timestamp: new Date().toISOString()
    });
    
    // Ensure this function is called only from the form submit or explicit button click
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      console.warn("⚠️ handleSave called without event - this might be unintended auto-save, blocking execution");
      return; // Exit if not called from a submit event
    }
    
    // Additional protection: ensure we have a valid form event type
    if (e && e.type && !['submit', 'click'].includes(e.type)) {
      console.warn("⚠️ handleSave called from unexpected event type:", e.type, "- blocking execution");
      return;
    }
    
    console.log("✅ Save operation proceeding - this is an intentional save");
    
    try {
      setLoading(true);
      
      // Create a slug from the title if ID is not provided
      const trekId = formData.id || generateSlug(formData.title);
      
      // Handle image uploads (if needed)
      let imageUrl = formData.image;
      // Ensure imageUrls is always an array
      let imageUrls = Array.isArray(formData.imageUrls) ? [...formData.imageUrls] : [];
      
      // For backwards compatibility, if using old single image upload
      if (imageFile) {
        // New image to upload
        imageUrl = await handleImageUpload(trekId);
      }
      
      // If we have uploads from the MultipleImagesUploader but they're not yet uploaded (just File objects)
      // Ensure imageUrls is always an array before filtering
      const safeImageUrls = Array.isArray(formData.imageUrls) ? formData.imageUrls : [];
      
      // Better detection for File objects - check both direct File instances and objects with file property
      const newImageFiles = safeImageUrls.filter(img => {
        if (img instanceof File) return true;
        if (typeof img === 'object' && img !== null && img.file instanceof File) return img.file;
        return false;
      }).map(img => {
        // If it's a wrapper object with a file property, return the actual File
        if (img instanceof File) return img;
        return img.file;
      });
      
      if (newImageFiles.length > 0) {
        setIsUploading(true);
        try {
          console.log("Uploading multiple images:", newImageFiles.length);
          
          // Upload multiple new images
          const uploadedUrls = await uploadMultipleImages(
            newImageFiles,
            trekId, // Pass just the trekId, let the utility function format the path
            (progress) => {
              setUploadProgress(progress);
            }
          );
          
          console.log("Upload completed. Got URLs:", uploadedUrls);
          
          if (!Array.isArray(uploadedUrls) || uploadedUrls.length === 0) {
            throw new Error("Failed to get image URLs after upload");
          }
          
          // Replace File objects with URLs
          // First ensure imageUrls is an array before mapping
          const safeImageUrlsForMapping = Array.isArray(formData.imageUrls) ? formData.imageUrls : [];
          imageUrls = safeImageUrlsForMapping.map(img => {
            if (typeof img === 'string') return img;
            const idx = newImageFiles.findIndex(file => file === img);
            return idx >= 0 ? uploadedUrls[idx] : img;
          });
          
          console.log("Final imageUrls array:", imageUrls);
        } catch (error) {
          console.error("Error uploading multiple images:", error);
          setMessage({ text: "Failed to upload images: " + error.message, error: true });
        } finally {
          setIsUploading(false);
        }
      }
        const trekData = {
        ...formData,
        id: trekId,
        days: Number(formData.days),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        price: Number(formData.price || 0),
        image: imageUrl, // Keep for backwards compatibility
        imageUrls: imageUrls,
        coverIndex: formData.coverIndex || 0,
        organizerId: formData.organizerId || '', 
        organizerName: formData.organizerName || '',
        detailedDescription: formData.detailedDescription || '',
        itinerary: formData.itinerary || [],
        availableMonths: formData.availableMonths || [],
        availableDates: formData.availableDates || [], // Include available dates in save
        includedServices: formData.includedServices || [],
        excludedServices: formData.excludedServices || [],
        highlights: formData.highlights || [],
        updatedAt: new Date().toISOString()
      };
      
      if (editingTrek) {
        // Update existing trek
        const trekRef = doc(db, "treks", editingTrek);
        await updateDoc(trekRef, trekData);
        setMessage({ text: "Trek updated successfully!", error: false });
      } else {
        // Add new trek
        await addDoc(collection(db, "treks"), trekData);
        setMessage({ text: "Trek added successfully!", error: false });
      }
      
      fetchTreks();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving trek:", err);
      setMessage({ text: "Error saving trek: " + err.message, error: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTrek = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this trek?")) {
      return;
    }
    
    try {
      setLoading(true);
      const trekRef = doc(db, "treks", docId);
      await deleteDoc(trekRef);
      fetchTreks();
      setMessage({ text: "Trek deleted successfully!", error: false });
    } catch (err) {
      console.error("Error deleting trek:", err);
      setMessage({ text: "Error deleting trek: " + err.message, error: true });
    } finally {
      setLoading(false);
    }
  };
  const initializeSampleTreks = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setMessage({ text: "You must be logged in as an admin to initialize treks.", error: true });
        return;
      }
      
      // Ensure the treks collection exists before initializing treks
      try {
        // Check if "treks" collection exists, if not, we'll create it with a dummy doc
        const treksCollection = collection(db, "treks");
        const emptyCheck = await getDocs(treksCollection);
        
        // If we get here without error, the collection exists
        console.log("Treks collection exists, documents count:", emptyCheck.size);
      } catch (collErr) {
        console.error("Collection error, attempting to create treks collection:", collErr);
        // Create a dummy document in the treks collection
        await setDoc(doc(db, "treks", "placeholder"), { 
          note: "placeholder to ensure collection exists",
          timestamp: new Date(),
          createdBy: user.email
        });
      }

      // Now run the sample data initialization and pass the current user
      const result = await initializeTreks(user);
      
      if (result.success) {
        setMessage({ text: "Sample treks added successfully!", error: false });
        fetchTreks();
      } else {
        setMessage({ 
          text: "Error adding sample treks: " + (result.message || result.error?.message || "Unknown error"), 
          error: true 
        });
      }
    } catch (err) {
      console.error("Error initializing treks:", err);
      setMessage({ text: "Error initializing treks: " + err.message, error: true });
    } finally {
      setLoading(false);
    }
  };// Enable auth check for admin access
  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }
  
  if (!user) {
    return <AdminLogin onLogin={handleLogin} loading={authLoading} error={loginError} />;
  }
  
  return (
    <AdminContainer>      <Header>
        <Title>Trek Management</Title>
        <ButtonsContainer>
          <Button onClick={initializeSampleTreks}>
            Initialize Sample Treks
          </Button>
          <Button primary onClick={handleAddNewClick}>
            <FiPlusCircle /> Add New Trek
          </Button>
          <Button as="a" href="#/admin/trek-categories">
            Manage Categories
          </Button>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </ButtonsContainer>
      </Header>
      
      {message.text && (
        <Message error={message.error}>
          {message.text}
        </Message>
      )}
      
      {loading ? (
        <p>Loading treks...</p>
      ) : (
        <TreksTable>
          <TableHeader>
            <Cell>Image</Cell>
            <Cell>Trek Details</Cell>
            <Cell>Difficulty</Cell>
            <Cell>Price</Cell>
            <Cell>Days</Cell>
            <Cell>Actions</Cell>
          </TableHeader>
          
          {treks.length === 0 ? (
            <TrekRow>
              <Cell style={{ gridColumn: '1 / -1', justifyContent: 'center', padding: '30px' }}>
                No treks found. Click "Add New Trek" to create one.
              </Cell>
            </TrekRow>
          ) : (
            treks.map((trek) => (              <TrekRow key={trek.docId}>
                <Cell>
                  <TrekImage style={{ backgroundImage: `url(${getValidImageUrl(trek.image)})` }} />
                </Cell>
                <Cell style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <TrekTitle>{trek.title}</TrekTitle>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '3px' }}>{trek.location}</div>
                </Cell>
                <Cell>{trek.difficulty}</Cell>
                <Cell>{trek.price}</Cell>
                <Cell>{trek.days} Days</Cell>
                <Cell>
                  <ActionsContainer>
                    <IconButton 
                      onClick={() => handleEditTrek(trek)}
                      color="#e9f5ff" 
                      textColor="#2563eb"
                    >
                      <FiEdit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteTrek(trek.docId)}
                      color="#fee2e2" 
                      textColor="#dc2626"
                    >
                      <FiTrash />
                    </IconButton>
                  </ActionsContainer>
                </Cell>
              </TrekRow>
            ))
          )}
        </TreksTable>
      )}
      
      {showForm && (
        <FormContainer>
          <FormTitle>{editingTrek ? 'Edit Trek' : 'Add New Trek'}</FormTitle>
          <form onSubmit={handleSave} onKeyDown={(e) => {
            // Prevent accidental form submission with Enter key
            if (e.key === 'Enter' && e.target.type !== 'submit') {
              console.log("⚠️ Enter key pressed on", e.target.name || e.target.type, "- preventing form submission");
              e.preventDefault();
            }
          }}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="title">Trek Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="id">URL Slug (optional)</Label>
                <Input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="auto-generated-from-title"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="country">Country</Label>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="organizerId">Organizer</Label>
                <select
                  id="organizerId"
                  name="organizerId"
                  value={formData.organizerId || ''}
                  onChange={(e) => {
                    const selectedOrganizer = organizers.find(org => org.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      organizerId: e.target.value,
                      organizerName: selectedOrganizer ? selectedOrganizer.organizationName : ''
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                  required
                >
                  <option value="">Select an Organizer</option>
                  {organizers.map(organizer => (
                    <option key={organizer.id} value={organizer.id}>
                      {organizer.organizationName || organizer.name} {organizer.role === 'admin' ? '(Admin)' : ''}
                    </option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="location">Location</Label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Difficult">Difficult</option>
                  <option value="Extreme">Extreme</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="days">Duration (Days)</Label>
                <Input
                  type="number"
                  id="days"
                  name="days"
                  min="1"
                  max="30"
                  value={formData.days}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="price">Price</Label>
                <Input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 3,850 Rupees"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="season">Season</Label>
                <Input
                  type="text"
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  placeholder="e.g. Jun-Aug or Year-round"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  type="number"
                  id="rating"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="reviews">Number of Reviews</Label>
                <Input
                  type="number"
                  id="reviews"
                  name="reviews"
                  min="0"
                  value={formData.reviews}
                  onChange={handleInputChange}
                />
              </FormGroup>
                <FormGroup>
                <Label htmlFor="image">Trek Image</Label>
                <ImageUploadContainer>
                  <ImagePreview style={{ backgroundImage: formData.image ? `url(${getValidImageUrl(formData.image)})` : 'none' }}>
                    {!formData.image && <FiImage size={40} color="#999" />}
                    {formData.image && (
                      <ImageActions>
                        <IconButton 
                          color="#ef4444" 
                          textColor="white" 
                          onClick={(e) => {
                            e.preventDefault();
                            removeExistingImage();
                          }}
                          title="Remove image"
                        >
                          <FiTrash />
                        </IconButton>
                      </ImageActions>
                    )}
                  </ImagePreview>
                    {isUploading && (
                    <ProgressContainer>
                      <ProgressBar $progress={uploadProgress} />
                    </ProgressContainer>
                  )}
                  
                  <UploadButton htmlFor="trek-image-upload">
                    <FiUpload />
                    {formData.image ? 'Change Image' : 'Upload Image'}
                  </UploadButton>
                  <FileInput
                    ref={fileInputRef}
                    type="file"
                    id="trek-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small style={{ marginTop: '5px', display: 'block', color: '#666' }}>
                    Upload a high-quality image (JPG or PNG, max 5MB)
                  </small>
                </ImageUploadContainer>
              </FormGroup>
              
              
              
              <FormFullWidth>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </FormFullWidth>
              
              <FormFullWidth>
                <Label htmlFor="detailedDescription">Detailed Description</Label>
                <TextArea
                  id="detailedDescription"
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  placeholder="Provide more detailed information about the trek experience, terrain, special attractions, etc."
                  style={{ minHeight: "150px", fontSize: "15px", padding: "12px", lineHeight: "1.5" }}
                />
              </FormFullWidth>
              
              <FormFullWidth>
                <Label>Trek Images</Label>
                <div style={{ backgroundColor: '#2a3446', padding: '20px', borderRadius: '8px', position: 'relative', overflow: 'visible', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '20px', background: '#4cc9f0', borderRadius: '4px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Upload Multiple Images
                  </div>
                  <MultipleImagesUploader
                    onImagesChange={handleImagesChange}
                    initialImages={formData.imageUrls}
                    initialCoverIndex={formData.coverIndex}
                    maxFiles={10}
                    maxSize={5}
                  />
                </div>
              </FormFullWidth>
              
              <FormFullWidth>
                <Label><FiCalendar style={{ marginRight: '8px' }} /> Available Months</Label>
                <div style={{ backgroundColor: '#2a3446', padding: '20px', borderRadius: '8px' }}>
                  <MonthAvailability 
                    availableMonths={formData.availableMonths}
                    onChange={handleMonthsChange}
                  />
                </div>
              </FormFullWidth>
              
              <FormFullWidth>
                <Label><FiCalendar style={{ marginRight: '8px' }} /> Specific Available Dates</Label>
                <div style={{ backgroundColor: '#2a3446', padding: '20px', borderRadius: '8px' }}>
                  <DateAvailabilitySelector
                    selectedDates={formData.availableDates}
                    onChange={handleAvailableDatesChange}
                    label="Trek Available Dates"
                    minDate={new Date().toISOString().split('T')[0]} // Today as minimum date
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]} // 2 years from now as max
                  />
                </div>
              </FormFullWidth>
              
              <FormFullWidth>
                <Label><FiMap style={{ marginRight: '8px' }} /> Day-by-Day Itinerary</Label>
                <div style={{ backgroundColor: '#2a3446', padding: '20px', borderRadius: '8px' }}>
                  <ItineraryManager 
                    itinerary={formData.itinerary}
                    onChange={handleItineraryChange}
                  />
                </div>
              </FormFullWidth>
            </FormGrid>
            
            <SaveButtonContainer>
              <Button type="button" onClick={handleCancel}>
                <FiX /> Cancel
              </Button>
              <Button 
                primary 
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  // Additional safety check to ensure intentional submission
                  console.log("Save button clicked - this is an intentional save operation");
                }}
              >
                <FiSave /> {loading ? 'Saving...' : (editingTrek ? 'Update Trek' : 'Add Trek')}
              </Button>
            </SaveButtonContainer>
          </form>
        </FormContainer>
      )}
    </AdminContainer>
  );
};

export default TrekAdmin;
