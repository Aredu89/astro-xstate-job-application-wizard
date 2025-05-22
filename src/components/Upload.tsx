import { Show } from "solid-js";

export default function UploadStep(props: {
    fileName: string;
    setFileName: (val: string) => void;
  }
) {
  return (
    <div class="space-y-2">
      <input
        type="file"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file) {
            props.setFileName(file.name);
          }
        }}
        class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
      />
      <Show when={props.fileName}>
        <p class="text-sm text-gray-700">Uploaded file: {props.fileName}</p>
      </Show>
    </div>
  );
};