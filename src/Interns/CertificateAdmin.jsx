import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { db } from '../firebase'; 
import { doc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { FiAward, FiCheckCircle, FiSave, FiRefreshCw, FiList, FiPlus, FiExternalLink, FiSlash, FiCopy, FiDownload } from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react'; // 👈 NEW IMPORT

/* --- ANIMATIONS & STYLES --- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AdminContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: #080812;
  color: white;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
`;

const HeaderTabs = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.2)' : 'transparent'};
  color: ${props => props.$active ? '#a78bfa' : '#94a3b8'};
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: white; }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 900px; /* Slightly wider to fit QR codes nicely */
  background: rgba(15, 20, 30, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) { padding: 25px; }
`;

const Title = styled.h2`
  font-size: 2rem; font-weight: 800; margin: 0 0 10px 0; display: flex; align-items: center; gap: 12px; color: white;
  svg { color: #8b5cf6; }
`;

const Subtitle = styled.p`color: #94a3b8; margin-bottom: 30px; font-size: 0.95rem;`;

const FormGrid = styled.form`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`display: flex; flex-direction: column; gap: 8px; grid-column: ${props => props.$fullWidth ? '1 / -1' : 'auto'};`;
const Label = styled.label`font-size: 0.85rem; font-weight: 600; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;`;
const Input = styled.input`
  padding: 14px 16px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; color: white; font-size: 1rem; transition: all 0.2s;
  font-family: ${props => props.$mono ? "'Space Mono', monospace" : 'inherit'}; color: ${props => props.$mono ? "#a78bfa" : "white"};
  &:focus { outline: none; border-color: #8b5cf6; background: rgba(0, 0, 0, 0.5); }
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1; margin-top: 20px; padding: 16px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.3s;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(139, 92, 246, 0.4); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const Message = styled.div`
  grid-column: 1 / -1; padding: 15px; border-radius: 12px; background: ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border: 1px solid ${props => props.$error ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; color: ${props => props.$error ? '#fca5a5' : '#6ee7b7'}; display: flex; align-items: center; gap: 10px; font-weight: 500;
`;

const InternList = styled.div`display: flex; flex-direction: column; gap: 15px;`;

const InternCard = styled.div`
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(139, 92, 246, 0.3); }
  @media (max-width: 768px) { flex-direction: column; align-items: stretch; gap: 20px; }
`;

const InternInfo = styled.div`
  flex: 1;
  h4 { margin: 0 0 5px 0; font-size: 1.2rem; color: white; display: flex; align-items: center; gap: 10px; }
  p { margin: 0; color: #94a3b8; font-size: 0.9rem; }
  .cert-id { font-family: 'Space Mono', monospace; color: #a78bfa; font-size: 0.8rem; margin-top: 8px; }
`;

const StatusBadge = styled.span`
  font-size: 0.75rem; padding: 4px 10px; border-radius: 50px; font-weight: 700; text-transform: uppercase;
  background: ${props => props.$valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${props => props.$valid ? '#34d399' : '#f87171'}; border: 1px solid ${props => props.$valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
`;

const QRContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 8px; margin: 0 20px;
  .qr-box { background: white; padding: 6px; border-radius: 8px; display: flex; }
  @media (max-width: 768px) { margin: 0; align-items: flex-start; }
`;

const ActionGroup = styled.div`
  display: flex; flex-direction: column; gap: 10px;
  @media (max-width: 768px) { flex-direction: row; flex-wrap: wrap; }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 8px 12px; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  &:hover { background: rgba(255, 255, 255, 0.1); }
  &.revoke:hover { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; color: #fca5a5; }
  &.download { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.3); color: #c4b5fd; }
  &.download:hover { background: rgba(139, 92, 246, 0.3); color: white; }
`;

const CertificateAdmin = () => {
  const [viewMode, setViewMode] = useState('generate');
  const [internsList, setInternsList] = useState([]);
  const [fetchingList, setFetchingList] = useState(false);

  const generateId = () => `TRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const getToday = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const [formData, setFormData] = useState({
    certificateId: generateId(), internName: '', role: '', startDate: '', endDate: '', issueDate: getToday(), skills: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchInterns = async () => {
    setFetchingList(true);
    try {
      const querySnapshot = await getDocs(collection(db, "certificates"));
      const data = querySnapshot.docs.map(doc => doc.data());
      // Sort newest first based on issueDate
      setInternsList(data.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)));
    } catch (error) { console.error("Error fetching interns:", error); } 
    finally { setFetchingList(false); }
  };

  useEffect(() => { if (viewMode === 'list') fetchInterns(); }, [viewMode]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== "");
      const finalData = { ...formData, skills: skillsArray, status: 'valid' };
      await setDoc(doc(db, "certificates", formData.certificateId), finalData);
      setMessage({ type: 'success', text: `Success! Certificate generated.` });
      setFormData({ certificateId: generateId(), internName: '', role: '', startDate: '', endDate: '', issueDate: getToday(), skills: '' });
    } catch (error) { setMessage({ type: 'error', text: "Failed to generate certificate." }); } 
    finally { setLoading(false); }
  };

  const handleRevoke = async (certId) => {
    const confirmRevoke = window.confirm("SECURITY WARNING: Are you sure you want to revoke this certificate? It will show as INVALID to any recruiter scanning the QR code.");
    if (confirmRevoke) {
      try {
        await updateDoc(doc(db, "certificates", certId), { status: 'revoked' });
        fetchInterns(); 
      } catch (error) { alert("Failed to revoke certificate."); }
    }
  };

  const copyLink = (certId) => {
    const url = `${BASE_DOMAIN}/#/verify/${certId}`;
    navigator.clipboard.writeText(url);
    alert("Verification Link copied to clipboard!");
  };

  const openLink = (certId) => {
    window.open(`${BASE_DOMAIN}/#/verify/${certId}`, "_blank");
  };

  // 👈 NEW: Function to Download the QR Code Canvas as a PNG Image
  const downloadQR = (certId, internName) => {
    const canvas = document.getElementById(`qr-${certId}`);
    if (!canvas) return;
    
    // Convert canvas to image URL
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    
    // Create a fake link and click it to trigger download
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${internName.replace(/\s+/g, '_')}_Trovia_QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Set your official production domain here
  const BASE_DOMAIN = "https://trovia.in";

  return (
    <AdminContainer>
      <HeaderTabs>
        <TabButton $active={viewMode === 'generate'} onClick={() => setViewMode('generate')}><FiPlus /> Generate Certificate</TabButton>
        <TabButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}><FiList /> Intern Directory</TabButton>
      </HeaderTabs>

      <FormCard>
        {viewMode === 'generate' ? (
          <>
            <Title><FiAward /> Generate Intern Certificate</Title>
            <Subtitle>Issue a secure, verifiable digital credential to a Trovia intern.</Subtitle>
            <FormGrid onSubmit={handleSubmit}>
              <FormGroup><Label>Certificate ID</Label><Input type="text" name="certificateId" value={formData.certificateId} onChange={handleChange} required $mono /></FormGroup>
              <FormGroup><Label>Date of Issue</Label><Input type="text" name="issueDate" value={formData.issueDate} onChange={handleChange} required /></FormGroup>
              <FormGroup $fullWidth><Label>Intern Full Name</Label><Input type="text" name="internName" value={formData.internName} onChange={handleChange} required /></FormGroup>
              <FormGroup $fullWidth><Label>Internship Role / Title</Label><Input type="text" name="role" value={formData.role} onChange={handleChange} required /></FormGroup>
              <FormGroup><Label>Start Date</Label><Input type="text" name="startDate" value={formData.startDate} onChange={handleChange} required /></FormGroup>
              <FormGroup><Label>End Date</Label><Input type="text" name="endDate" value={formData.endDate} onChange={handleChange} required /></FormGroup>
              <FormGroup $fullWidth><Label>Verified Skills (Comma Separated)</Label><Input type="text" name="skills" value={formData.skills} onChange={handleChange} required /></FormGroup>
              {message && <Message $error={message.type === 'error'}>{message.type === 'success' ? <FiCheckCircle /> : <FiRefreshCw />}{message.text}</Message>}
              <SubmitButton type="submit" disabled={loading}>{loading ? <FiRefreshCw className="spin" /> : <FiSave />}{loading ? 'Generating Secure Record...' : 'Generate Official Certificate'}</SubmitButton>
            </FormGrid>
          </>
        ) : (
          <>
            <Title><FiList /> Official Intern Directory</Title>
            <Subtitle>Manage all previously generated Trovia certificates and download QR Codes.</Subtitle>

            {fetchingList ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}><FiRefreshCw className="spin" style={{ fontSize: '2rem', marginBottom: '10px' }} /><p>Fetching secure records...</p></div>
            ) : internsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}><p>No certificates have been issued yet.</p></div>
            ) : (
              <InternList>
                {internsList.map((intern) => (
                  <InternCard key={intern.certificateId}>
                    
                    <InternInfo>
                      <h4>{intern.internName} <StatusBadge $valid={intern.status === 'valid'}>{intern.status}</StatusBadge></h4>
                      <p>{intern.role} • {intern.startDate} to {intern.endDate}</p>
                      <div className="cert-id">ID: {intern.certificateId}</div>
                    </InternInfo>

                    {/* 👈 NEW: The Generated QR Code */}
                    <QRContainer>
                      <div className="qr-box">
                        <QRCodeCanvas 
                          id={`qr-${intern.certificateId}`}
                          value={`${BASE_DOMAIN}/#/verify/${intern.certificateId}`} // 👈 CHANGED THIS LINE
                          size={100} 
                          bgColor={"#ffffff"} 
                          fgColor={"#000000"}
                          level={"H"} 
                          includeMargin={false}
                        />
                      </div>
                      <ActionButton className="download" onClick={() => downloadQR(intern.certificateId, intern.internName)}>
                        <FiDownload /> Save QR
                      </ActionButton>
                    </QRContainer>

                    <ActionGroup>
                      <ActionButton onClick={() => copyLink(intern.certificateId)} title="Copy Link"><FiCopy /> Copy Link</ActionButton>
                      <ActionButton onClick={() => openLink(intern.certificateId)} title="View Page"><FiExternalLink /> View Portal</ActionButton>
                      {intern.status === 'valid' && (
                        <ActionButton className="revoke" onClick={() => handleRevoke(intern.certificateId)} title="Revoke"><FiSlash /> Revoke</ActionButton>
                      )}
                    </ActionGroup>

                  </InternCard>
                ))}
              </InternList>
            )}
          </>
        )}
      </FormCard>
    </AdminContainer>
  );
};

export default CertificateAdmin;