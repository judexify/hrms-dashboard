import { Plus } from "lucide-react";

export default function AddButton({ buttonText }) {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-[#7c3aed]/20">
      <Plus size={16} />
      {buttonText}
    </button>
  );
}
