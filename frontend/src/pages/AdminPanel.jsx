import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Trash2, Edit3, ShieldAlert, User, Search, Save, X, Filter, Building2, Calendar, ShieldCheck, Lock, Unlock, BookOpen, PlusSquare, Loader2 } from 'lucide-react';
import API_URL from '../api/config';
import StatusModal from '../components/StatusModal';

const AdminPanel = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDING');

    // Admin Password Protection
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('adminAuth') === 'true');
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ new: '', confirm: '' });
    const [passUpdateMsg, setPassUpdateMsg] = useState({ type: '', text: '' });

    // Resources Management
    const [resources, setResources] = useState([]);
    const [showResources, setShowResources] = useState(false);
    const [resourceForm, setResourceForm] = useState({ title: '', description: '', links: [{ label: '', url: '' }], category: 'Article' });
    const [resourceLoading, setResourceLoading] = useState(false);
    const [editingResourceId, setEditingResourceId] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [pendingDeleteType, setPendingDeleteType] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const savedPass = sessionStorage.getItem('adminPassword');
        try {
            const { data } = await axios.get(`${API_URL}/api/questions/admin`, {
                params: { status: statusFilter },
                headers: { 'Admin-Password': savedPass }
            });
            setQuestions(data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setIsAuthenticated(false);
                sessionStorage.removeItem('adminAuth');
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    const fetchAdminResources = useCallback(async () => {
        setResourceLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/resources`);
            setResources(data);
        } catch (err) {
            console.error(err);
        } finally {
            setResourceLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            if (showResources) fetchAdminResources();
            else fetchData();
        }
    }, [isAuthenticated, showResources, fetchData, fetchAdminResources]);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.get(`${API_URL}/api/questions/admin`, {
                params: { status: 'PENDING' },
                headers: { 'Admin-Password': passwordInput }
            });
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
            sessionStorage.setItem('adminPassword', passwordInput);
            setAuthError(false);
        } catch (err) {
            setAuthError(true);
        } finally {
            setLoading(false);
        }
    }, [passwordInput]);

    const handleStatusUpdate = useCallback(async (id, status) => {
        const savedPass = sessionStorage.getItem('adminPassword');
        try {
            await axios.patch(`${API_URL}/api/questions/${id}/status`, { status }, {
                headers: { 'Admin-Password': savedPass }
            });
            setQuestions(prev => prev.filter(q => q.id !== id));
            setModalState({ isOpen: true, type: 'success', title: status === 'APPROVED' ? 'Question Approved!' : 'Question Rejected!', message: status === 'APPROVED' ? 'The question has been approved and is now visible to users.' : 'The question has been rejected.' });
        } catch (err) {
            setModalState({ isOpen: true, type: 'error', title: 'Action Failed', message: err.response?.data?.message || 'Failed to update the question status. Please try again.' });
        }
    }, []);

    const handleDelete = useCallback((id) => {
        setPendingDeleteId(id);
        setPendingDeleteType('question');
        setModalState({ isOpen: true, type: 'confirm', title: 'Delete Question?', message: 'This action cannot be undone. Are you sure you want to delete this question?' });
    }, []);

    const confirmDeleteQuestion = useCallback(async () => {
        if (!pendingDeleteId) return;
        const savedPass = sessionStorage.getItem('adminPassword');
        try {
            await axios.delete(`${API_URL}/api/questions/${pendingDeleteId}`, {
                headers: { 'Admin-Password': savedPass }
            });
            setQuestions(prev => prev.filter(q => q.id !== pendingDeleteId));
            setModalState({ isOpen: true, type: 'success', title: 'Question Deleted!', message: 'The question has been removed successfully.' });
        } catch (err) {
            setModalState({ isOpen: true, type: 'error', title: 'Delete Failed', message: 'Failed to delete the question. Please try again.' });
        } finally {
            setPendingDeleteId(null);
            setPendingDeleteType(null);
        }
    }, [pendingDeleteId]);

    const startEdit = useCallback((q) => {
        setEditingId(q.id);
        setEditForm({ ...q });
    }, []);

    const saveEdit = useCallback(async () => {
        const savedPass = sessionStorage.getItem('adminPassword');
        try {
            const { company, description, role, techStack, difficulty, category, interviewRound, experience, answer } = editForm;
            const updateData = { company, description, role, techStack, difficulty, category, interviewRound, experience, answer };
            const { data } = await axios.put(`${API_URL}/api/questions/${editingId}`, updateData, {
                headers: { 'Admin-Password': savedPass }
            });
            setQuestions(prev => prev.map(q => q.id === editingId ? data : q));
            setEditingId(null);
            setModalState({ isOpen: true, type: 'success', title: 'Question Updated!', message: 'The question has been updated successfully.' });
        } catch (err) {
            setModalState({ isOpen: true, type: 'error', title: 'Update Failed', message: err.response?.data?.message || 'Failed to update the question. Please try again.' });
        }
    }, [editingId, editForm]);

    const handlePasswordChange = useCallback(async (e) => {
        e.preventDefault();
        if (passwordForm.new !== passwordForm.confirm) {
            return setPassUpdateMsg({ type: 'error', text: 'New passwords do not match' });
        }
        const savedPass = sessionStorage.getItem('adminPassword');
        try {
            await axios.patch(`${API_URL}/api/questions/admin/change-password`,
                { newPassword: passwordForm.new },
                { headers: { 'Admin-Password': savedPass } }
            );
            setPassUpdateMsg({ type: 'success', text: 'Password updated! Please re-login.' });
            setTimeout(() => {
                sessionStorage.clear();
                window.location.reload();
            }, 2000);
        } catch (err) {
            setPassUpdateMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        }
    }, [passwordForm]);

    const handleAddResource = useCallback(async (e) => {
        e.preventDefault();
        const savedPass = sessionStorage.getItem('adminPassword');
        try {
            if (editingResourceId) {
                await axios.put(`${API_URL}/api/resources/${editingResourceId}`, resourceForm, {
                    headers: { 'Admin-Password': savedPass }
                });
                setModalState({ isOpen: true, type: 'success', title: 'Resource Updated!', message: 'The resource has been updated successfully.' });
            } else {
                await axios.post(`${API_URL}/api/resources`, resourceForm, {
                    headers: { 'Admin-Password': savedPass }
                });
                setModalState({ isOpen: true, type: 'success', title: 'Resource Added!', message: 'The new resource has been added successfully.' });
            }
            setResourceForm({ title: '', description: '', links: [{ label: '', url: '' }], category: 'Article' });
            setEditingResourceId(null);
            fetchAdminResources();
        } catch (err) {
            setModalState({ isOpen: true, type: 'error', title: 'Operation Failed', message: err.response?.data?.message || (editingResourceId ? 'Failed to update resource. Please try again.' : 'Failed to add resource. Please try again.') });
        }
    }, [editingResourceId, resourceForm, fetchAdminResources]);

    const handleEditResourceStart = useCallback((resource) => {
        setEditingResourceId(resource.id);
        const linksToEdit = Array.isArray(resource.links) && resource.links.length > 0
            ? resource.links
            : [{ label: '', url: resource.link || '' }]; // fallback for legacy data
        setResourceForm({
            title: resource.title,
            description: resource.description,
            links: linksToEdit,
            category: resource.category
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleCancelEditResource = useCallback(() => {
        setEditingResourceId(null);
        setResourceForm({ title: '', description: '', links: [{ label: '', url: '' }], category: 'Article' });
    }, []);

    const handleDeleteResource = useCallback((id) => {
        setPendingDeleteId(id);
        setPendingDeleteType('resource');
        setModalState({ isOpen: true, type: 'confirm', title: 'Delete Resource?', message: 'This action cannot be undone. Are you sure you want to delete this resource?' });
    }, []);

    const confirmDeleteResource = useCallback(async () => {
        if (!pendingDeleteId) return;
        const savedPass = sessionStorage.getItem('adminPassword');
        try {
            await axios.delete(`${API_URL}/api/resources/${pendingDeleteId}`, {
                headers: { 'Admin-Password': savedPass }
            });
            setResources(prev => prev.filter(r => r.id !== pendingDeleteId));
            setModalState({ isOpen: true, type: 'success', title: 'Resource Deleted!', message: 'The resource has been removed successfully.' });
        } catch (err) {
            setModalState({ isOpen: true, type: 'error', title: 'Delete Failed', message: 'Failed to delete the resource. Please try again.' });
        } finally {
            setPendingDeleteId(null);
            setPendingDeleteType(null);
        }
    }, [pendingDeleteId]);

    const handleLogout = useCallback(() => {
        sessionStorage.clear();
        window.location.reload();
    }, []);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q =>
            q.company.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [questions, searchQuery]);

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-32 px-4">
                <div className="border rounded-[2.5rem] p-10 shadow-xl text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border" 
                         style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Restricted Access</h1>
                    <p className="font-medium mb-8" style={{ color: 'var(--text-muted)' }}>Enter administrative password to proceed.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="Admin Password"
                                className={`w-full border rounded-2xl px-6 py-4 transition-all font-bold text-center tracking-[0.5em] focus:outline-none`}
                                style={{ 
                                    backgroundColor: 'var(--bg-input)', 
                                    borderColor: authError ? '#ef4444' : 'var(--border-color)', 
                                    color: 'var(--text-primary)' 
                                }}
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                autoFocus
                            />
                            {authError && <p className="text-red-500 text-[10px] font-black uppercase mt-2 tracking-widest">Invalid credentials</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                            style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                        >
                            <Unlock size={16} /> Unlock Console
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const closeModal = () => {
        setModalState({ ...modalState, isOpen: false });
        setPendingDeleteId(null);
        setPendingDeleteType(null);
    };

    const handleModalAction = () => {
        if (modalState.type === 'confirm') {
            if (pendingDeleteType === 'question') {
                confirmDeleteQuestion();
            } else {
                confirmDeleteResource();
            }
        } else {
            closeModal();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
            <StatusModal
                isOpen={modalState.isOpen}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onClose={closeModal}
                onAction={handleModalAction}
                actionLabel={modalState.type === 'confirm' ? 'Yes, Delete' : modalState.type === 'success' ? 'Continue' : 'Try Again'}
            />
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 p-10 rounded-[2.5rem] border"
                 style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>ADMIN console</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>Moderation Queue</h1>
                    <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Review community submissions and ensure data quality.</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <button
                        onClick={() => {
                            setShowResources(!showResources);
                            setShowSettings(false);
                        }}
                        className={`px-6 py-4 rounded-2xl border transition-all text-[10px] font-black tracking-widest uppercase flex items-center gap-2`}
                        style={showResources
                            ? { backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', borderColor: 'var(--btn-primary-bg)' }
                            : { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }
                        }
                    >
                        <BookOpen size={16} /> Resources
                    </button>

                    <button
                        onClick={() => {
                            setShowSettings(!showSettings);
                            setShowResources(false);
                        }}
                        className={`p-4 rounded-2xl border transition-all`}
                        style={showSettings
                            ? { backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', borderColor: 'var(--btn-primary-bg)' }
                            : { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }
                        }
                    >
                        <ShieldAlert size={20} />
                    </button>

                    {!showSettings && (
                        <>
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} size={18} />
                                <input
                                    type="text"
                                    placeholder="Filter by company..."
                                    className="border rounded-2xl py-4 pl-12 pr-4 w-full transition-all text-sm font-medium focus:outline-none"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex p-1.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all`}
                                        style={statusFilter === status
                                            ? { backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }
                                            : { color: 'var(--text-muted)' }
                                        }
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <button onClick={handleLogout} className="px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white">
                        Logout
                    </button>
                </div>
            </div>

            {showResources ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Add/Edit Resource Form */}
                    <div className="border rounded-[2.5rem] p-10 shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                        <div className="flex justify-between items-center mb-8 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                            <h2 className="text-2xl font-black flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                                {editingResourceId ? <Edit3 size={24} /> : <PlusSquare size={24} />}
                                {editingResourceId ? 'Edit Resource' : 'Add New Resource'}
                            </h2>
                            {editingResourceId && (
                                <button type="button" onClick={handleCancelEditResource} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                                    <X size={20} className="hover:text-black" />
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest pl-1" style={{ color: 'var(--text-muted)' }}>Title</label>
                                <input
                                    className="w-full border rounded-2xl px-6 py-4 font-bold focus:outline-none"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    value={resourceForm.title}
                                    onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest pl-1" style={{ color: 'var(--text-muted)' }}>Category</label>
                                <select
                                    className="w-full border rounded-2xl px-6 py-4 font-bold appearance-none cursor-pointer focus:outline-none"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    value={resourceForm.category}
                                    onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })}
                                >
                                    <option>Article</option>
                                    <option>Video</option>
                                    <option>Roadmap</option>
                                    <option>Book</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center justify-between pl-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Resource Links</label>
                                    <button
                                        type="button"
                                        onClick={() => setResourceForm({ ...resourceForm, links: [...resourceForm.links, { label: '', url: '' }] })}
                                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        <PlusSquare size={14} /> Add Another Link
                                    </button>
                                </div>
                                {resourceForm.links.map((link, idx) => (
                                    <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl border relative group" 
                                         style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                placeholder="Link Name (e.g. Video Guide)"
                                                className="w-full border rounded-xl px-4 py-2 text-xs font-bold focus:outline-none"
                                                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                value={link.label}
                                                onChange={e => {
                                                    const newLinks = [...resourceForm.links];
                                                    newLinks[idx].label = e.target.value;
                                                    setResourceForm({ ...resourceForm, links: newLinks });
                                                }}
                                                required
                                            />
                                            <input
                                                placeholder="URL (https://...)"
                                                className="w-full border rounded-xl px-4 py-2 text-xs font-medium focus:outline-none"
                                                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                value={link.url}
                                                onChange={e => {
                                                    const newLinks = [...resourceForm.links];
                                                    newLinks[idx].url = e.target.value;
                                                    setResourceForm({ ...resourceForm, links: newLinks });
                                                }}
                                                required
                                            />
                                        </div>
                                        {resourceForm.links.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newLinks = resourceForm.links.filter((_, i) => i !== idx);
                                                    setResourceForm({ ...resourceForm, links: newLinks });
                                                }}
                                                className="p-2 transition-colors mt-2"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                <X size={16} className="hover:text-black" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest pl-1" style={{ color: 'var(--text-muted)' }}>Description</label>
                                <textarea
                                    className="w-full border rounded-2xl px-6 py-4 font-medium resize-none focus:outline-none"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    rows={3}
                                    value={resourceForm.description}
                                    onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="md:col-span-2 font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                                    style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}>
                                {editingResourceId ? <><Save size={16} /> Update Resource</> : <><PlusSquare size={16} /> Add Resource</>}
                            </button>
                        </form>
                    </div>

                    {/* Manage Resources List */}
                    <div className="grid grid-cols-1 gap-4">
                        <h2 className="text-xl font-black px-2" style={{ color: 'var(--text-primary)' }}>Existing Resources</h2>
                        {resourceLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
                        ) : resources.map(r => (
                            <div key={r.id} className="border p-6 rounded-2xl flex items-center justify-between group transition-all"
                                 style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                <div>
                                    <h4 className="font-bold uppercase text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>{r.title}</h4>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{r.category} • {r.links?.[0]?.url || 'No links'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditResourceStart(r)}
                                        className="p-3 border rounded-xl transition-all"
                                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                                        title="Edit"
                                    >
                                        <Edit3 size={16} className="hover:text-black" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteResource(r.id)}
                                        className="p-3 border rounded-xl transition-all border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : showSettings ? (
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="border rounded-[2.5rem] p-12 shadow-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                        <h2 className="text-3xl font-black mb-8 italic" style={{ color: 'var(--text-primary)' }}>Security Settings</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest pl-1" style={{ color: 'var(--text-muted)' }}>New Password</label>
                                <input
                                    type="password"
                                    className="w-full border rounded-2xl px-6 py-4 font-bold focus:outline-none"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    value={passwordForm.new}
                                    onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest pl-1" style={{ color: 'var(--text-muted)' }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full border rounded-2xl px-6 py-4 font-bold focus:outline-none"
                                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    value={passwordForm.confirm}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                    required
                                />
                            </div>

                            {passUpdateMsg.text && (
                                <p className={`text-center text-xs font-bold uppercase tracking-widest ${passUpdateMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {passUpdateMsg.text}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full font-black py-5 rounded-2xl transition-all uppercase text-xs tracking-[0.2em] mt-4 shadow-sm"
                                style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                            >
                                Update Administrative Password
                            </button>
                        </form>
                    </div>
                </div>
            ) : loading ? (
                <div className="flex justify-center py-32">
                    <Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} size={40} />
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-40 rounded-[3rem] border border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                    <Clock className="mx-auto mb-6" style={{ color: 'var(--text-muted)' }} size={64} />
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>Queue is empty</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {filteredQuestions.map((q) => (
                        <div key={q.id} className="group relative border rounded-[2.5rem] p-10 transition-all duration-500"
                             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                            {editingId === q.id ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <input className="w-full border rounded-2xl px-6 py-4 font-bold focus:outline-none" 
                                                   style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                                   value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })} />
                                        </div>
                                    </div>
                                    <textarea className="w-full border rounded-3xl px-6 py-5 resize-none font-medium leading-relaxed focus:outline-none" 
                                              style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                              rows={6} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                                    <div className="flex justify-end gap-4">
                                        <button onClick={saveEdit} className="px-10 py-4 rounded-2xl flex items-center gap-3 text-xs font-black transition-all shadow-sm active:scale-95"
                                                style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}><Save size={18} /> SAVE CHANGES</button>
                                        <button onClick={() => setEditingId(null)} className="px-10 py-4 rounded-2xl flex items-center gap-3 text-xs font-black transition-all active:scale-95 border"
                                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}><X size={18} /> CANCEL</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col xl:flex-row justify-between gap-12">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-4 mb-8">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
                                                 style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                                <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span className="text-[11px] font-bold tracking-tight" style={{ color: 'var(--text-muted)' }}>{new Date(q.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-4xl font-black tracking-tight flex items-center gap-4" style={{ color: 'var(--text-primary)' }}>{q.company}</h3>
                                        <div className="mt-8 p-10 rounded-[2rem] border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                            <p className="text-lg leading-relaxed font-medium italic" style={{ color: 'var(--text-secondary)' }}>"{q.description}"</p>
                                        </div>
                                    </div>

                                    <div className="flex xl:flex-col justify-end gap-4 shrink-0">
                                        <div className="flex gap-4">
                                            {statusFilter !== 'APPROVED' && (
                                                <button onClick={() => handleStatusUpdate(q.id, 'APPROVED')} className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition-all flex items-center justify-center active:scale-90 border border-green-500/20">
                                                    <CheckCircle size={28} />
                                                </button>
                                            )}
                                            {statusFilter !== 'REJECTED' && (
                                                <button onClick={() => handleStatusUpdate(q.id, 'REJECTED')} className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-90 border border-red-500/20">
                                                    <XCircle size={28} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => startEdit(q)} className="w-16 h-16 border rounded-2xl transition-all flex items-center justify-center active:scale-90 hover:bg-black hover:text-white"
                                                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                                <Edit3 size={24} />
                                            </button>
                                            <button onClick={() => handleDelete(q.id)} className="w-16 h-16 border rounded-2xl transition-all flex items-center justify-center active:scale-90 hover:bg-red-600 hover:text-white"
                                                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
