export default function PersonalInfoStep({
  name,
  email,
  setName,
  setEmail,
}: {
  name: string;
  email: string;
  setName: (val: string) => void;
  setEmail: (val: string) => void;
}) {
  return (
    <div class="space-y-2">
      <input
        placeholder="Your Name"
        value={name}
        onInput={(e) => setName(e.currentTarget.value)}
        class="border p-2 rounded w-full"
      />
      <input
        placeholder="Your Email"
        value={email}
        onInput={(e) => setEmail(e.currentTarget.value)}
        class="border p-2 rounded w-full"
      />
    </div>
  );
};
