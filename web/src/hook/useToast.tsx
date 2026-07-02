import { useState } from 'react'
import Toast from '../components/ui/toast'

export const useToast = () => {
    const [toast, setToast] = useState<{
        message: string
        type: 'success' | 'error'
    } | null>(null)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
    }

    const ToastContainer = () =>
        toast ? (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
            />
        ) : null

    return { showToast, ToastContainer }
}