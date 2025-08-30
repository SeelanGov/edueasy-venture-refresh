/**
 * Centralized status to CSS class mapping
 * Prevents enum drift and ensures consistent styling
 */
export const statusPill = (val: string) => {
  switch (val) {
    case 'paid':
    case 'completed':
    case 'active':
    case 'approved':
      return 'bg-success/20 text-success';
    case 'pending':
    case 'in_progress':
    case 'submitted':
    case 'under-review':
      return 'bg-warning/20 text-warning';
    case 'failed':
    case 'error':
    case 'inactive':
    case 'rejected':
    case 'expired':
      return 'bg-destructive/20 text-destructive';
    case 'draft':
    case 'not_started':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};
