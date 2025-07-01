import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export function SignupForm({ className, ...props }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    })
    const [errMsg, setErrMsg] = useState("")

    const handleChange = (e) => {
        setErrMsg("")
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.passwordConfirmation) {
            setErrMsg("Passwords do not match")
            return
        }

        try {
            const res = await axios.post("http://localhost:3000/api/v1/auth/signup", formData)

            // Cek status dan tampilkan pesan dari backend kalau bukan 201
            if (res.status !== 201) {
            setErrMsg(res.data.message || "Signup failed")
            return
            }

            // Jika sukses
            console.log("Signup success:", res.data)
            navigate("/dashboard-user")

        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Signup failed"
            setErrMsg(msg)
            console.error("Signup failed:", msg)
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
                    <Button type="submit" onClick={handleSubmit} className="w-full">
                    Create Account
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
                                if(data.message){
                                    setErrMsg(data.message)
                                } else {
                                    console.log("Logged in!", data);
                                    navigate('/dashboard-user');
                                }
                            });
                        }}
                        onError={() => {
                        console.log('Login Failed');
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
