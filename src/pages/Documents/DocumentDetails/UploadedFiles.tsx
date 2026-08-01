import { FileText } from "lucide-react";

const isImage = (url: string) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(url);

export default function UploadedFiles({
  files,
  title,
}: {
  files: { name: string; url: string }[];
  title?: string;
}) {
  return (
    <div>
      {title && <p className="text-xs text-gray-400 mb-2">{title}</p>}
      <div className="flex flex-wrap gap-3">
        {files.map((file, i) =>
          isImage(file.url) ? (
            <a
              key={i}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="group block w-28">
              <div className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="mt-1 text-xs text-center text-gray-500 truncate">
                {file.name}
              </p>
            </a>
          ) : (
            <a
              key={i}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition">
              <FileText size={15} />
              {file.name}
            </a>
          ),
        )}
      </div>
    </div>
  );
}
