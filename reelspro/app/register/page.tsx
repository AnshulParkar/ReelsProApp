"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { useNotification } from "../components/Notification";

function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { showNotification } = useNotification();

    const router = useRouter();

    // Password validation
    const passwordRequirements = {
        length: password.length >= 8,
        match: password === confirmPassword && confirmPassword !== "",
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password)
    };

    const isFormValid = email && password && confirmPassword && 
                       Object.values(passwordRequirements).every(req => req);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }
            
            showNotification("Account created successfully! Please sign in.", "success");
            router.push("/login");
        } catch (error: any) {
            showNotification(error.message || "Registration failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ReelsPro
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                    <p className="text-base-content/70">Join our community and start sharing</p>
                </div>

                {/* Form */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input input-bordered focus:input-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        className="input input-bordered focus:input-primary w-full pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Confirm Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className="input input-bordered focus:input-primary w-full pr-12"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            {password && (
                                <div className="bg-base-200 rounded-lg p-3 text-sm">
                                    <p className="font-medium mb-2">Password requirements:</p>
                                    <ul className="space-y-1">
                                        <li className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-success' : 'text-base-content/60'}`}>
                                            {passwordRequirements.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            At least 8 characters
                                        </li>
                                        <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-success' : 'text-base-content/60'}`}>
                                            {passwordRequirements.hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            Contains a number
                                        </li>
                                        <li className={`flex items-center gap-2 ${passwordRequirements.hasLetter ? 'text-success' : 'text-base-content/60'}`}>
                                            {passwordRequirements.hasLetter ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            Contains a letter
                                        </li>
                                        {confirmPassword && (
                                            <li className={`flex items-center gap-2 ${passwordRequirements.match ? 'text-success' : 'text-error'}`}>
                                                {passwordRequirements.match ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                Passwords match
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                                disabled={loading || !isFormValid}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        <div className="divider">or</div>

                        <div className="text-center">
                            <p className="text-base-content/70">
                                Already have an account?{" "}
                                <Link href="/login" className="link link-primary font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-base-content/60">
                    <p>
                        By creating an account, you agree to our{" "}
                        <a href="#" className="link link-primary">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="link link-primary">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;