import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { 
  FiCheckCircle, FiAward, FiArrowLeft, 
  FiShield
} from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';

const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,700;1,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
`;

const floatUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #020308;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px; /* Reduced for mobile edges */
  font-family: 'Inter', sans-serif;
  background-image: 
    radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
`;

const NavBar = styled.nav`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  gap: 15px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch; /* Buttons take full width on tiny phones */
  }
`;

const BackLink = styled(Link)`
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: 0.2s;
  &:hover { color: white; transform: translateX(-3px); }
`;

const DownloadBtn = styled.button`
  background: white;
  color: black;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
  &:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2); }
  &:disabled { opacity: 0.5; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  width: 100%;
  max-width: 1000px;
  animation: ${floatUp} 0.6s ease-out;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CertPreviewCard = styled.div`
  background: #0a0b14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  padding: 60px; /* Default Desktop Padding */
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 20px; /* Mobile Padding */
  }
`;

const InternName = styled.h1`
  font-family: 'Libre Baskerville', serif;
  font-style: italic;
  margin: 20px 0;
  line-height: 1.2;
  font-size: clamp(1.8rem, 7vw, 3.5rem); /* Dynamically shrinks name for phone */
  background: linear-gradient(to bottom, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const VerificationSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidePanel = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
`;

const StatusTag = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  background: ${props => props.$valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$valid ? '#10b981' : '#ef4444'};
  border: 1px solid ${props => props.$valid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 10px;
  &:last-child { border: none; }
  
  .label { color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
  .value { font-weight: 600; color: #f1f5f9; font-size: 0.9rem; text-align: right; }
`;

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "certificates", certificateId));
        if (snap.exists()) setCertData(snap.data()); else setError(true);
      } catch { setError(true); } finally { setLoading(false); }
    };
    fetch();
  }, [certificateId]);

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = 297; const h = 210;
    doc.setFillColor(255, 255, 255); doc.rect(0, 0, w, h, 'F');
    doc.setDrawColor(99, 102, 241); doc.setLineWidth(1.5); doc.rect(10, 10, w - 20, h - 20, 'S'); 
    doc.setDrawColor(168, 85, 247); doc.rect(12, 12, w - 24, h - 24, 'S');
    doc.setTextColor(15, 23, 42); doc.setFont('helvetica', 'bold'); doc.setFontSize(40); doc.text('TROVIA', w / 2, 40, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('OFFICIAL INTERNSHIP EXCELLENCE PROGRAM', w / 2.6, 48, { align: 'center', charSpace: 2 });

    doc.setTextColor(71, 85, 105); doc.setFontSize(16); doc.text('This is to certify that', w / 2, 75, { align: 'center' });
    doc.setTextColor(30, 41, 59); doc.setFont('times', 'italic', 'bold'); doc.setFontSize(55); doc.text(certData.internName, w / 2, 95, { align: 'center' });
    doc.setDrawColor(226, 232, 240); doc.line(w / 2 - 60, 100, w / 2 + 60, 100);
    doc.setTextColor(71, 85, 105); doc.setFont('helvetica', 'normal'); doc.setFontSize(14); doc.text('has successfully completed their professional tenure as', w / 2, 115, { align: 'center' });
    doc.setTextColor(15, 23, 42); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text(certData.role.toUpperCase(), w / 2, 128, { align: 'center' });
    doc.setFontSize(9); doc.setTextColor(148, 163, 184); doc.text('CREDENTIAL ID', 35, 155);
    doc.setTextColor(30, 41, 59); doc.setFont('courier', 'bold'); doc.text(certData.certificateId, 35, 160);
    doc.text(`${certData.startDate} - ${certData.endDate}`, 35, 180);
    doc.setFont('times', 'italic'); doc.setFontSize(35); doc.setTextColor(15, 23, 42); doc.text('Harsh Gupta', w - 85, 165, { align: 'center' });
    doc.line(w - 120, 170, w - 50, 170);
    doc.setFontSize(10); doc.text('HARSH GUPTA', w - 85, 176, { align: 'center' });
    const qrCanvas = document.querySelector('canvas');
    if (qrCanvas) doc.addImage(qrCanvas.toDataURL('image/png'), 'PNG', w / 2 - 15, 150, 30, 30);
    doc.save(`${certData.internName}_Trovia_Certificate.pdf`);
  };

  if (loading) return <PageContainer><h2>Verifying Database...</h2></PageContainer>;
  if (error) return <PageContainer><StatusTag $valid={false}>Invalid ID</StatusTag></PageContainer>;

  return (
    <PageContainer>
      <GlobalFonts />
      <NavBar>
        <BackLink to="/"><FiArrowLeft /> Trovia Portal</BackLink>
        <DownloadBtn onClick={generatePDF}><FiAward /> Download PDF</DownloadBtn>
      </NavBar>

      <MainGrid>
        <CertPreviewCard>
          <FiAward style={{ fontSize: '3.5rem', color: '#8b5cf6', marginBottom: '20px' }} />
          <p style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            Internship Completion
          </p>
          <InternName>{certData.internName}</InternName>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '30px' }}>{certData.role}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QRCodeCanvas value={`https://trovia.in/#/verify/${certData.certificateId}`} size={100} bgColor="#0a0b14" fgColor="#ffffff" />
          </div>
        </CertPreviewCard>

        <VerificationSidebar>
          <SidePanel>
            <StatusTag $valid={certData.status === 'valid'}>
              <FiCheckCircle /> RECORD {certData.status.toUpperCase()}
            </StatusTag>
            <DetailRow><span className="label">Full Name</span><span className="value">{certData.internName}</span></DetailRow>
            <DetailRow><span className="label">Role</span><span className="value">{certData.role}</span></DetailRow>
            <DetailRow><span className="label">Tenure</span><span className="value">{certData.startDate} - {certData.endDate}</span></DetailRow>
            <DetailRow><span className="label">Verified ID</span><span className="value" style={{ fontFamily: 'Space Mono' }}>{certData.certificateId}</span></DetailRow>
          </SidePanel>

          <SidePanel style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
              <FiShield /> SECURE VERIFICATION
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px', lineHeight: '1.5' }}>
              This record is hashed and stored in our secure database. Any modification renders verification invalid.
            </p>
          </SidePanel>
        </VerificationSidebar>
      </MainGrid>
    </PageContainer>
  );
};

export default VerifyCertificate;