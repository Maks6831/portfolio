import React from "react";
import Image from "next/image";
import { workExperience } from "@/content/site";
import { formatRange } from "@/lib/dates";

const Experience = () => {
  return (
    <div id="profile" className="py-20 w-full scroll-mt-24">
      <h2 className="heading">
        My <span className="text-accent">work experience</span>
      </h2>

      <div className="w-full mt-12 max-w-5xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-line"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {workExperience.map((experience) => (
              <div key={experience.id} className="relative pl-20 md:pl-28">
                {/* Timeline dot */}

                {/* Timeline icon */}
                <Image
                  src={experience.thumbnail}
                  alt={experience.title}
                  width={48}
                  height={48}
                  className="absolute left-2 md:left-5 top-0 w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-line"
                />

                <div
                  className="w-full text-text border border-line bg-bezel text-xl overflow-hidden rounded-lg"
                >
                  <div className=" min-w-full w-full p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-4">
                      <h2 className="text-2xl md:text-3xl text-left font-bold text-text mb-2">
                        {experience.title}
                      </h2>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-text-secondary">
                        <span className="font-semibold text-accent">
                          {experience.company}
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span className="text-sm">{experience.type}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-muted text-sm mt-1">
                        <span>{formatRange(experience.start, experience.end)}</span>
                        <span className="hidden md:inline">•</span>
                        <span>{experience.location}</span>
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-4">
                      <ul className="space-y-2">
                        {experience.responsibilities.map(
                          (responsibility, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-left text-text-secondary"
                            >
                              <span className="text-accent mr-2 mt-1 flex-shrink-0">
                                ▹
                              </span>
                              <span className="text-sm md:text-base leading-relaxed text-left">
                                {responsibility}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {experience.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs md:text-sm bg-stage text-accent rounded-full border border-line"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
