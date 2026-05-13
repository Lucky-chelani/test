import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaPaperPlane,
  FaLock,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { db, auth } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    bgElevated: "#1a1a1a",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.15)",
    primary: "#f97316",
    primaryDark: "#ea580c",
    primaryLight: "#fb923c",
    primaryGlow: "rgba(249, 115, 22, 0.15)",
    primaryBorder: "rgba(249, 115, 22, 0.3)",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#64748b",
    gold: "#fbbf24",
    goldGlow: "rgba(251, 191, 36, 0.2)",
    success: "#22c55e",
    successGlow: "rgba(34, 197, 94, 0.12)",
    successBorder: "rgba(34, 197, 94, 0.3)",
    error: "#ef4444",
    errorGlow: "rgba(239, 68, 68, 0.12)",
    errorBorder: "rgba(239, 68, 68, 0.3)",
    glass: "rgba(255,255,255,0.04)",
    glassBorder: "rgba(255,255,255,0.08)",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    pill: "100px",
  },
  transition: {
    fast: "all 0.15s ease",
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const starPop = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.4); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

const successPop = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const FormWrapper = styled(motion.div)`
  background: linear-gradient(135deg, ${tokens.colors.bgCard} 0%, ${tokens.colors.bgElevated} 100%);
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  padding: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeUp} 0.5s ease both;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${tokens.colors.primary}60, ${tokens.colors.primaryLight}, ${tokens.colors.primary}60, transparent);
    background-size: 200% 100%;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 10% 90%, ${tokens.colors.primaryGlow} 0%, transparent 55%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1.125rem;
    border-radius: ${tokens.radius.lg};
  }

  @media (max-width: 480px) {
    padding: 1.25rem 1rem;
    margin-bottom: 2rem;
  }
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const FormIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${tokens.radius.md};
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 1.25rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const FormTitleGroup = styled.div``;

const FormTitle = styled.h3`
  font-family: "Sora", sans-serif;
  font-size: 1.375rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0 0 0.25rem;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${tokens.colors.textMuted};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRatingWrapper = styled.div`
  margin-bottom: 1.75rem;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

const StarRatingLabel = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${tokens.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.875rem;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 0.625rem;
  }
`;

const StarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const StarBtn = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  font-size: 2.25rem;
  line-height: 1;
  color: ${({ $filled, $hovered }) =>
    $filled || $hovered ? tokens.colors.gold : "rgba(255,255,255,0.1)"};
  text-shadow: ${({ $filled, $hovered }) =>
    $filled || $hovered ? `0 0 16px ${tokens.colors.goldGlow}` : "none"};
  transition: ${tokens.transition.fast};
  transform-origin: center;

  ${({ $filled, $hovered }) =>
    ($filled || $hovered) &&
    css`animation: ${starPop} 0.35s ease;`}

  &:hover { transform: scale(1.15); }
  &:active { transform: scale(0.9); }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    padding: 0.15rem;
  }
`;

const RatingLabelText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.gold};
  margin-left: 0.5rem;
  min-width: 80px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    min-width: 60px;
    margin-left: 0.375rem;
  }
`;

// ─── Text Area ────────────────────────────────────────────────────────────────
const TextAreaWrapper = styled.div`
  margin-bottom: 1.75rem;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

const TextAreaLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${tokens.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.875rem;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 0.625rem;
  }
`;

const CharCount = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: ${({ $over }) => ($over ? tokens.colors.error : tokens.colors.textMuted)};
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 130px;
  padding: 1rem 1.125rem;
  background: ${tokens.colors.glass};
  border: 1px solid ${({ $focused, $error }) =>
    $error ? tokens.colors.errorBorder
    : $focused ? tokens.colors.primaryBorder
    : tokens.colors.border};
  border-radius: ${tokens.radius.lg};
  color: ${tokens.colors.textPrimary};
  font-family: "Inter", sans-serif;
  font-size: 0.9375rem;
  line-height: 1.7;
  resize: vertical;
  transition: ${tokens.transition.base};
  outline: none;
  box-shadow: ${({ $focused }) =>
    $focused ? `0 0 0 3px ${tokens.colors.primaryGlow}` : "none"};

  &::placeholder {
    color: ${tokens.colors.textMuted};
    font-style: italic;
  }

  &:focus {
    border-color: ${tokens.colors.primaryBorder};
    box-shadow: 0 0 0 3px ${tokens.colors.primaryGlow};
    background: rgba(255,255,255,0.05);
  }

  @media (max-width: 640px) {
    min-height: 110px;
    font-size: 0.875rem;
    padding: 0.875rem;
  }

  @media (max-width: 480px) {
    min-height: 90px;
    font-size: 0.8125rem;
    padding: 0.75rem;
  }
`;

// ─── User Info ────────────────────────────────────────────────────────────────
const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radius.md};
  margin-bottom: 1.75rem;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    padding: 0.75rem;
    gap: 0.625rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px ${tokens.colors.primaryGlow};

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const UserLabel = styled.div`
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  margin-top: 0.1rem;

  @media (max-width: 480px) {
    font-size: 0.675rem;
  }
