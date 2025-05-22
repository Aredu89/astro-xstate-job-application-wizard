import type { FormData } from "../machines/types";

export default function ReviewInformationStep(
  props: { data: FormData }
) {
  return (
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Review Your Information</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm">
        <li><strong>Name:</strong> {props.data.name}</li>
        <li><strong>Email:</strong> {props.data.email}</li>
        <li><strong>Years Experience:</strong> {props.data.experienceYears}</li>
        <li><strong>Skills:</strong> {props.data.technologies}</li>
        <li><strong>Portfolio URL:</strong> {props.data.portfolioLinks}</li>
        <li><strong>Uploaded File:</strong> {props.data.fileName ?? 'None'}</li>
      </ul>
    </div>
  );
};