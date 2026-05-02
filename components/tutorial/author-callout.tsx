import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';

interface AuthorCalloutProps {
  name?: string;
  role?: string;
  bio?: string;
  avatarSrc?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

const GitHubIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
      -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
      .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
      -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
      .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
      .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
      0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LinkedInIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037
      -1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046
      c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
      7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063
      1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782
      13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542
      C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729
      C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function Avatar({ src, name, size }: { src?: string; name: string; size: number }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const sizeClass = size <= 36 ? 'w-9 h-9 text-[13px]' : 'w-12 h-12 text-[17px]';
  return (
    <div className={`${sizeClass} rounded-full bg-foreground/[0.08] flex-shrink-0 overflow-hidden flex items-center justify-center`}>
      {src
        ? <Image src={src} alt={name} width={size} height={size} className="w-full h-full object-cover" />
        : <span className="font-semibold text-foreground/60">{initials}</span>
      }
    </div>
  );
}

export function AuthorCalloutSidebar({
  name = siteConfig.author.name,
  role = siteConfig.author.role,
  bio = siteConfig.author.bio,
  avatarSrc = siteConfig.author.image,
  githubUrl = siteConfig.githubUrl,
  linkedinUrl = siteConfig.author.url,
}: AuthorCalloutProps) {
  return (
    <aside className="mt-9 border-t border-foreground/10 pt-7">
      <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
        About the author
      </p>
      <div className="mb-3 flex items-center gap-2.5">
        <Avatar src={avatarSrc} name={name} size={36} />
        <div>
          <div className="text-[13px] font-semibold leading-tight text-foreground">{name}</div>
          <div className="mt-0.5 text-[11px] text-foreground/40">{role}</div>
        </div>
      </div>
      <p className="mb-3.5 text-[12px] leading-relaxed text-foreground/60">{bio}</p>
      <div className="flex flex-col gap-1.5">
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11.5px] text-foreground/40 transition-colors hover:text-foreground">
            <GitHubIcon /> Open source on GitHub
          </a>
        )}
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11.5px] text-foreground/40 transition-colors hover:text-foreground">
            <LinkedInIcon /> LinkedIn
          </a>
        )}
      </div>
    </aside>
  );
}

export function AuthorCalloutInline({
  name = siteConfig.author.name,
  role = siteConfig.author.role,
  bio = siteConfig.author.bio,
  avatarSrc = siteConfig.author.image,
  githubUrl = siteConfig.githubUrl,
  linkedinUrl = siteConfig.author.url,
}: AuthorCalloutProps) {
  return (
    <section className="mt-16 border-t border-foreground/10 pt-10">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
        About the author
      </p>
      <div className="mb-4 flex items-center gap-3.5">
        <Avatar src={avatarSrc} name={name} size={48} />
        <div>
          <div className="text-base font-semibold text-foreground">{name}</div>
          <div className="mt-0.5 text-[13px] text-foreground/40">{role}</div>
        </div>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-foreground/70">{bio}</p>
      <div className="flex gap-5">
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-foreground/60 transition-colors hover:text-foreground">
            <GitHubIcon size={15} /> Open source on GitHub
          </a>
        )}
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-foreground/60 transition-colors hover:text-foreground">
            <LinkedInIcon size={15} /> LinkedIn
          </a>
        )}
      </div>
    </section>
  );
}
