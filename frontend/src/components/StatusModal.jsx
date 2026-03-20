import React from 'react';
import { CheckCircle2, XCircle, X, AlertTriangle } from 'lucide-react';

const StatusModal = ({ isOpen, type = 'success', title, message, onClose, onAction, actionLabel }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const isConfirm = type === 'confirm';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="modal-content border rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-2xl"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <div className="flex justify-end p-4 pb-0">
                    <button
                        onClick={onClose}
                        className="p-2 border rounded-xl transition-all hover:opacity-70"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Icon + Content */}
                <div className="px-8 pb-2 text-center">
                    <div
                        className="mx-auto mb-5 flex items-center justify-center w-20 h-20 rounded-full"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                        {isConfirm ? (
                            <AlertTriangle size={44} style={{ color: 'var(--text-primary)' }} strokeWidth={1.8} />
                        ) : isSuccess ? (
                            <CheckCircle2 size={44} style={{ color: 'var(--text-primary)' }} strokeWidth={1.8} />
                        ) : (
                            <XCircle size={44} style={{ color: 'var(--text-primary)' }} strokeWidth={1.8} />
                        )}
                    </div>

                    <h3
                        className="text-2xl font-bold mb-2 tracking-tight"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {title}
                    </h3>
                    <p
                        className="text-sm font-medium leading-relaxed"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="p-8 pt-6 space-y-3">
                    <button
                        onClick={onAction}
                        className="w-full font-bold py-4 rounded-2xl transition-all active:scale-[0.98] text-xs uppercase tracking-widest"
                        style={{
                            backgroundColor: 'var(--btn-primary-bg)',
                            color: 'var(--btn-primary-text)',
                        }}
                    >
                        {actionLabel}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 font-bold border rounded-2xl transition-all text-[10px] uppercase tracking-widest"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
