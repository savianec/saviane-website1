export type EnquiryRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  brief: string;
  timeline: string;
  budget: string;
  services: string[];
  contact_preference: string;
  phone: string | null;
  discovery_call_date: string | null;
  discovery_call_time: string | null;
  status: string;
};
