
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'google' | 'phone'>('google');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate Google OAuth Redirect/Callback
    setTimeout(() => {
      const mockUser: User = {
        rrr: `google-${Date.now()}`,
        emailId: 'alex.power@gmail.com',
        createdAt: Date.now(),
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setShowOtp(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        rrr: `phone-${phone}`,
        emailId: `user-${phone}@gym.com`,
        phoneNumber: phone,
        createdAt: Date.now(),
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row items-stretch bg-black overflow-hidden">
      {/* Visual Side */}
      <div className="hidden md:flex flex-1 relative items-center justify-center bg-neutral-900">
        <img 
          src="https://picsum.photos/1200/1200?grayscale" 
          alt="Gym" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-12">
          <h1 className="font-heading text-7xl font-bold italic tracking-tighter text-white mb-4">PULSE<br/>LIMITS</h1>
          <p className="text-xl text-orange-500 font-medium">Redefine your boundaries with IronPulse.</p>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-950">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center md:text-left">
            <h2 className="font-heading text-4xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400">Join the elite fitness community.</p>
          </div>

          <div className="bg-neutral-900/50 p-8 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
            <div className="flex mb-8 bg-black/40 p-1 rounded-xl">
              <button 
                onClick={() => setMethod('google')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${method === 'google' ? 'bg-neutral-800 text-white shadow-lg' : 'text-gray-500'}`}
              >
                Google
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${method === 'phone' ? 'bg-neutral-800 text-white shadow-lg' : 'text-gray-500'}`}
              >
                Phone
              </button>
            </div>

            {method === 'google' ? (
              <div className="space-y-6">
                <p className="text-sm text-gray-400 text-center">Login securely with your Gmail account to sync your fitness journey.</p>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-4 bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="G" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {!showOtp ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-orange-600 transition-colors"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !phone}
                      className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Enter 6-Digit OTP</label>
                      <input 
                        type="text" 
                        placeholder="0 0 0 0 0 0"
                        maxLength={6}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[1em] focus:outline-none focus:border-orange-600 transition-colors"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowOtp(false)}
                      className="w-full text-xs text-gray-500 hover:text-white"
                    >
                      Change Phone Number
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
          
          <p className="mt-12 text-center text-xs text-gray-600">
            By continuing, you agree to IronPulse's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
