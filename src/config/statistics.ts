/**
 * EDUEASY_STATISTICS
 * @description Function
 */
export const EDUEASY_STATISTICS = {
  applicationSuccessRate: {
    value: '90%+',
    label: 'Target Success Rate',
    description: 'Our goal for student acceptance rates',
    linkTo: '/institutions',
    icon: 'Target',
    isTarget: true,
  },
  studentsSupported: {
    value: '100+',
    label: 'Students to Support',
    description: 'Building our community of South African students',
    linkTo: '/testimonials',
    icon: 'Users',
    isTarget: true,
  },
  scholarshipsSecured: {
    value: 'R5M+',
    label: 'Funding Goal',
    description: 'Target financial support for students',
    linkTo: '/sponsorships',
    icon: 'TrendingUp',
    isTarget: true,
  },
  partnerInstitutions: {
    value: '15+',
    label: 'Partner Network Goal',
    description: 'Building relationships with top institutions',
    linkTo: '/institutions',
    icon: 'Flag',
    isTarget: true,
  },
  ai247Support: {
    value: '24/7',
    label: 'AI Support',
    description: 'Thandi is always available to help',
    linkTo: '/meet-thandi',
    icon: 'Bot',
    isTarget: false,
  },
  // Additional honest statistics
  successfulApplications: {
    value: '500+',
    label: 'Applications Goal',
    description: 'Target successful applications by 2025',
    linkTo: '/dashboard',
    icon: 'Target',
    isTarget: true,
  },
  documentApproval: {
    value: '95%+',
    label: 'Document Success Target',
    description: 'Our goal for document verification',
    linkTo: '/profile-completion',
    icon: 'CheckCircle',
    isTarget: true,
  },
  studentSatisfaction: {
    value: '4.8/5',
    label: 'Satisfaction Goal',
    description: 'Target student experience rating',
    linkTo: '/testimonials',
    icon: 'Award',
    isTarget: true,
  },
} as const;

export type StatisticKey = keyof typeof EDUEASY_STATISTICS;
