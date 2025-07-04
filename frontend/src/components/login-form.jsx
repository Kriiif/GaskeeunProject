import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login, loginWithGoogle, user } = useAuth();  useEffect(() => {
    if (!user) return;

    if (user.role === 'owner') {
      navigate('/dashboard-main');
    } else if (user.role === 'admin') {
      navigate('/dashboard-superAdmin');
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errMsg, setErrMsg] = useState('');

  const handleChange = (e) => {
    setErrMsg('');
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      // Jangan navigate di sini
    } catch (error) {
      setErrMsg(error.message || 'Login failed');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Login to your Gaskeeun account</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>
              {errMsg && (
                <p className="text-red-500 text-sm text-center">{errMsg}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
              <div className="grid gap-4">
                <GoogleLogin
                  className="w-full bg-transparent"
                  onSuccess={(credentialResponse) => {
                    loginWithGoogle(credentialResponse.credential)
                      .catch((err) => {
                        console.error("Google login failed:", err);
                        setErrMsg("Google login failed");
                      });
                  }}
                  onError={() => {
                    console.log('Google Login Error');
                    setErrMsg("Google login failed");
                  }}
                />
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="hidden justify-center items-center md:flex">
            <img
              src="/logos/mukaijo.png"
              alt="Logo"
              className="inset-4 bottom h-[20%] object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
