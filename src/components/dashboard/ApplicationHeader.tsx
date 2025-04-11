
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ApplicationHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-cap-dark">My Applications</h1>
      <Link to="/apply">
        <Button className="bg-cap-teal hover:bg-cap-teal/90">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </Link>
    </div>
  );
};
