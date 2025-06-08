import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, CircleAlert } from 'lucide-react';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleSignInClick = () => {
        navigate("/Login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulated API call for demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate success for demo
            setMessage('A reset link has been sent to your email.');
            setIsSubmitted(true);
        } catch (error) {
            setError('An error occurred. Please try again.');
            setTimeout(() => setError(''), 4000);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Main container */}
        <div className="relative w-full max-w-md z-10">
            {/* Glassmorphism card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
                    <p className="text-gray-300">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 backdrop-blur-sm">
                        <CircleAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Success message */}
                {message && !error && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 backdrop-blur-sm">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{message}</span>
                    </div>
                )}

                {/* Form section */}
                <div className="space-y-6">
                    {/* Email field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                placeholder="name@example.com"
                                required
                                disabled={isSubmitted}
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || isSubmitted || !email}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    >
                        {isSubmitted ? (
                            <div className="flex items-center justify-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-white" />
                                <span>Check your Email</span>
                            </div>
                        ) : isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Sending...</span>
                            </div>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    {/* Back to login */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleSignInClick}
                            className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 font-medium transition-colors hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Sign In</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-green-500/20 to-lime-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-xl"></div>
        </div>
    </div>
);
}