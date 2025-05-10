
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TrainingHeaderProps {
  lowConfidenceOnly: boolean;
  setLowConfidenceOnly: (value: boolean) => void;
}

export const TrainingHeader = ({ 
  lowConfidenceOnly, 
  setLowConfidenceOnly 
}: TrainingHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Message Training</h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="low-confidence" 
            checked={lowConfidenceOnly} 
            onCheckedChange={setLowConfidenceOnly}
          />
          <Label htmlFor="low-confidence">Show low confidence only</Label>
        </div>
      </div>
    </div>
  );
};
