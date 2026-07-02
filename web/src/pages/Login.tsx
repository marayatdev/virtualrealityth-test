import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/axios'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useToast } from '../hook/useToast'
import { useAuthStore } from '../store/authStore'

const Login = () => {
    const navigate = useNavigate()
    const { showToast, ToastContainer } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const { fetchMe } = useAuthStore();
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState<Partial<typeof form>>({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const validate = () => {
        const newErrors: Partial<typeof form> = {}

        if (!form.email) {
            newErrors.email = 'กรุณากรอกอีเมล'
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
        }

        if (!form.password) {
            newErrors.password = 'กรุณากรอกรหัสผ่าน'
        } else if (form.password.length < 6) {
            newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
        }

        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            setLoading(true)

            await api.post('/auth/login', form)

            await fetchMe()

            showToast('Login success 🎉', 'success')

            setTimeout(() => {
                navigate('/info')
            }, 800)

        } catch (err: any) {
            showToast(
                err.response?.data?.message || 'Login failed',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }

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
                            เข้าสู่ระบบ
                        </h1>
                        <p className="text-sm text-[#7a6a5f]">
                            ยินดีต้อนรับกลับ
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">
                                อีเมล
                            </Label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`h-11 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a] ${errors.email ? 'border-red-400' : ''
                                    }`}
                                placeholder="example@email.com"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">
                                รหัสผ่าน
                            </Label>
                            <div className="relative">
                                <Input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`h-11 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a] ${errors.password ? 'border-red-400' : ''
                                        }`}
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6a5f]"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-[#a67c52] hover:bg-[#8f6844] text-white rounded-lg transition"
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-[#7a6a5f]">
                        ยังไม่มีบัญชี?{' '}
                        <Link
                            to="/register"
                            className="text-[#3b2f2a] font-medium hover:underline"
                        >
                            สมัครสมาชิก
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login