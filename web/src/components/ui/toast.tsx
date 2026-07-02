import { useEffect, useState } from 'react'

type ToastProps = {
    message: string
    type?: 'success' | 'error'
    onClose: () => void
}

const Toast = ({ message, type = 'success', onClose }: ToastProps) => {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false)
            setTimeout(onClose, 200)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className={`fixed top-5 right-5 z-50 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
        >
            <div
                className={`
                    px-4 py-3 rounded-xl shadow-md border text-sm
                    ${type === 'success'
                        ? 'bg-[#fffaf3] border-[#d8c8b8] text-[#3b2f2a]'
                        : 'bg-[#fff3f3] border-red-200 text-red-600'
                    }
                `}
            >
                <div className="flex items-center gap-2">
                    <span>
                        {type === 'success' ? '✔' : '⚠️'}
                    </span>
                    <span>{message}</span>
                </div>
            </div>
        </div>
    )
}

export default Toast