import { useEffect, useRef, useState } from "react";
import { ArrowDown2 } from "iconsax-reactjs";
import { PRIVACY_OPTIONS, getPrivacyOption } from "../../constants/privacy";

function PrivacySelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeOutside(e: MouseEvent) {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  const current = getPrivacyOption(value);
  const CurrentIcon = current.icon;

  return (
    <div ref={wrapper} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer disabled:opacity-50"
      >
        <CurrentIcon size="14" color="currentColor" />
        {current.label}
        <ArrowDown2 size="12" color="currentColor" />
      </button>

      {open && (
        <ul className="absolute left-0 top-full mt-1 w-52 bg-white border rounded-lg shadow-lg z-30 overflow-hidden">
          {PRIVACY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (opt.value !== value) onChange(opt.value);
                  }}
                  className={`flex items-start gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 cursor-pointer ${
                    opt.value === value ? "bg-blue-50" : ""
                  }`}
                >
                  <Icon size="18" color="#4b5563" />
                  <span>
                    <span className="block text-sm font-medium">{opt.label}</span>
                    <span className="block text-xs text-gray-500">{opt.hint}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PrivacySelect;