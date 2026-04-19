import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 text-xs text-foreground/60">
        <p>
          &copy; {year} {siteConfig.name} by{" "}
          <a
            href={siteConfig.author.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-foreground"
          >
            {siteConfig.author.name}
          </a>
          . MIT licensed.
        </p>
        <a
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
