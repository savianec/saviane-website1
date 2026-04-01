export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  githubUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
};

export const team: TeamMember[] = [
  {
    name: "Christian Saviane",
    role: "Co-Founder & Web, Automation Lead",
    bio: "Christian co-founded saviane to solve a problem he saw repeatedly: businesses held back by manual processes and disconnected systems. As Web and Automation Lead, he designs and builds the technical infrastructure that lets clients operate faster, leaner, and at scale.",
    image: "/images/team/christian-saviane.png",
  },
  {
    name: "Xavier Saviane",
    role: "Co-Founder & Social Media Campaign & Content Lead",
    bio: "Builds campaign systems your team can run: editorial calendars, creative that fits the brand, and content that earns attention without chasing trends. Clear reporting, realistic cadence, and messaging that stays on-strategy from brief to publish.",
    image: "/images/team/xavier-saviane.png",
  },
  {
    name: "Nikka Baylon",
    role: "Co-Founder & Digital Product Lead",
    bio: "Shapes product direction, UX clarity, and delivery rhythm, so roadmaps stay honest, stakeholders stay aligned, and shipped work matches what users actually need.",
    image: "/images/team/nikka-baylon.png",
  },
];
