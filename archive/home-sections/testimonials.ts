export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "saviane is the rare partner that can go deep on product and still care about typography. Our launch stayed on schedule without cutting quality.",
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStartup Co.",
  },
  {
    quote:
      "They challenged our assumptions politely, showed the trade-offs in plain numbers, and shipped code we did not dread inheriting.",
    name: "Daniel Ortiz",
    role: "CTO",
    company: "Brightline Analytics",
  },
  {
    quote:
      "From brand motion to the client portal, everything feels like one studio, not three vendors stitched together.",
    name: "Mei Lin",
    role: "Head of Marketing",
    company: "Northwind",
  },
];
