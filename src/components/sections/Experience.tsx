import Chip from "@/components/ui/Chip";
import FlowSection from "@/components/ui/FlowSection";
import { experienceSection, workExperience } from "@/content/site";
import { formatRange } from "@/lib/dates";

// Flow section #profile: three role rows from workExperience in CV order. Durations are computed at build by
// formatRange (elapsed months), never typed.
const Experience = () => (
  <FlowSection id="profile" labelledBy="h-exp">
    <div>
      <p className="eyebrow">{experienceSection.eyebrow}</p>
      <h2 id="h-exp">{experienceSection.heading}</h2>
      <p className="sub">{experienceSection.sub}</p>
    </div>
    <div>
      {workExperience.map((r) => {
        const [dates, duration] = formatRange(r.start, r.end).split(" · ");
        return (
          <article key={r.id} className="role">
            <div className="when">
              <b>{dates}</b>
              {duration}
              <br />
              {r.type}
              <br />
              {r.location}
            </div>
            <div>
              <h3>{r.title}</h3>
              <p className="co">{r.company}</p>
              <ul>
                {r.responsibilities.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <ul role="list" className="chips" aria-label="Skills">
                {r.skills.map((k) => (
                  <li key={k}>
                    <Chip>{k}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  </FlowSection>
);

export default Experience;
