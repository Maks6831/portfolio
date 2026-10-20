// Story 2.9: render ButtonLinkBase directly (no browser, no test framework) with a stub `routeLink`, the slot ButtonLink
// fills with next/link, and check which hrefs go through it: internal routes do; `#` anchors, mailto:, http(s) and "//"
// URLs, downloads, links marked external and static files such as "/file.pdf" stay plain <a>. Only links marked
// external open a new tab, with rel and the "(opens in a new tab)" hint, and a download keeps its attribute.
import { compileComponents, renderTools } from "./lib/render-component.mjs";

const { load } = compileComponents({
  cacheName: "check-links",
  aliases: { "@/app/lib/utils": "./utils.js" },
  files: {
    "src/app/lib/utils.ts": "utils.js",
    "src/components/ui/ButtonLinkBase.tsx": "ButtonLinkBase.js",
  },
});
const ButtonLinkBase = await load("ButtonLinkBase.js");
const { h, render, failures, check } = await renderTools();

// Stands in for next/link: renders the same <a>, plus a marker attribute that shows the route path was taken.
const RouteStub = ({ href, className, children }) => h("a", { href, className, "data-route-link": "" }, children);

const cases = [
  { name: "internal route", props: { href: "/work/simply-happy" }, route: true },
  { name: "route with a home fragment", props: { href: "/#about" }, route: true },
  { name: "same-page anchor", props: { href: "#contact" }, route: false },
  { name: "mailto", props: { href: "mailto:x@y.z" }, route: false },
  { name: "external URL", props: { href: "https://example.com", external: true }, route: false },
  { name: "protocol-relative URL", props: { href: "//example.com" }, route: false },
  { name: "download", props: { href: "/file.pdf", download: true }, route: false },
  { name: "root path marked external", props: { href: "/work/simply-happy", external: true }, route: false },
  { name: "static file", props: { href: "/file.pdf" }, route: false },
];

for (const { name, props, route } of cases) {
  for (const variant of ["primary", "secondary"]) {
    const where = `${name} (${props.href}, ${variant})`;
    const html = render(h(ButtonLinkBase, { ...props, variant, routeLink: RouteStub }, "Label"));
    const tags = html.match(/<a\b[^>]*>/g) ?? [];
    check(tags.length === 1, `${where}: expected exactly one <a>, found ${tags.length}`);
    const tag = tags[0] ?? "";
    check(/\shref="([^"]*)"/.exec(tag)?.[1] === props.href.replace(/&/g, "&amp;"), `${where}: href must be ${props.href}`);
    check(/\sdata-route-link=/.test(tag) === route, `${where}: ${route ? "must" : "must not"} render through routeLink (next/link)`);
    const external = !!props.external;
    check(/\starget="_blank"/.test(tag) === external, `${where}: ${external ? "needs" : "must not have"} target="_blank"`);
    check(/\srel="noopener noreferrer"/.test(tag) === external, `${where}: ${external ? "needs" : "must not have"} rel="noopener noreferrer"`);
    check(html.includes("(opens in a new tab)") === external, `${where}: ${external ? "needs" : "must not have"} the "(opens in a new tab)" hint`);
    check(/\sdownload(?:=|[\s>])/.test(tag) === !!props.download, `${where}: ${props.download ? "must keep" : "must not have"} the download attribute`);
  }
}

// Without a routeLink (the not-found page's import) every href is a plain <a>, routes included.
const plain = render(h(ButtonLinkBase, { href: "/work/simply-happy" }, "Label"));
check(/^<a\b[^>]*\shref="\/work\/simply-happy"/.test(plain) && !/data-route-link/.test(plain), "no routeLink: an internal route renders as a plain <a>");

if (failures.length) {
  console.error(`check:links failed:\n - ${failures.join("\n - ")}`);
  process.exit(1);
}
console.log(`check:links ok: ButtonLinkBase routes ${cases.filter((c) => c.route).length} of ${cases.length} href kinds through next/link, as Story 2.9 specifies`);