`;

const VerifiedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${tokens.colors.success};
  flex-shrink: 0;

  svg { font-size: 0.875rem; }

  @media (max-width: 480px) {
    font-size: 0.675rem;
    svg { font-size: 0.75rem; }
  }
`;

// ─── Alert ────────────────────────────────────────────────────────────────────
const AlertBox = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: ${tokens.radius.md};
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  z-index: 1;
  background: ${({ $type }) =>
    $type === "error" ? tokens.colors.errorGlow : tokens.colors.successGlow};
  border: 1px solid ${({ $type }) =>
    $type === "error" ? tokens.colors.errorBorder : tokens.colors.successBorder};
  color: ${({ $type }) =>
    $type === "error" ? tokens.colors.error : tokens.colors.success};

  svg { flex-shrink: 0; margin-top: 1px; font-size: 1rem; }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

const AlertClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  margin-left: auto;
  opacity: 0.6;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

// ─── Submit ───────────────────────────────────────────────────────────────────
const SubmitRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const ValidationHint = styled.p`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
  margin: 0;
  flex: 1;

  @media (max-width: 640px) {
    text-align: center;
    font-size: 0.75rem;
  }
`;

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 2rem;
  background: ${({ $disabled }) =>
    $disabled ? "rgba(255,255,255,0.06)"
    : `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark})`};
  border: 1px solid ${({ $disabled }) =>
    $disabled ? tokens.colors.border : "transparent"};
  border-radius: ${tokens.radius.pill};
  color: ${({ $disabled }) =>
    $disabled ? tokens.colors.textMuted : "white"};
  font-family: "Inter", sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: ${tokens.transition.spring};
  box-shadow: ${({ $disabled }) =>
    $disabled ? "none" : "0 6px 20px rgba(249,115,22,0.35)"};
  white-space: nowrap;
  min-width: 160px;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 30px rgba(249,115,22,0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.875rem;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

// ─── Locked State ─────────────────────────────────────────────────────────────
const LockedBox = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.75rem 2rem;
  background: ${tokens.colors.glass};
  border: 1px dashed ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1.25rem;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const LockIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${tokens.radius.md};
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 1.375rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 1.125rem;
  }
`;

const LockText = styled.div`
  flex: 1;
`;

const LockTitle = styled.p`
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0 0 0.25rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const LockSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${tokens.colors.textMuted};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const LoginBtn = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${tokens.radius.pill};
  border: 1px solid ${tokens.colors.primaryBorder};
  background: ${tokens.colors.primaryGlow};
  color: ${tokens.colors.primary};
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  transition: ${tokens.transition.spring};

  &:hover {
    background: ${tokens.colors.primary};
    color: white;
    transform: scale(1.04);
    box-shadow: 0 6px 20px rgba(249,115,22,0.35);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.875rem;
  }
`;

// ─── Success State ────────────────────────────────────────────────────────────
const SuccessOverlay = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    padding: 2rem 1rem;
    gap: 0.75rem;
  }
`;

const SuccessCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${tokens.colors.successGlow};
  border: 2px solid ${tokens.colors.successBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.success};
  font-size: 2rem;
  animation: ${successPop} 0.5s cubic-bezier(0.34,1.56,0.64,1) both;

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
`;

const SuccessTitle = styled.h4`
  font-family: "Sora", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1.0625rem;
  }
