import type { FormData } from "../machines/types";

export default function ReviewInformationStep(
  { data }: { data: FormData }
) {
  return (
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Review Your Information</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm">
        <li><strong>Name:</strong> {data.name}</li>
        <li><strong>Email:</strong> {data.email}</li>
        <li><strong>Years Experience:</strong> {data.experienceYears}</li>
        <li><strong>Skills:</strong> {data.technologies}</li>
        <li><strong>Portfolio URL:</strong> {data.portfolioLinks}</li>
        <li><strong>Uploaded File:</strong> {data.fileName ?? 'None'}</li>
      </ul>
    </div>
  );
};