import { contact } from "@/content/site";

// Footer landmark: "©2026", the name, and the contact links. Keeps 96px clear below lg for the pill.
const SiteFooter = () => (
  <footer className="site-footer">
    <span>
      ©{new Date().getUTCFullYear()} {contact.name}
    </span>
    <span className="foot-links">
      <a href={`mailto:${contact.email}`}>Email</a>
      <a href={contact.linkedin}>LinkedIn</a>
      <a href={contact.github}>GitHub</a>
    </span>
  </footer>
);

export default SiteFooter;
