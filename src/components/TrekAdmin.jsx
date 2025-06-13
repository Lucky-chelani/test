import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { initializeTreks } from "../utils/initializeTreks";
import { FiTrash, FiEdit, FiSave, FiX, FiPlusCircle, FiLogIn, FiUpload, FiImage } from 'react-icons/fi';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { uploadImage, deleteImage, getTrekImagePath, getValidImageUrl } from "../utils/images";

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
  background: ${props => props.primary ? '#5390D9' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#333'};
  border: 1px solid ${props => props.primary ? '#5390D9' : '#ddd'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#4a81c4' : '#f9f9f9'};
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
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-top: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
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
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s;
  
  &:focus {
    border-color: #5390D9;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    border-color: #5390D9;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  transition: border 0.2s;
  
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
  background-color: ${props => props.error ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.error ? '#ef4444' : '#16a34a'};
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
    description: ''
  });
  
  // Image upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
    useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthLoading(false);
      
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        // User is authenticated and is an admin
        setUser(currentUser);
        fetchTreks();
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
      description: ''
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
      description: trek.description || ''
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
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create a slug from the title if ID is not provided
      const trekId = formData.id || generateSlug(formData.title);
      
      // Upload image if new image is selected
      let imageUrl = formData.image;
      
      if (imageFile) {
        // New image to upload
        imageUrl = await handleImageUpload(trekId);
      }
      
      const trekData = {
        ...formData,
        id: trekId,
        days: Number(formData.days),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        image: imageUrl
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
          <form onSubmit={handleSave}>
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
            </FormGrid>
            
            <SaveButtonContainer>
              <Button type="button" onClick={handleCancel}>
                <FiX /> Cancel
              </Button>
              <Button primary type="submit">
                <FiSave /> {editingTrek ? 'Update Trek' : 'Add Trek'}
              </Button>
            </SaveButtonContainer>
          </form>
        </FormContainer>
      )}
    </AdminContainer>
  );
};

export default TrekAdmin;
