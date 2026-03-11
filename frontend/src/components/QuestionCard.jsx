import React, { useState, memo } from 'react';
import { ThumbsUp, Calendar, User, Briefcase, Code } from 'lucide-react';
import { format } from 'date-fns';

const QuestionCard = memo(({ question, onUpvote }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full border rounded-[2rem] p-8 space-y-8 transition-all hover:shadow-xl hover:scale-[1.01] cursor-pointer group"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
             onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                {/* Left Content */}
                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black" style={{ color: 'var(--text-muted)' }}>
                            Question
                        </span>
                        <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            {question.description}
                        </h1>
                        <div className="flex items-center gap-2 pt-1">
                            <p className="text-xs uppercase tracking-widest font-bold flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                <Briefcase size={12} /> {question.company} 
                                <span style={{ color: 'var(--border-color)' }}>•</span> {question.role} 
                                <span style={{ color: 'var(--border-color)' }}>•</span> {question.interviewRound}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {question.techStack.map(tech => (
                            <span key={tech} className="px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold border transition-colors" 
                                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Content / Meta */}
                <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto md:min-w-[140px] border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8 shrink-0 gap-4"
                     style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 text-xs font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            <span>{format(new Date(question.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                    </div>
                    
                    <button className="text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-full border transition-all group-hover:bg-black group-hover:text-white"
                            style={{ borderColor: 'var(--border-color)' }}>
                        {isExpanded ? 'Hide Answer' : 'Show Answer'}
                    </button>
                </div>
            </div>

            {/* AI Answer Section */}
            {isExpanded && (
                <div className="pt-8 border-t space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
                     style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2">
                        <Code size={16} style={{ color: 'var(--text-primary)' }} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black" style={{ color: 'var(--text-primary)' }}>
                            AI Suggested Answer
                        </span>
                        <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 font-bold ml-auto">
                            BETA
                        </span>
                    </div>
                    
                    <div className="text-sm leading-relaxed whitespace-pre-line p-6 rounded-2xl border italic"
                         style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                        {question.answer || "This question is still being analyzed by Groq AI. Please check back in a few minutes."}
                    </div>

                    <p className="text-[9px] text-center italic" style={{ color: 'var(--text-muted)' }}>
                        Disclaimer: Answers are generated by AI and should be used for reference only.
                    </p>
                </div>
            )}
        </div>
    );
});

export default QuestionCard;
