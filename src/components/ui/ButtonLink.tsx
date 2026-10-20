import Link from "next/link";
import ButtonLinkBase, { type ButtonLinkProps } from "@/components/ui/ButtonLinkBase";

/**
 * A link styled as a button. Internal routes (hrefs starting with "/") render through `next/link` for client-side
 * navigation and prefetch; `#` anchors, `mailto:`, downloads and external links stay plain `<a>`, and only
 * external links open a new tab (with the "(opens in a new tab)" hint).
 */
const ButtonLink = (props: ButtonLinkProps) => <ButtonLinkBase {...props} routeLink={Link} />;

export default ButtonLink;
