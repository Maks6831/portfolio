import { email, gridItems } from "@/content/site";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import CopyEmail from "@/components/islands/CopyEmail";

const Grid = () => {
  return (
    <section id="about">
      <BentoGrid className="w-full py-20">
        {gridItems.map((item) => (
          <BentoGridItem
            id={item.id}
            key={item.id}
            title={item.title}
            description={item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
            action={item.id === 6 ? <CopyEmail email={email} /> : undefined}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;
