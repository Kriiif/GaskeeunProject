import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Login to your Gaskeeun account</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" type="password" required />
              </div>
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
                    fetch('http://localhost:3000/api/v1/auth/login-google', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: credentialResponse.credential })
                    })
                    .then(res => res.json())
                    .then(data => {
                      console.log("Logged in!", data);
                      navigate('/dashboard-user');
                    });
                  }}
                  onError={() => {
                    console.log('Login Failed');
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
  )
}





// google login button
