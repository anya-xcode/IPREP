import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import io from 'socket.io-client';
import API_URL, { IS_PRODUCTION } from '../api/config';

const Home = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ company: '', techStack: '', difficulty: '', role: '' });
    const [search, setSearch] = useState('');

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/questions`, {
                params: { page, ...filters, company: search || filters.company, excludeRound: 'HR Round' }
            });
            setQuestions(data.questions);
            setTotalPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, filters, search]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (IS_PRODUCTION) return; // Socket.io does not work on Vercel Serverless

        const socket = io(API_URL);
        socket.on('newQuestion', (newQuestion) => {
            setQuestions(prev => [newQuestion, ...prev].slice(0, 10));
        });
        return () => socket.disconnect();
    }, []);

    const handleUpvote = useCallback(async (id) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/questions/${id}/upvote`);
            setQuestions(prevQuestions => prevQuestions.map(q => q.id === id ? data : q));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleBookmark = useCallback(async (id) => {
        let userId = localStorage.getItem('iprep_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('iprep_user_id', userId);
        }
        try {
            const { data } = await axios.post(`${API_URL}/api/questions/${id}/bookmark`, { userId });
            setQuestions(prevQuestions => prevQuestions.map(q => q.id === id ? data : q));
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 flex items-center gap-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                        Iprep Central
                    </h1>
                    <p className="max-w-lg text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
                        Real interview questions from top companies, verified by our community and moderators.
                    </p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search by company..."
                        className="w-full border rounded-2xl py-4 pl-12 pr-4 transition-all"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
                    />
                </div>
            </div>

            <div className="w-full">
                <div className="max-w-4xl mx-auto">
                    <div className="border rounded-2xl p-2 flex flex-wrap gap-2 mb-10 w-fit" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        <select
                            className="bg-transparent rounded-xl px-5 py-3 text-sm font-semibold focus:outline-none cursor-pointer transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            onChange={(e) => setFilters({ ...filters, techStack: e.target.value })}
                        >
                            <option value="">All Stacks</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Full Stack">Full Stack</option>
                            <option value="ML,Data">AI/ML</option>
                        </select>
                        <button
                            onClick={fetchQuestions}
                            className="px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 sm:ml-2"
                            style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                        >
                            Apply
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin" style={{ color: 'var(--text-primary)' }} size={48} />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-6">
                                {questions.map((q) => (
                                    <QuestionCard key={q.id} question={q} onUpvote={handleUpvote} onBookmark={handleBookmark} />
                                ))}
                            </div>

                            {questions.length === 0 && (
                                <div className="text-center py-20 rounded-2xl border border-dashed" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                    <p className="text-lg italic">No questions found matching your criteria.</p>
                                </div>
                            )}

                            <div className="flex justify-center items-center gap-6 mt-16">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="p-3 rounded-full border transition-all disabled:opacity-20"
                                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <span className="font-medium tracking-widest text-sm uppercase" style={{ color: 'var(--text-muted)' }}>
                                    Page <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{page}</span> of {totalPages}
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="p-3 rounded-full border transition-all disabled:opacity-20"
                                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
