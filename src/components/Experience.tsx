import React from "react";
import Image from "next/image";
import { workExperience } from "@/app/data";
import { Button } from "./ui/MovingBorders";

const Experience = () => {
  return (
    <div className="py-20 w-full">
      <h1 className="heading">
        My <span className="text-purple">work experience</span>
      </h1>

      <div className="w-full mt-12 max-w-5xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple via-purple/50 to-transparent"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {workExperience.map((experience, index) => (
              <div key={experience.id} className="relative pl-20 md:pl-28">
                {/* Timeline dot */}

                {/* Timeline icon */}
                <Image
                  src={experience.thumbnail}
                  alt={experience.title}
                  width={48}
                  height={48}
                  className="absolute left-2 md:left-5 top-0 w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-purple/30"
                />

                <Button
                  duration={Math.floor(Math.random() * 10000) + 10000}
                  borderRadius="1.75rem"
                  style={{
                    background: "rgb(4,7,29)",
                    backgroundColor:
                      "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    borderRadius: `calc(1.75rem* 0.96)`,
                  }}
                  className="w-full text-white border-neutral-200 dark:border-slate-800"
                >
                  <div className=" min-w-full w-full p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-4">
                      <h2 className="text-2xl md:text-3xl text-left font-bold text-white mb-2">
                        {experience.title}
                      </h2>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-white-100">
                        <span className="font-semibold text-purple">
                          {experience.company}
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span className="text-sm">{experience.type}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-white-200 text-sm mt-1">
                        <span>{experience.date}</span>
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
                              className="flex items-start text-left text-white-100"
                            >
                              <span className="text-purple mr-2 mt-1 flex-shrink-0">
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
                          className="px-3 py-1 text-xs md:text-sm bg-purple/10 text-purple rounded-full border border-purple/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
