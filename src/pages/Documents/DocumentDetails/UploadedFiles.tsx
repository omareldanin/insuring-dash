export default function UploadedFiles({
  files,
}: {
  files: { name: string; url: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {files.map((file, i) => (
        <a
          key={i}
          href={file.url}
          target="_blank"
          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
          📄 {file.name}
        </a>
      ))}
    </div>
  );
}
