import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useAuthStore } from '../store/authStore'
import api from '../lib/axios'

const EditProfile = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        newPassword: "",
    });

    const [errors, setErrors] = useState<Partial<typeof form>>({})

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    console.log("Current user in EditProfile:", user);

    useEffect(() => {
        if (!user) return;

        setForm((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
        }));
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const validate = () => {
        const newErrors: Partial<typeof form> = {};

        if (!form.name.trim()) {
            newErrors.name = "กรุณากรอกชื่อ";
        }

        if (!form.email.trim()) {
            newErrors.email = "กรุณากรอกอีเมล";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        }

        if (form.newPassword) {
            if (!form.password) {
                newErrors.password = "กรุณากรอกรหัสผ่านปัจจุบัน";
            }

            if (form.newPassword.length < 8) {
                newErrors.newPassword =
                    "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร";
            }

            if (form.newPassword !== form.password) {
                newErrors.password = "รหัสผ่านไม่ตรงกัน";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {

            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                newPassword: form.newPassword || undefined,
            };

            console.log("user", user);

            console.log("Submitting payload:", payload);

            const response = await api.put(
                `/users/${user?._id}`,
                payload
            );

            setUser(response.data.data);

            navigate("/info");
        } catch (error) {
            console.error(error);
        }
    };

    const EyeIcon = ({ open }: { open: boolean }) =>
        open ? (
            <span>👁️</span>
        ) : (
            <span>🙈</span>
        )

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f3ee] px-4">
            <div className="w-full max-w-md">

                <div className="bg-[#fffaf3] border border-[#e7dccf] rounded-2xl p-8 space-y-6 shadow-sm">

                    {/* Header */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-semibold text-[#3b2f2a]">
                            แก้ไขโปรไฟล์
                        </h1>
                        <p className="text-sm text-[#7a6a5f]">
                            อัปเดตข้อมูลส่วนตัวของคุณ
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Username */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">
                                ชื่อผู้ใช้
                            </Label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="h-11 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a]"
                            />
                            {errors.name && (
                                <p className="text-xs text-[#8a6f5a]">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                                className="h-11 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a]"
                            />
                            {errors.email && (
                                <p className="text-xs text-[#8a6f5a]">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password (optional) */}
                        <div className="space-y-1.5">
                            <Label className="text-sm text-[#5c4b42]">
                                รหัสผ่านใหม่ (ไม่ใส่ = ไม่เปลี่ยน)
                            </Label>

                            <div className="relative">
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="h-11 pr-10 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6a5f]"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-xs text-[#8a6f5a]">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        {form.password && (
                            <div className="space-y-1.5">
                                <Label className="text-sm text-[#5c4b42]">
                                    ยืนยันรหัสผ่าน
                                </Label>

                                <div className="relative">
                                    <Input
                                        name="newPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        className="h-11 pr-10 rounded-lg border-[#d8c8b8] bg-[#fffdf9] focus-visible:ring-1 focus-visible:ring-[#b89b7a]"
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

                                {errors.newPassword && (
                                    <p className="text-xs text-[#8a6f5a]">
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="space-y-3 pt-2">

                            <Button
                                type="submit"
                                className="w-full h-11 bg-[#a67c52] hover:bg-[#8f6844] text-white rounded-lg"
                            >
                                บันทึกการเปลี่ยนแปลง
                            </Button>

                            <Button
                                type="button"
                                onClick={() => navigate('/info')}
                                className="w-full h-11 border border-[#d8c8b8] text-[#3b2f2a] bg-transparent hover:bg-[#f2e9df]"
                            >
                                ยกเลิก
                            </Button>

                        </div>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-[#7a6a5f]">
                        Edit Profile Page
                    </p>

                </div>
            </div>
        </div>
    )
}

export default EditProfile