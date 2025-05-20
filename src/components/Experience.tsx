export default function ExperienceStep({
  experienceYears,
  technologies,
  setExperienceYears,
  setTechnologies,
}: {
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
        value={experienceYears}
        onInput={(e) => setExperienceYears(e.currentTarget.valueAsNumber)}
        class="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Technologies used"
        value={technologies}
        onInput={(e) => setTechnologies(e.currentTarget.value)}
        class="border p-2 rounded w-full"
      />
    </div>
  );
};