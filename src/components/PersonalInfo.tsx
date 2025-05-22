export default function PersonalInfoStep(props: {
  name: string;
  email: string;
  setName: (val: string) => void;
  setEmail: (val: string) => void;
}) {
  return (
    <div class="space-y-2">
      <input
        placeholder="Your Name"
        value={props.name}
        onInput={(e) => props.setName(e.currentTarget.value)}
        class="border p-2 rounded w-full"
      />
      <input
        placeholder="Your Email"
        value={props.email}
        onInput={(e) => props.setEmail(e.currentTarget.value)}
        class="border p-2 rounded w-full"
      />
    </div>
  );
};
