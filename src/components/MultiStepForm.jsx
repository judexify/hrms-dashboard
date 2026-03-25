export default function MultiStep({
  onClose,
  step,
  formData,
  onNext,
  onBack,
  onChange,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg mx-4 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#334155]">
          <div>
            <h2 className="text-[#f9fafb] text-lg font-semibold">
              Add New Employee
            </h2>
            <p className="text-[#9ca3af] text-sm mt-0.5">
              {step === 1 ? "Personal Information" : "Professional Information"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 px-6 py-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  step === s
                    ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                    : step > s
                      ? "bg-[#7c3aed]/20 border-[#7c3aed] text-[#7c3aed]"
                      : "bg-transparent border-[#334155] text-[#9ca3af]"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              <span
                className={`text-sm font-medium ${step >= s ? "text-[#f9fafb]" : "text-[#9ca3af]"}`}
              >
                {s === 1 ? "Personal" : "Professional"}
              </span>
              {s < 2 && (
                <div
                  className={`flex-1 h-px ${step > s ? "bg-[#7c3aed]" : "bg-[#334155]"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div className="px-6 pb-4 space-y-4">
          {step === 1 ? (
            <>
              <Field
                label="Full Name"
                name="name"
                type="text"
                placeholder="e.g. Victor John"
                value={formData.name}
                onChange={onChange}
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="e.g. victor@company.com"
                value={formData.email}
                onChange={onChange}
              />
              <Field
                label="Phone Number"
                name="phone"
                type="text"
                placeholder="e.g. +1 (555) 000-0000"
                value={formData.phone}
                onChange={onChange}
              />
              <Field
                label="Location"
                name="location"
                type="text"
                placeholder="e.g. Miami, FL"
                value={formData.location}
                onChange={onChange}
              />
            </>
          ) : (
            <>
              <Field
                label="Job Title"
                name="title"
                type="text"
                placeholder="e.g. HR Manager"
                value={formData.title}
                onChange={onChange}
              />
              <Field
                label="Role"
                name="role"
                type="text"
                placeholder="e.g. Team Lead"
                value={formData.role}
                onChange={onChange}
              />
              <SelectField
                label="Department"
                name="department"
                value={formData.department}
                onChange={onChange}
                options={[
                  "Design",
                  "Engineering",
                  "Marketing",
                  "Sales",
                  "Product",
                  "Finance",
                  "IT",
                  "Analytics",
                  "Operations",
                  "Support",
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Employment Type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={onChange}
                  options={["Full-Time", "Part-Time", "Contract", "Internship"]}
                />
                <SelectField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  options={["Permanent", "Temporary", "Probation"]}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#334155]">
          <button
            onClick={step === 1 ? onClose : onBack}
            className="px-5 py-2.5 text-sm text-[#9ca3af] border border-[#334155] rounded-lg hover:text-[#f9fafb] hover:border-[#9ca3af] transition-all"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={step === 1 ? onNext : onSubmit}
            className="px-5 py-2.5 text-sm font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg transition-all shadow-lg shadow-[#7c3aed]/30"
          >
            {step === 1 ? "Next →" : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#f9fafb] text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f9fafb] placeholder-[#475569] text-sm outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#f9fafb] text-sm font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f9fafb] text-sm outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all cursor-pointer"
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
