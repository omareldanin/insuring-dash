import { useState } from "react";
import { Phone, PhoneCall, Copy, X } from "lucide-react";

function PhoneNumberCell({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);

  const copyPhone = () => {
    navigator.clipboard.writeText(phone);
    alert("تم نسخ رقم الهاتف!");
  };

  return (
    <>
      {/* Phone icon inside table */}
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-800 transition">
        <Phone size={20} />
      </button>

      {/* Floating centered modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setOpen(false)}>
          {/* Modal box */}
          <div
            className="bg-white shadow-xl rounded-xl p-6 w-[280px] relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking content
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-center mb-4 text-gray-500">
              رقم الهاتف
            </h3>

            {/* Phone number */}
            <p className="text-center text-xl font-bold text-gray-900 mb-4">
              {phone}
            </p>

            <div className="flex justify-center gap-6">
              {/* Call */}
              <a
                href={`tel:${phone}`}
                className="text-green-600 hover:text-green-800 flex flex-col items-center">
                <PhoneCall size={26} />
                <span className="text-xs mt-1">اتصال</span>
              </a>

              {/* Copy */}
              <button
                onClick={copyPhone}
                className="text-gray-700 hover:text-gray-900 flex flex-col items-center">
                <Copy size={24} />
                <span className="text-xs mt-1">نسخ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhoneNumberCell;
