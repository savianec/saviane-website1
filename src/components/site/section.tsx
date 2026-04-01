import { cn } from "@/lib/utils";
import { Container } from "@/components/site/container";

export function Section({
  className,
  containerClassName,
  children,
  id,
}: {
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
