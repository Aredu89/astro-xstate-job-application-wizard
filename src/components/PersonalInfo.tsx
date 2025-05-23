import { useFormState } from "../context/FormStateContext";

export default function PersonalInfoStep() {
  const { form, setForm } = useFormState();
  return (
    <div class="space-y-2">
      <input
        placeholder="Your Name"
        value={form().name}
        onInput={(e) => setForm({ name: e.currentTarget.value })}
        class="border p-2 rounded w-full"
      />
      <input
        placeholder="Your Email"
        value={form().email}
        onInput={(e) => setForm({ email: e.currentTarget.value })}
        class="border p-2 rounded w-full"
      />
    </div>
  );
};
