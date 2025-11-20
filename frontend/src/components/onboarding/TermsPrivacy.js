import React, { useState, useRef } from 'react';
import './TermsPrivacy.css';

const TermsPrivacy = ({ onboardingData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    termsAccepted: false,
    privacyAccepted: false,
    dataConsent: false,
    emergencyPolicyAccepted: false,
    digitalSignature: '',
    ...onboardingData.termsAccepted
  });

  const [showFullTerms, setShowFullTerms] = useState(false);
  const signaturePadRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.termsAccepted && formData.privacyAccepted && formData.emergencyPolicyAccepted) {
      onComplete({ termsAccepted: formData });
    } else {
      alert('Please accept all required agreements to continue.');
    }
  };

  const handleSignatureComplete = (signature) => {
    setFormData(prev => ({ ...prev, digitalSignature: signature }));
  };

  const allAccepted = formData.termsAccepted && formData.privacyAccepted &&
                     formData.emergencyPolicyAccepted && formData.dataConsent;

  return (
    <div className="terms-privacy">
      <div className="onboarding-header">
        <h1>Terms & Privacy</h1>
        <p>Please review and accept our policies to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="terms-form">
        <div className="policies-container">
          {/* Terms of Service */}
          <div className="policy-section">
            <label className="policy-checkbox">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                required
              />
              <span>
                I agree to the <button type="button" onClick={() => setShowFullTerms(!showFullTerms)} className="policy-link">
                  Terms of Service
                </button>
                <span className="required"> *</span>
              </span>
            </label>

            {showFullTerms && (
              <div className="policy-content">
                <h4>MR.CREAMS Terms of Service</h4>
                <div className="policy-text">
                  <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

                  <h5>1. Service Description</h5>
                  <p>MR.CREAMS provides AI-powered emotional intelligence and relationship analytics services...</p>

                  <h5>2. User Responsibilities</h5>
                  <p>You agree to use the service responsibly and provide accurate information...</p>

                  <h5>3. Privacy and Data</h5>
                  <p>We collect and process data as described in our Privacy Policy...</p>

                  <h5>4. Limitations</h5>
                  <p>MR.CREAMS is not a substitute for professional medical or psychological advice...</p>

                  <button type="button" onClick={() => setShowFullTerms(false)} className="close-policy">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Policy */}
          <div className="policy-section">
            <label className="policy-checkbox">
              <input
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={(e) => setFormData({...formData, privacyAccepted: e.target.checked})}
                required
              />
              <span>
                I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="policy-link">
                  Privacy Policy
                </a>
                <span className="required"> *</span>
              </span>
            </label>
          </div>

          {/* Data & AI Consent */}
          <div className="policy-section">
            <label className="policy-checkbox">
              <input
                type="checkbox"
                checked={formData.dataConsent}
                onChange={(e) => setFormData({...formData, dataConsent: e.target.checked})}
              />
              <span>
                I consent to the use of my data for AI emotional analysis and personalized insights
              </span>
            </label>
            <p className="policy-description">
              This allows us to provide personalized emotional insights and improve your experience.
              You can withdraw consent at any time in settings.
            </p>
          </div>

          {/* Emergency & Confidentiality Policy */}
          <div className="policy-section">
            <label className="policy-checkbox">
              <input
                type="checkbox"
                checked={formData.emergencyPolicyAccepted}
                onChange={(e) => setFormData({...formData, emergencyPolicyAccepted: e.target.checked})}
                required
              />
              <span>
                I understand and agree to the <a href="/emergency-policy" target="_blank" rel="noopener noreferrer" className="policy-link">
                  Emergency & Confidentiality Policy
                </a>
                <span className="required"> *</span>
              </span>
            </label>
            <p className="policy-description">
              MR.CREAMS is not a crisis service. In case of emergency, contact local emergency services
              or a crisis helpline. We maintain confidentiality except where required by law.
            </p>
          </div>

          {/* Digital Signature (Optional) */}
          <div className="policy-section">
            <label className="signature-section">
              <span>Digital Signature (Optional)</span>
              <div className="signature-pad">
                <canvas
                  ref={signaturePadRef}
                  width={400}
                  height={150}
                  className="signature-canvas"
                  onMouseDown={() => {/* Signature capture logic */}}
                />
                <div className="signature-actions">
                  <button type="button" onClick={() => handleSignatureComplete('')}>
                    Clear
                  </button>
                  <button type="button" onClick={() => handleSignatureComplete('captured_signature')}>
                    Save Signature
                  </button>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!allAccepted}
          >
            Complete Onboarding
          </button>
        </div>
      </form>
    </div>
  );
};

export default TermsPrivacy;
