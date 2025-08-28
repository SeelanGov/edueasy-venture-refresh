import { type Partner } from '@/types/PartnerTypes';
import { Building, Globe, Mail, Phone } from 'lucide-react';
import React from 'react';

interface PartnerProfileProps {
  partner: Partner;
}

export const PartnerProfile: React.FC<PartnerProfileProps> = ({ partner }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Building className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{partner.name}</h2>
          <p className="text-muted-foreground">{partner.type}</p>
        </div>
      </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
          <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{partner.name}</p>
                </div>
        
                <div>
          <label className="text-sm font-medium text-muted-foreground">Type</label>
          <p className="text-sm">{partner.type}</p>
                </div>
        
                <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${partner.email}`}
              className="text-sm text-info hover:underline">
              {partner.email}
                    </a>
                  </div>
                </div>
        
                <div>
          <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{partner.phone || '-'}</span>
                  </div>
                </div>
        
                  <div>
          <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                className="text-sm text-info hover:underline">
                        {partner.website}
                      </a>
            ) : (
              <span className="text-sm">-</span>
            )}
                    </div>
              </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Tier</label>
          <p className="text-sm">{partner.tier}</p>
                </div>
              </div>
      
      {/* Payment Records */}
                      <div>
        <h3 className="text-lg font-semibold mb-3">Payment Records</h3>
        {partner.payments?.length ? (
          partner.payments.map((payment, index) => (
            <div key={index} className="border rounded-lg p-4 mb-3">
              <p className="text-sm text-muted-foreground">
                Date: {payment.payment_date?.slice(0, 10)}
              </p>
              <p className="text-sm text-muted-foreground">
                Amount: {payment.amount}
              </p>
              <p className="text-sm text-muted-foreground">
                Tier: {payment.tier}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {payment.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No payment records found</p>
                        )}
                      </div>
      
      {/* Integration Status */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Integration Status</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">API Integration</span>
            <span className={`px-2 py-1 rounded text-xs ${
              partner.api_integration_status === 'completed' 
                ? 'bg-success/20 text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {partner.api_integration_status || 'pending'}
            </span>
                      </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Data Mapping</span>
            <span className={`px-2 py-1 rounded text-xs ${
              partner.data_mapping_status === 'completed' 
                ? 'bg-success/20 text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {partner.data_mapping_status || 'pending'}
            </span>
                    </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Testing</span>
            <span className={`px-2 py-1 rounded text-xs ${
              partner.testing_status === 'completed' 
                ? 'bg-success/20 text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {partner.testing_status || 'pending'}
            </span>
                </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Production</span>
            <span className={`px-2 py-1 rounded text-xs ${
              partner.production_status === 'completed' 
                ? 'bg-success/20 text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {partner.production_status || 'pending'}
            </span>
                </div>
                </div>
              </div>
      
      {/* Notes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Notes</h3>
        {partner.notes?.length ? (
          partner.notes.map((note, index) => (
            <div key={index} className="border rounded-lg p-4 mb-3">
              <p className="text-sm">{note.content}</p>
                  </div>
          ))
                ) : (
          <p className="text-muted-foreground text-center py-8">No notes available</p>
                )}
              </div>
    </div>
  );
};
