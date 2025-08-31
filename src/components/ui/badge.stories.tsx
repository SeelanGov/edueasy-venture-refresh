import type { Meta, StoryObj } from '@storybook/react';
import { Badge, mapStatusToBadgeVariant } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Badge component with semantic variants using design system tokens.

## Usage
- Use semantic variants (success, warning, destructive, info, muted) instead of custom colors
- Leverage \`mapStatusToBadgeVariant\` utility for consistent status mapping
- All colors use CSS variables for proper light/dark mode support

## Design System Compliance
✅ Uses semantic tokens from CSS variables  
✅ No hardcoded colors (hex or Tailwind palettes)  
✅ Automatic light/dark mode support
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info', 'muted'],
      description: 'Badge variant using semantic design tokens'
    },
    children: {
      control: 'text',
      description: 'Badge content'
    }
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'Default',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning', 
    children: 'Warning',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive', 
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'Muted',
  },
};

// Status mapping examples
export const StatusMapping: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[
        'approved', 'completed', 'active', 'paid',
        'pending', 'in_progress', 'submitted', 
        'rejected', 'failed', 'expired', 'cancelled',
        'draft', 'new', 'unknown'
      ].map(status => (
        <Badge key={status} variant={mapStatusToBadgeVariant(status)}>
          {status}
        </Badge>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows automatic status-to-variant mapping for consistent badge usage across the application.'
      }
    }
  }
};

// Comprehensive variant showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants showcasing the design system tokens in both light and dark themes.'
      }
    }
  }
};