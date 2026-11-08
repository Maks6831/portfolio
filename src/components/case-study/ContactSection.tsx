import CopyEmail from "@/components/islands/CopyEmail";
import ButtonLink from "@/components/ui/ButtonLink";
import { contact } from "@/content/site";
import SectionFrame, { type TrailPosition } from "./SectionFrame";

/** 07 Contact: the availability line above the contact buttons; the section is the `#contact` target. */
const ContactSection = ({ trail }: { trail?: TrailPosition }) => (
  <SectionFrame id="contact" title={contact.heading} trail={trail}>
    <p className="m-0 max-w-[52ch] text-[17px] leading-[1.48] text-text-secondary md:text-[20px]">{contact.line}</p>
    <div className="mt-5 flex flex-col items-start gap-2.5 md:flex-row md:flex-wrap md:items-center">
      <ButtonLink href={`mailto:${contact.email}`} className="max-md:w-full">
        Email me
      </ButtonLink>
      <CopyEmail email={contact.email} />
    </div>
    <div className="mt-2.5 flex flex-col gap-2.5 md:flex-row md:flex-wrap">
      <ButtonLink variant="secondary" href={contact.linkedin} external className="max-md:w-full">
        LinkedIn
      </ButtonLink>
      <ButtonLink variant="secondary" href={contact.github} external className="max-md:w-full">
        GitHub
      </ButtonLink>
      <ButtonLink href={contact.cv.href} variant="secondary" download className="max-md:w-full">
        {contact.cv.label}
      </ButtonLink>
    </div>
  </SectionFrame>
);

export default ContactSection;
