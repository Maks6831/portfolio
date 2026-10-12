import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { IoMail, IoDocumentTextOutline } from "react-icons/io5";

import { contact } from "@/content/site";
import ButtonLink from "@/components/ui/ButtonLink";
import CopyEmail from "@/components/islands/CopyEmail";

const Footer = () => {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="w-full mb-[100px] md:mb-5 pb-10" id="contact">
      <div className="flex flex-col items-center text-center">
        <h2 className="heading lg:max-w-[45vw]">{contact.heading}</h2>
        <p className="my-5 text-text-secondary md:mt-8">{contact.line}</p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ButtonLink href={`mailto:${contact.email}`} icon={<IoMail aria-hidden="true" />}>
            Email me
          </ButtonLink>
          <CopyEmail email={contact.email} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink
            variant="secondary"
            href={contact.linkedin}
            external
            icon={<FaLinkedin aria-hidden="true" />}
          >
            LinkedIn
          </ButtonLink>
          <ButtonLink
            variant="secondary"
            href={contact.github}
            external
            icon={<FaGithub aria-hidden="true" />}
          >
            GitHub
          </ButtonLink>
          <ButtonLink
            href={contact.cv.href}
            variant="secondary"
            download
            icon={<IoDocumentTextOutline aria-hidden="true" />}
          >
            {contact.cv.label}
          </ButtonLink>
        </div>
      </div>
      <p className="mt-16 text-center text-sm text-text-muted">
        Copyright © {year} {contact.name}
      </p>
    </footer>
  );
};

export default Footer;
