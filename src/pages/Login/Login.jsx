import "./Login.css";
import { useState } from "react";
import dashboardPreview from "../../assets/dashboard-img.png"; // replace with your actual image path

function Login() {
  return (
    <section className="min-h-screen flex bg-[#0f172a]">
      <LoginSection />
    </section>
  );
}

function LoginSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";
  return (
    <>
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-12">
        <img
          src={dashboardPreview}
          alt="HRMS Dashboard Preview"
          className="w-full max-w-lg object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#7c3aed]/40">
              <span className="text-white text-base font-bold">∞</span>
            </div>
            <span className="text-[#f9fafb] text-xl font-bold tracking-wide">
              HRMS
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[#f9fafb] text-3xl font-bold mb-1">
              Welcome 🤝
            </h1>
            <p className="text-[#9ca3af] text-sm">Please login here</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#f9fafb] text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-[#334155] rounded-[9px] px-4 py-3 text-[#b99af0] placeholder-[#7c3aed] text-sm outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#f9fafb] text-sm font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-[#334155] rounded-[9px] px-4 py-3 text-[#b99af0] placeholder-[#7c3aed] text-sm outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
              />
            </div>

            {/* Remember me + Show Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#7c3aed] cursor-pointer"
                />
                <span className="text-[#f9fafb] text-sm group-hover:text-[#b99af0] transition-colors">
                  Remember me
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 accent-[#7c3aed] cursor-pointer"
                />
                <span className="text-[#f9fafb] text-sm group-hover:text-[#b99af0] transition-colors">
                  Show Password
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              disabled={!isFormValid}
              className={`w-full py-3.5 rounded-[10px] text-sm font-semibold uppercase tracking-widest transition-all duration-200 ${
                isFormValid
                  ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-[#7c3aed]/30 cursor-pointer"
                  : "bg-[#a78bfa] text-white/60 cursor-not-allowed"
              }`}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
