export default function PortfolioStep(
  {
    portfolioLinks,
    setPortfolioLinks,
  }: {
    portfolioLinks: string;
    setPortfolioLinks: (val: string) => void;
  }
) {
  return (
    <div class="space-y-2">
      <textarea
        placeholder="Enter portfolio URLs (comma-separated)"
        value={portfolioLinks}
        onInput={(e) => setPortfolioLinks(e.currentTarget.value)}
        class="border p-2 rounded w-full"
        rows="4"
      />
    </div>
  );
};