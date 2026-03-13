import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Link as LinkIcon, ExternalLink, Search, Loader2, X, ChevronRight } from 'lucide-react';
import API_URL from '../api/config';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResource, setSelectedResource] = useState(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/resources`);
            setResources(data);
        } catch (err) {
            console.error('Failed to fetch resources', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(resources.map(r => r.category))];
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredResources = resources.filter(r =>
        (activeCategory === 'All' || r.category === activeCategory) &&
        (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleOpenLinks = (resource) => {
        if (resource.links.length === 1) {
            window.open(resource.links[0].url, '_blank');
        } else {
            setSelectedResource(resource);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            {/* Modal for Multiple Links */}
            {selectedResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="border rounded-[1.5rem] w-full max-w-lg overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                        <div className="p-8 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                            <div>
                                <h3 className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{selectedResource.title}</h3>
                                <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>Select a Resource Link</p>
                            </div>
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="p-2 border rounded-xl transition-all"
                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-3">
                            {selectedResource.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-5 border rounded-2xl hover:bg-black hover:text-white transition-all group font-bold text-sm tracking-tight"
                                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                >
                                    <span className="truncate pr-4">{link.label}</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            ))}
                        </div>
                        <div className="px-8 pb-8">
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="w-full py-4 font-bold border rounded-2xl transition-all text-[10px] uppercase tracking-widest"
                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-6"
                     style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <BookOpen size={14} />
                    <span>Learning Center</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6" style={{ color: 'var(--text-primary)' }}>Important Resources</h1>
                <p className="max-w-2xl mx-auto text-lg font-medium" style={{ color: 'var(--text-muted)' }}>Curated study materials, roadmaps, and interview guides to help you ace your next big opportunity.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 p-8 rounded-[2rem] border"
                 style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="border rounded-xl py-4 pl-12 pr-4 w-full transition-all"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border`}
                            style={activeCategory === cat 
                                ? { backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', borderColor: 'var(--btn-primary-bg)' }
                                : { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }
                            }
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-40">
                    <Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} size={48} />
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-40 rounded-[2rem] border border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>No resources found</h3>
                    <p className="mt-2 font-medium italic" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map(resource => (
                        <div key={resource.id} className="group border rounded-[2rem] p-8 transition-all duration-300 flex flex-col h-full"
                             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                            <div className="mb-6 flex justify-between items-start">
                                <span className="px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border"
                                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                    {resource.category}
                                </span>
                                <div className="p-2 border rounded-xl transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                    <LinkIcon size={18} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 leading-tight transition-colors" style={{ color: 'var(--text-primary)' }}>{resource.title}</h3>
                            <p className="font-medium leading-relaxed mb-8 flex-grow" style={{ color: 'var(--text-secondary)' }}>{resource.description}</p>
                            <button
                                onClick={() => handleOpenLinks(resource)}
                                className="inline-flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all active:scale-95 text-xs tracking-widest uppercase shadow-sm"
                                style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                            >
                                <ExternalLink size={14} /> {resource.links.length > 1 ? `Open Options (${resource.links.length})` : 'Open Resource'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resources;
