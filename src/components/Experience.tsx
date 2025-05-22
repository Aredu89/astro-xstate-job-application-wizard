export default function ExperienceStep(props: {
  experienceYears: number | '';
  technologies: string;
  setExperienceYears: (val: number) => void;
  setTechnologies: (val: string) => void;
}) {
  return (
    <div class="space-y-2">
      <input
        type="number"
        placeholder="Years of Experience"
        value={props.experienceYears}
        onInput={(e) => props.setExperienceYears(e.currentTarget.valueAsNumber)}
        class="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Technologies used"
        value={props.technologies}
        onInput={(e) => props.setTechnologies(e.currentTarget.value)}
        class="border p-2 rounded w-full"
      />
    </div>
  );
};