export default function PortfolioStep(props: {
    portfolioLinks: string;
    setPortfolioLinks: (val: string) => void;
  }
) {
  return (
    <div class="space-y-2">
      <textarea
        placeholder="Enter portfolio URLs (comma-separated)"
        value={props.portfolioLinks}
        onInput={(e) => props.setPortfolioLinks(e.currentTarget.value)}
        class="border p-2 rounded w-full"
        rows="4"
      />
    </div>
  );
};