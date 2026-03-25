export default function SearchBar({ query, handleInputChange }) {
  return (
    <>
      <svg
        className="text-[#9ca3af] w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="bg-transparent text-[#f9fafb] text-sm placeholder-[#9ca3af] outline-none w-full"
      />
    </>
  );
}
