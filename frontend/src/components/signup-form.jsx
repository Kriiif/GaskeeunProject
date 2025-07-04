import { useState, useContext, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export function SignupForm({ className, ...props }) {
    const navigate = useNavigate()
    const { signup, loginWithGoogle, user } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    })
    const [errMsg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(false)

    // Handle redirect based on user role after signup
    useEffect(() => {
        if (!user) return;

        if (user.role === 'owner') {
            navigate('/dashboard-main');
        } else if (user.role === 'admin') {
            navigate('/dashboard-superAdmin');
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setErrMsg("")
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (formData.password !== formData.passwordConfirmation) {
            setErrMsg("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            // Remove passwordConfirmation before sending to API
            const { passwordConfirmation, ...signupData } = formData
            
            await signup(signupData)
            
            // Redirect akan ditangani oleh useEffect berdasarkan role

        } catch (error) {
            setErrMsg(error.message || "Signup failed")
            console.error("Signup failed:", error)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
                <form className="p-6 md:p-8">

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-balance text-muted-foreground">Join Gaskeeun today</p>
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Phone Number</Label>
                    <Input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="" required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" name="passwordConfirmation" value={formData.passwordConfirmation} onChange={handleChange} type="password" required />
                    </div>
                    {errMsg && (
                    <p className="text-red-500 text-sm text-center">{errMsg}</p>
                )}
                    <Button type="submit" onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-white px-2 text-muted-foreground">Or continue with</span>
                    </div>
                    <div className="grid gap-4">
                    <GoogleLogin
                        className="w-full bg-transparent"
                        onSuccess={async (credentialResponse) => {
                            try {
                                await loginWithGoogle(credentialResponse.credential);
                                // Redirect akan ditangani oleh useEffect berdasarkan role
                            } catch (error) {
                                setErrMsg(error.message || 'Google signup failed');
                            }
                        }}
                        onError={() => {
                            setErrMsg('Google signup failed');
                        }}
                    />
                    </div>
                    <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="underline underline-offset-4">
                        Sign in
                    </a>
                    </div>
                </div>
                </form>
                <div className="hidden justify-center items-center md:flex">
                <img
                    src="/logos/mukaijo_numpuk.png"
                    alt="Logo"
                    className="inset-4 bottom h-[25%] object-cover dark:brightness-[0.2] dark:grayscale"
                />
                </div>
            </CardContent>
            </Card>
        </div>
    )
}
