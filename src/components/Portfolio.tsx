import { useFormState } from "../context/FormStateContext";

export default function PortfolioStep() {
  const { form, setForm } = useFormState();
  return (
    <div class="space-y-2">
      <textarea
        placeholder="Enter portfolio URLs (comma-separated)"
        value={form().portfolioLinks}
        onInput={(e) => setForm({ portfolioLinks: e.currentTarget.value })}
        class="border p-2 rounded w-full"
        rows="4"
      />
    </div>
  );
};