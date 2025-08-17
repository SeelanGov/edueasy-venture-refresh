interface ConsentCheckboxesProps {
  consentPrivacy: boolean;
  consentTerms: boolean;
  consentIdVerification: boolean;
  setConsentPrivacy: (value: boolean) => void;
  setConsentTerms: (value: boolean) => void;
  setConsentIdVerification: (value: boolean) => void;
}

/**
 * ConsentCheckboxes
 * @description Function
 */
export const ConsentCheckboxes = ({
  consentPrivacy,
  consentTerms,
  consentIdVerification,
  setConsentPrivacy,
  setConsentTerms,
  setConsentIdVerification,
}: ConsentCheckboxesProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-3 my-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-sm font-medium text-gray-700 mb-2">Required Agreements</div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consentPrivacy}
          onChange={(e) => setConsentPrivacy(e.target.checked)}
          className="mt-1 w-4 h-4 text-cap-teal border-gray-300 rounded focus:ring-cap-teal" />
        <span className="text-sm text-gray-600">
          I agree to the{' '}
          <a href="/privacy-policy" className="text-cap-teal underline hover:text-cap-teal/80">
            Privacy Policy
          </a>{' '}
          and consent to the processing of my personal information for identity verification and
          educational services.
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consentTerms}
          onChange={(e) => setConsentTerms(e.target.checked)}
          className="mt-1 w-4 h-4 text-cap-teal border-gray-300 rounded focus:ring-cap-teal" />
        <span className="text-sm text-gray-600">
          I agree to the{' '}
          <a href="/terms-of-service" className="text-cap-teal underline hover:text-cap-teal/80">
            Terms of Service
          </a>{' '}
          and understand the platform's educational application services.
        </span>
      </label>

      {/* NEW: ID Verification Consent */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consentIdVerification}
          onChange={(e) => setConsentIdVerification(e.target.checked)}
          className="mt-1 w-4 h-4 text-cap-teal border-gray-300 rounded focus:ring-cap-teal"
          required
        />
        <span className="text-sm text-gray-600">
          I consent to EduEasy collecting, verifying, and processing my South African ID number for
          identity confirmation, application processing, and to match me with education and funding
          opportunities. This will include verification with third-party providers (e.g., VerifyID).
          I understand this information will be processed in line with POPIA and the{' '}
          <a href="/privacy-policy" className="text-cap-teal underline hover:text-cap-teal/80">
            EduEasy Privacy Policy
          </a>
          .
        </span>
      </label>
    </div>
  );
};
