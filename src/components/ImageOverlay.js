import styled from 'styled-components';

// Enhanced image overlay with better gradient
const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 20%, rgba(10, 26, 47, 0.4) 100%);
  z-index: 1;
  transition: opacity 0.3s ease;
`;

export default ImageOverlay;
