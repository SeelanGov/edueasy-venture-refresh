
interface Props {
  consentPrivacy: boolean;
  consentTerms: boolean;
  setConsentPrivacy: (v: boolean) => void;
  setConsentTerms: (v: boolean) => void;
}
export const ConsentCheckboxes = ({
  consentPrivacy,
  consentTerms,
  setConsentPrivacy,
  setConsentTerms,
}: Props) => (
  <div className="flex flex-col gap-2 my-4">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={consentPrivacy}
        onChange={(e) => setConsentPrivacy(e.target.checked)}
      />
      I agree to the{" "}
      <a href="/privacy-policy.html" target="_blank" className="underline">
        Privacy Policy
      </a>
    </label>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={consentTerms}
        onChange={(e) => setConsentTerms(e.target.checked)}
      />
      I agree to the{" "}
      <a href="/terms-of-service.html" target="_blank" className="underline">
        Terms of Service
      </a>
    </label>
  </div>
);
