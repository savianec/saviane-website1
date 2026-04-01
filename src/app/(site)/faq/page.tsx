import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { faqCategories } from "@/lib/content/faq";
import FAQs from "@/components/ui/text-reveal-faqs";

export const metadata = {
  title: "FAQ",
  description:
    "Process, pricing, timelines, technical approach, and support, straight answers.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description="If you do not see your scenario, email us, we respond within one business day."
      />
      <Container className="py-14 md:py-20">
        <FAQs categories={faqCategories} />
      </Container>
    </>
  );
}