`;

const SuccessText = styled.p`
  font-size: 0.9rem;
  color: ${tokens.colors.textMuted};
  margin: 0;
  max-width: 320px;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const WriteAnotherBtn = styled.button`
  margin-top: 0.5rem;
  padding: 0.625rem 1.5rem;
  border-radius: ${tokens.radius.pill};
  border: 1px solid ${tokens.colors.primaryBorder};
  background: transparent;
  color: ${tokens.colors.primary};
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};

  &:hover {
    background: ${tokens.colors.primaryGlow};
    transform: scale(1.04);
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent! 🔥",
};

const MAX_CHARS = 800;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ReviewForm({ trekId, trekTitle, onReviewSubmitted }) {
  const user = auth.currentUser;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const charCount = comment.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isValid = rating > 0 && comment.trim().length >= 10 && !isOverLimit;

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Anonymous Trekker";

  // ── Reset form for another review ────────────────────────────────────────
  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setFocused(false);
    setSubmitting(false);
    setSubmitted(false);
    setError("");
  };

  // ── SUBMIT — uses Timestamp.now() instead of serverTimestamp() ───────────
  const handleSubmit = async () => {
    if (!isValid || submitting || !user) return;
    setError("");
    setSubmitting(true);

    try {
      // Use Timestamp.now() instead of serverTimestamp()
      // serverTimestamp() returns null locally until Firestore confirms
      // which causes issues with optimistic updates and rules validation
      const now = Timestamp.now();

      const reviewData = {
        trekId: trekId || "",
        trekTitle: trekTitle || "",
        userId: user.uid,
        userName: displayName,
        userEmail: user.email || "",
        rating: Number(rating),
        comment: comment.trim(),
        // Aliases for existing review card rendering
        author: displayName,
        text: comment.trim(),
        createdAt: now,
        helpfulCount: 0,
        verified: true,
      };

      console.log("📝 Saving review to Firestore...", {
        trekId: reviewData.trekId,
        userId: reviewData.userId,
        rating: reviewData.rating,
        commentLength: reviewData.comment.length,
      });

      const docRef = await addDoc(collection(db, "reviews"), reviewData);

      console.log("✅ Review saved with ID:", docRef.id);

      // Build optimistic review for instant UI update
      const savedReview = {
        id: docRef.id,
        ...reviewData,
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
        
      };

      if (onReviewSubmitted) {
        onReviewSubmitted(savedReview);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("❌ Error saving review:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);

      let errorMsg = "Something went wrong. Please try again.";

      if (err.code === "permission-denied") {
        errorMsg = "Permission denied. Check Firestore rules — see console for details.";
      } else if (err.code === "unavailable") {
        errorMsg = "Network error. Please check your connection.";
      } else if (err.code === "unauthenticated") {
        errorMsg = "Your session expired. Please log in again.";
      }

      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <LockedBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <LockIcon><FaLock /></LockIcon>
        <LockText>
          <LockTitle>Share Your Experience</LockTitle>
          <LockSubtitle>Log in to leave a review and help other trekkers</LockSubtitle>
        </LockText>
        <LoginBtn onClick={() => (window.location.href = "/login")}>
          Log In to Review
        </LoginBtn>
      </LockedBox>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <FormWrapper initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <SuccessOverlay>
          <SuccessCircle><FaCheckCircle /></SuccessCircle>
          <SuccessTitle>Review Published!</SuccessTitle>
          <SuccessText>
            Thank you, {displayName.split(" ")[0]}! Your review is now live.
          </SuccessText>
          <WriteAnotherBtn onClick={resetForm}>
            Write Another Review
          </WriteAnotherBtn>
        </SuccessOverlay>
      </FormWrapper>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <FormWrapper initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <FormHeader>
        <FormIconWrap><FiEdit3 /></FormIconWrap>
        <FormTitleGroup>
          <FormTitle>Write a Review</FormTitle>
          <FormSubtitle>Share your experience on {trekTitle || "this trek"}</FormSubtitle>
        </FormTitleGroup>
      </FormHeader>

      <UserInfoRow>
        <UserAvatar>{displayName.charAt(0).toUpperCase()}</UserAvatar>
        <UserDetails>
          <UserName>{displayName}</UserName>
          <UserLabel>Posting as verified trekker</UserLabel>
        </UserDetails>
        <VerifiedTag><FaCheckCircle /> Verified</VerifiedTag>
      </UserInfoRow>

      <AnimatePresence>
        {error && (
          <AlertBox
            $type="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FaTimes />
            {error}
            <AlertClose onClick={() => setError("")}>
              <FaTimes size={12} />
            </AlertClose>
          </AlertBox>
        )}
      </AnimatePresence>

      <StarRatingWrapper>
        <StarRatingLabel>Your Rating *</StarRatingLabel>
        <StarRow>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarBtn
              key={star}
              type="button"
              $filled={star <= rating}
              $hovered={star <= hoveredRating && hoveredRating > 0}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              ★
            </StarBtn>
          ))}
          <RatingLabelText $visible={hoveredRating > 0 || rating > 0}>
            {RATING_LABELS[hoveredRating || rating]}
          </RatingLabelText>
        </StarRow>
      </StarRatingWrapper>

      <TextAreaWrapper>
        <TextAreaLabel>
          Your Experience *
          <CharCount $over={isOverLimit}>{charCount}/{MAX_CHARS}</CharCount>
        </TextAreaLabel>
        <StyledTextArea
          placeholder="Describe your trek experience — what you loved, tips for others..."
          value={comment}
          $focused={focused}
          $error={isOverLimit}
          onChange={(e) => setComment(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </TextAreaWrapper>

      <SubmitRow>
        <ValidationHint>
          {rating === 0
            ? "⭐ Select a star rating"
            : comment.trim().length < 10
            ? "✏️ Write at least 10 characters"
            : isOverLimit
            ? `✂️ ${charCount - MAX_CHARS} chars over limit`
            : "✅ Ready to submit!"}
        </ValidationHint>
        <SubmitBtn
          onClick={handleSubmit}
          $disabled={!isValid || submitting}
          disabled={!isValid || submitting}
        >
          {submitting ? (
            <><Spinner /> Posting...</>
          ) : (
            <><FaPaperPlane /> Post Review</>
          )}
        </SubmitBtn>
      </SubmitRow>
    </FormWrapper>
  );
}