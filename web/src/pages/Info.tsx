import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/axios'

const Info = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user);

    console.log('User info:', user)


    const handleLogout = async () => {
        try {
            await api.post('/auth/logout')
            useAuthStore.getState().logout()
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-[#fffaf3] border border-[#e7dccf] rounded-2xl shadow-sm p-8 space-y-6">

                    {/* Header */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-semibold text-[#3b2f2a]">
                            ยินดีต้อนรับ คุณ {user?.name} 👋
                        </h1>
                        <p className="text-sm text-[#7a6a5f]">
                            คุณเข้าสู่ระบบสำเร็จแล้ว
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="space-y-3 bg-[#fffdf9] border border-[#e7dccf] rounded-xl p-4">

                        <div className="flex justify-between text-sm">
                            <span className="text-[#7a6a5f]">Username</span>
                            <span className="text-[#3b2f2a] font-medium">
                                {user?.name}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-[#7a6a5f]">Email</span>
                            <span className="text-[#3b2f2a] font-medium">
                                {user?.email}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">

                        <button
                            onClick={() => navigate('/info/edit')}
                            className="w-full h-11 rounded-lg border border-[#d8c8b8] text-[#3b2f2a] hover:bg-[#f2e9df] transition"
                        >
                            ดูโปรไฟล์
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full h-11 rounded-lg bg-[#a67c52] hover:bg-[#8f6844] text-white transition"
                        >
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info