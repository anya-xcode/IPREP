import { Zap, PlusSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { theme } = useTheme();

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
