import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-foreground/70">
        That page does not exist.{" "}
        <Link href="/" className="underline hover:text-foreground">
          Back to the tutorial
        </Link>
        .
      </p>
    </Container>
  );
}
