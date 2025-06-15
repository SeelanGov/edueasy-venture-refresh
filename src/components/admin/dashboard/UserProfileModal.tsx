
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader as CardHead, CardTitle as CardHeaderTitle } from "@/components/ui/card";
import { User, ShieldCheck, Clock, X } from "lucide-react";

interface UserModalProps {
  user: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    id_verified?: boolean | null;
    tracking_id?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    profile_status?: string | null;
    // Add more fields as needed
  } | null;
  open: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserModalProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {user.full_name || "Unnamed User"}
              {user.id_verified ? (
                <Badge className="bg-green-100 text-green-800 ml-2">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 ml-2">
                  <X className="h-4 w-4 mr-1" /> Not verified
                </Badge>
              )}
            </div>
            <div className="text-xs font-mono text-blue-700">Tracking ID: {user.tracking_id || "N/A"}</div>
          </DialogTitle>
        </DialogHeader>
        <Card className="mb-2">
          <CardHead>
            <CardHeaderTitle>User Information</CardHeaderTitle>
          </CardHead>
          <CardContent className="space-y-2 !pb-2">
            <div>
              <span className="font-semibold">Name:</span> {user.full_name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {user.phone_number || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Profile Status:</span> {user.profile_status || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Emergency Contact:</span>{" "}
              {user.emergency_contact_name ? `${user.emergency_contact_name} (${user.emergency_contact_phone || "N/A"})` : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card className="mb-2">
          <CardHead>
            <CardHeaderTitle>Verification History</CardHeaderTitle>
          </CardHead>
          <CardContent className="pb-2">
            <div className="text-muted-foreground">
              {/* This can be expanded in future with real data */}
              <Clock className="inline h-4 w-4 mr-1" />
              No verification history found.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHead>
            <CardHeaderTitle>Sponsor Allocation Status</CardHeaderTitle>
          </CardHead>
          <CardContent className="pb-2">
            <div className="text-muted-foreground">
              {/* This can be expanded in future with real data */}
              <ShieldCheck className="inline h-4 w-4 mr-1" />
              No sponsor allocations recorded.
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          <DialogClose asChild>
            <button className="btn btn-sm btn-outline mt-2" onClick={onClose}>Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
