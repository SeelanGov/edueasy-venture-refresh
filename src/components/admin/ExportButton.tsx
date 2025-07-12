import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  onExport: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => (
  <Button variant="outline" onClick={onExport}>
    Export CSV
  </Button>
);

export default ExportButton;
