import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useToast } from '../hook/useToast'
import api from '../lib/axios'
import type { AxiosError } from 'axios'
import { useAuthStore } from "../store/authStore";

const Register = () => {
    const navigate = useNavigate()
    const { fetchMe } = useAuthStore();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState<Partial<typeof form>>({})
    const { showToast, ToastContainer } = useToast()
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const passwordRules = {
        minLength: form.password.length >= 8,
        hasUpperCase: /[A-Z]/.test(form.password),
        hasLowerCase: /[a-z]/.test(form.password),
        hasNumber: /[0-9]/.test(form.password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    }

    const validate = () => {
        const newErrors: Partial<typeof form> = {}

        if (!form.name) newErrors.name = 'กรุณากรอกชื่อผู้ใช้'

        if (!form.email) newErrors.email = 'กรุณากรอกอีเมล'
        else if (!/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'

        const isPasswordValid =
            passwordRules.minLength &&
            passwordRules.hasUpperCase &&
            passwordRules.hasLowerCase &&
            passwordRules.hasNumber &&
            passwordRules.hasSpecialChar

        if (!form.password) {
            newErrors.password = 'กรุณากรอกรหัสผ่าน'
        } else if (!isPasswordValid) {
            newErrors.password = 'รหัสผ่านยังไม่ปลอดภัย'
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
        } else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
        }

        return newErrors
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (loading) return

        setErrors({})

        const newErrors = validate()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            setLoading(true)

            await api.post("/auth/register", form)

            await fetchMe()

            showToast("Registration success 🎉", "success")

            setTimeout(() => {
                navigate("/info")
            }, 800)

        } catch (error) {
            const err = error as AxiosError<{ message: string }>

            showToast(
                err.response?.data?.message || "Registration failed",
                "error"
            )
        } finally {
            setLoading(false)
        }
    }

    const RuleItem = ({ label, valid }: { label: string; valid: boolean }) => (
        <div className="flex items-center gap-2">
            <span className={`text-sm ${valid ? 'text-green-600' : 'text-[#8a6f5a]'}`}>
                {valid ? '✔' : '•'}
            </span>
            <span className={valid ? 'text-green-700' : 'text-[#7a6a5f]'}>
                {label}
            </span>
        </div>
    )

    const EyeIcon = ({ open }: { open: boolean }) =>
        open ? (
            <span>👁️</span>
        ) : (
            <span>🙈</span>
        )
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f3ee] px-4">
            <ToastContainer />
            <div className="w-full max-w-md">

                <div className="bg-[#fffaf3] border border-[#e7dccf] rounded-2xl p-8 space-y-6 shadow-sm">

                    {/* Header */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-semibold text-[#3b2f2a]">
                            สมัครสมาชิก
                        </h1>
                        <p className="text-sm text-[#7a6a5f]">
                            สร้างบัญชีใหม่เพื่อเริ่มใช้งาน
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* name */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">ชื่อผู้ใช้</Label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`h-11 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a] ${errors.name ? 'border-[#a68a6a]' : ''
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-xs text-[#8a6f5a]">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">อีเมล</Label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`h-11 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a] ${errors.email ? 'border-[#a68a6a]' : ''
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-xs text-[#8a6f5a]">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">รหัสผ่าน</Label>

                            <div className="relative">
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`h-11 pr-10 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a] ${errors.password ? 'border-[#a68a6a]' : ''
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6a5f]"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>

                            {/* PASSWORD RULES */}
                            {form.password && (
                                <div className="mt-2 space-y-1 text-xs">
                                    <p className="text-[#7a6a5f]">
                                        รหัสผ่านควรประกอบด้วย:
                                    </p>

                                    <RuleItem label="อย่างน้อย 8 ตัวอักษร" valid={passwordRules.minLength} />
                                    <RuleItem label="ตัวพิมพ์ใหญ่ (A-Z)" valid={passwordRules.hasUpperCase} />
                                    <RuleItem label="ตัวพิมพ์เล็ก (a-z)" valid={passwordRules.hasLowerCase} />
                                    <RuleItem label="ตัวเลข (0-9)" valid={passwordRules.hasNumber} />
                                    <RuleItem label="อักขระพิเศษ" valid={passwordRules.hasSpecialChar} />
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-xs text-[#8a6f5a]">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">
                                ยืนยันรหัสผ่าน
                            </Label>

                            <div className="relative">
                                <Input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className={`h-11 pr-10 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a] ${errors.confirmPassword ? 'border-[#a68a6a]' : ''
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((p) => !p)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6a5f]"
                                >
                                    <EyeIcon open={showConfirmPassword} />
                                </button>
                            </div>

                            {errors.confirmPassword && (
                                <p className="text-xs text-[#8a6f5a]">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Button */}
                        <Button className="w-full h-11 bg-[#a67c52] hover:bg-[#8f6844] text-white rounded-lg">
                            สมัครสมาชิก
                            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-[#7a6a5f]">
                        มีบัญชีแล้ว?{' '}
                        <Link to="/" className="text-[#5c4b42] font-medium hover:underline">
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register