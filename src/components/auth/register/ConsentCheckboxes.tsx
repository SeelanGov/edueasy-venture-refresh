
interface ConsentCheckboxesProps {
  consentPrivacy: boolean;
  consentTerms: boolean;
  setConsentPrivacy: (value: boolean) => void;
  setConsentTerms: (value: boolean) => void;
}

export const ConsentCheckboxes = ({
  consentPrivacy,
  consentTerms,
  setConsentPrivacy,
  setConsentTerms
}: ConsentCheckboxesProps) => {
  return (
    <div className="flex flex-col gap-3 my-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-sm font-medium text-gray-700 mb-2">
        Required Agreements
      </div>
      
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consentPrivacy}
          onChange={(e) => setConsentPrivacy(e.target.checked)}
          className="mt-1 w-4 h-4 text-cap-teal border-gray-300 rounded focus:ring-cap-teal"
        />
        <span className="text-sm text-gray-600">
          I agree to the{" "}
          <a
            href="/privacy-policy"
            className="text-cap-teal underline hover:text-cap-teal/80"
          >
            Privacy Policy
          </a>{" "}
          and consent to the processing of my personal information for identity verification and educational services.
        </span>
      </label>
      
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consentTerms}
          onChange={(e) => setConsentTerms(e.target.checked)}
          className="mt-1 w-4 h-4 text-cap-teal border-gray-300 rounded focus:ring-cap-teal"
        />
        <span className="text-sm text-gray-600">
          I agree to the{" "}
          <a
            href="/terms-of-service.html"
            target="_blank"
            className="text-cap-teal underline hover:text-cap-teal/80"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{" "}
          and understand the platform's educational application services.
        </span>
      </label>
    </div>
  );
};
