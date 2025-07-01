
export const EDUEASY_STATISTICS = {
  applicationSuccessRate: {
    value: "93%",
    label: "Application Success Rate",
    description: "Students who successfully get accepted",
    linkTo: "/institutions",
    icon: "CheckCircle"
  },
  studentsSupported: {
    value: "1,200+",
    label: "Students Supported",
    description: "Young South Africans guided to success",
    linkTo: "/testimonials",
    icon: "Users"
  },
  scholarshipsSecured: {
    value: "R45M+",
    label: "Scholarships Secured",
    description: "Financial support provided to students",
    linkTo: "/sponsorships",
    icon: "Award"
  },
  partnerInstitutions: {
    value: "50+",
    label: "Partner Institutions",
    description: "Universities and colleges in our network",
    linkTo: "/institutions",
    icon: "School"
  },
  ai247Support: {
    value: "24/7",
    label: "AI Support",
    description: "Thandi is always available to help",
    linkTo: "/meet-thandi",
    icon: "Bot"
  }
} as const;

export type StatisticKey = keyof typeof EDUEASY_STATISTICS;
