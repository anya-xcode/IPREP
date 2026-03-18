import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, Building2, Briefcase, Code, HelpCircle, Star, MessageSquare, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import API_URL from '../api/config';

const Upload = () => {
    const [common, setCommon] = useState({
        company: '',
        role: '',
        interviewRound: '',
        difficulty: 'MEDIUM',
        category: 'TECHNICAL',
        experience: ''
    });

    const [questions, setQuestions] = useState([
        { id: Date.now(), description: '', techStack: [], tempTech: '' }
    ]);

    const [isRoleOther, setIsRoleOther] = useState(false);
    const [isRoundOther, setIsRoundOther] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now(), description: '', techStack: [], tempTech: '' }]);
    };

    const removeQuestion = (id) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleAddTech = (e, qId) => {
        const q = questions.find(q => q.id === qId);
        if (e.key === 'Enter' && q.tempTech.trim()) {
            e.preventDefault();
            if (!q.techStack.includes(q.tempTech.trim())) {
                updateQuestion(qId, 'techStack', [...q.techStack, q.tempTech.trim()]);
                updateQuestion(qId, 'tempTech', '');
            }
        }
    };

    const removeTech = (qId, tech) => {
        const q = questions.find(q => q.id === qId);
        updateQuestion(qId, 'techStack', q.techStack.filter(t => t !== tech));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Submit each question sequentially
            const promises = questions.map(q => {
                const payload = {
                    ...common,
                    description: q.description,
                    techStack: q.techStack
                };
                return axios.post(`${API_URL}/api/questions`, payload);
            });

            await Promise.all(promises);
            alert("All questions submitted successfully! Waiting for admin approval.");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="border rounded-[2rem] p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between mb-10 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                            <Send size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>Experience Share</h1>
                            <p className="font-medium tracking-tight" style={{ color: 'var(--text-muted)' }}>Post multiple questions from your interview.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Common Details Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 style={{ color: 'var(--text-primary)' }} size={20} />
                            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Interview Context</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Company</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 border rounded-xl transition-all font-medium"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    placeholder="e.g. Google"
                                    value={common.company}
                                    onChange={e => setCommon({ ...common, company: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Role</label>
                                <select
                                    required={!isRoleOther}
                                    className="w-full px-4 py-3 border rounded-xl transition-all font-medium appearance-none cursor-pointer"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    value={isRoleOther ? 'Other' : common.role}
                                    onChange={e => {
                                        if (e.target.value === 'Other') {
                                            setIsRoleOther(true);
                                            setCommon({ ...common, role: '' });
                                        } else {
                                            setIsRoleOther(false);
                                            setCommon({ ...common, role: e.target.value });
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="Full stack">Full stack</option>
                                    <option value="SDE (Frontend)">SDE (Frontend)</option>
                                    <option value="Data Scientist">Data Scientist</option>
                                    <option value="ML Engineer">ML Engineer</option>
                                    <option value="SDE (Backend)">SDE (Backend)</option>
                                    <option value="Cyber Security Engineer">Cyber Security Engineer</option>
                                    <option value="Data Analyst">Data Analyst</option>
                                    <option value="Other">Other</option>
                                </select>
                                {isRoleOther && (
                                    <input
                                        required
                                        className="w-full mt-2 px-4 py-3 border rounded-xl transition-all font-medium"
                                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                        placeholder="Specify your role"
                                        value={common.role}
                                        onChange={e => setCommon({ ...common, role: e.target.value })}
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Round</label>
                                <select
                                    required={!isRoundOther}
                                    className="w-full px-4 py-3 border rounded-xl transition-all font-medium appearance-none cursor-pointer"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    value={isRoundOther ? 'Other' : common.interviewRound}
                                    onChange={e => {
                                        if (e.target.value === 'Other') {
                                            setIsRoundOther(true);
                                            setCommon({ ...common, interviewRound: '' });
                                        } else {
                                            setIsRoundOther(false);
                                            setCommon({ ...common, interviewRound: e.target.value });
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select Round</option>
                                    <option value="Technical Round 1">Technical Round 1</option>
                                    <option value="Technical Round 2">Technical Round 2</option>
                                    <option value="HR Round">HR Round</option>
                                    <option value="Other">Other</option>
                                </select>
                                {isRoundOther && (
                                    <input
                                        required
                                        className="w-full mt-2 px-4 py-3 border rounded-xl transition-all font-medium"
                                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                        placeholder="Specify the round"
                                        value={common.interviewRound}
                                        onChange={e => setCommon({ ...common, interviewRound: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Questions List */}
                    <div className="space-y-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare style={{ color: 'var(--text-primary)' }} size={20} />
                                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Questions Faced</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm"
                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            >
                                <Plus size={16} /> Add Question
                            </button>
                        </div>

                        {questions.map((question, index) => (
                            <div key={question.id} className="relative group border rounded-2xl p-6 transition-all"
                                 style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                <div className="flex items-start justify-between gap-6 mb-4">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full border text-[10px] font-black"
                                                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 relative">
                                                <input
                                                    className="w-full bg-transparent border-b py-2 focus:outline-none transition-all font-medium pr-12 text-sm"
                                                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                    placeholder="Independent Tech Stack for this question"
                                                    value={question.tempTech}
                                                    onChange={e => updateQuestion(question.id, 'tempTech', e.target.value)}
                                                    onKeyDown={e => handleAddTech(e, question.id)}
                                                />
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
                                                    {question.techStack.map(tech => (
                                                        <span key={tech} className="border px-2 py-0.5 rounded-lg text-[9px] uppercase font-bold flex items-center gap-1"
                                                              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                                            {tech}
                                                            <button type="button" onClick={() => removeTech(question.id, tech)} className="hover:text-black">×</button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full px-4 py-4 border rounded-xl focus:outline-none transition-all resize-none text-sm leading-relaxed"
                                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                            placeholder="Write the question description here..."
                                            value={question.description}
                                            onChange={e => updateQuestion(question.id, 'description', e.target.value)}
                                        />
                                    </div>

                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(question.id)}
                                            className="p-2 transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <Trash2 size={20} className="hover:text-red-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="w-full md:w-3/4 space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: 'var(--text-muted)' }}>
                                <span className="flex items-center gap-2"><Sparkles size={14} /> Final Experience Tips?</span>
                                <span>Optional</span>
                            </div>
                            <textarea
                                rows={2}
                                className="w-full px-4 py-4 border rounded-xl focus:outline-none transition-all resize-none font-medium"
                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                placeholder="Any overall advice or interview insights?"
                                value={common.experience}
                                onChange={e => setCommon({ ...common, experience: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full md:w-3/4 font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 tracking-widest uppercase text-xs shadow-sm"
                            style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                        >
                            {submitting ? (
                                <><Loader2 className="animate-spin" size={20} /> Processing...</>
                            ) : (
                                <><Send size={20} /> Submit Experience</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;
