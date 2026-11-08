import { contact } from "@/content/site";

/** "©2026 Muhammad Ali Khan" under a hairline; 96px clear below lg for the phone pill. */
const CaseFooter = () => (
  <footer className="mx-5 border-t border-line pb-24 pt-[18px] font-mono text-[11px] uppercase tracking-[0.1em] text-muted md:mx-10 lg:mx-16 lg:pb-5">
    ©{new Date().getUTCFullYear()} {contact.name}
  </footer>
);

export default CaseFooter;
