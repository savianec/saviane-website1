import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { ProjectRequestForm } from "@/components/forms/project-request-form";

export const metadata = {
  title: "Contact",
  description:
    "Start a project with saviane, share context in a few steps. We respond within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="New business"
        title="Start a project"
        description="No generic RFP theater, tell us what you are shipping and we will respond with a concrete next step."
      />
      <Container className="py-14 md:py-20">
        <ProjectRequestForm />
      </Container>
    </>
  );
}
