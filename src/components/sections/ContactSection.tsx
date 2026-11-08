import ButtonLink from "@/components/ui/ButtonLink";
import FlowSection from "@/components/ui/FlowSection";
import CopyEmail from "@/components/islands/CopyEmail";
import { contact } from "@/content/site";

// Flow section #contact. "Email me" (a mailto:) covers no-JS; "Copy email" is a <button> that only exists once its
// island hydrates. The address is plain text so the copy fallback has something to select.
const ContactSection = () => (
  <FlowSection id="contact" labelledBy="h-contact">
    <div>
      <p className="eyebrow">{contact.eyebrow}</p>
      <h2 id="h-contact">{contact.heading}</h2>
      <p className="sub">{contact.line}</p>
    </div>
    <div>
      <div className="btns">
        <ButtonLink href={`mailto:${contact.email}`}>Email me</ButtonLink>
        <CopyEmail email={contact.email} />
        <ButtonLink variant="secondary" href={contact.linkedin} external>
          LinkedIn
        </ButtonLink>
        <ButtonLink variant="secondary" href={contact.github} external>
          GitHub
        </ButtonLink>
        <ButtonLink variant="secondary" href={contact.cv.href} download>
          {contact.cv.label}
        </ButtonLink>
      </div>
      <p className="email-line" id="contact-email">
        {contact.email}
      </p>
    </div>
  </FlowSection>
);

export default ContactSection;
