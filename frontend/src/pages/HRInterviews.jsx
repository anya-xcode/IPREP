import { MessageCircle, Loader2, Sparkles } from 'lucide-react';
import API_URL from '../api/config';

const HRInterviews = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHRQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/questions`, {
                params: { interviewRound: 'HR Round' }
            });
            setQuestions(data.questions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHRQuestions();
    }, [fetchHRQuestions]);

    const handleUpvote = useCallback(async (id) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/questions/${id}/upvote`);
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
                        HR & Behavioral <MessageCircle style={{ color: 'var(--text-primary)' }} size={40} />
                    </h1>
                    <p className="max-w-lg text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
                        Master the behavioral aspect of your interview. Real questions from top companies.
                    </p>
                </div>
            </div>

            <div className="w-full">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin" style={{ color: 'var(--text-primary)' }} size={48} />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-6">
                                {questions.map((q) => (
                                    <QuestionCard key={q.id} question={q} onUpvote={handleUpvote} />
                                ))}
                            </div>

                            {questions.length === 0 && (
                                <div className="text-center py-20 rounded-2xl border border-dashed" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                    <Sparkles className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} size={48} />
                                    <p className="text-lg italic">No HR specific questions found matching your criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HRInterviews;
