import { useFormState } from "../context/FormStateContext";

export default function ExperienceStep() {
  const { form, setForm } = useFormState();
  return (
    <div class="space-y-2">
      <input
        type="number"
        placeholder="Years of Experience"
        value={form().experienceYears}
        onInput={(e) => setForm({ experienceYears: e.currentTarget.valueAsNumber })}
        class="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Technologies used"
        value={form().technologies}
        onInput={(e) => setForm({ technologies: e.currentTarget.value })}
        class="border p-2 rounded w-full"
      />
    </div>
  );
};