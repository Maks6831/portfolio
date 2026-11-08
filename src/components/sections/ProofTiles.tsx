import ProofTile from "@/components/ui/ProofTile";
import Sheet from "@/components/ui/Sheet";
import { proofSection, proofTiles } from "@/content/site";

// Sheet 02 (#proof): four tiles, 2 x 2.
const ProofTiles = () => (
  <Sheet n={2} id="proof" labelledBy="h-proof">
    <div>
      <p className="eyebrow">{proofSection.eyebrow}</p>
      <h2 id="h-proof">{proofSection.heading}</h2>
    </div>
    <ul role="list" className="tiles">
      {proofTiles.map((t) => (
        <li key={t.id}>
          <ProofTile title={t.title} body={t.body} chip={t.chip} link={"link" in t ? t.link : undefined} />
        </li>
      ))}
    </ul>
  </Sheet>
);

export default ProofTiles;
