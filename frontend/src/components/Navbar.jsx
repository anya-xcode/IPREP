import { Zap, PlusSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api/config';

const Navbar = () => {
    const { theme } = useTheme();
    const [stats, setStats] = useState({ placedStudents: 1438, totalStudents: 2500 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/questions/stats`);
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <nav className="border-b transition-colors duration-200 sticky top-0 z-50 w-full backdrop-blur-md" style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-color)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--text-primary)' }}>
                                <Zap size={20} style={{ color: 'var(--bg-primary)', fill: 'var(--bg-primary)' }} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                                Iprep
                            </span>
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
                        <Link to="/upload" className="text-sm font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>Share Experience</Link>
                        <Link to="/hr-interviews" className="text-sm font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>HR Rounds</Link>
                        <Link to="/resources" className="text-sm font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>Resources</Link>
                    </div>

                    {/* FOMO Stats */}
                    <div className="hidden md:flex items-center gap-4 px-6 border-l border-r h-full whitespace-nowrap" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex flex-col items-start leading-none gap-1">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] uppercase tracking-widest font-black" style={{ color: 'var(--text-muted)' }}>
                                    Placement Tracker
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-black italic" style={{ color: 'var(--text-primary)' }}>{stats.placedStudents?.toLocaleString()}</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>Students Placed</span>
                                <span className="text-[10px] font-black mx-1" style={{ color: 'var(--border-color)' }}>/</span>
                                <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{stats.totalStudents?.toLocaleString()} Total</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/upload" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm" style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}>
                            <PlusSquare size={18} />
                            <span>Share Question</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
