import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    PieChart, Pie, Cell, Legend,
} from 'recharts';

// ── Gradient Color Palette ──
const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#7c3aed'];
const GRADIENT_PAIRS = [
    { from: '#6366f1', to: '#818cf8' },
    { from: '#8b5cf6', to: '#a78bfa' },
    { from: '#ec4899', to: '#f472b6' },
    { from: '#f59e0b', to: '#fbbf24' },
    { from: '#10b981', to: '#34d399' },
    { from: '#3b82f6', to: '#60a5fa' },
];

// ── Animated Stat Card ──
function StatCard({ icon, label, value, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="relative overflow-hidden rounded-2xl p-6 shadow-lg"
            style={{
                background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                border: `1px solid ${color}20`,
            }}
        >
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10"
                style={{ background: color }} />
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: `${color}20`, color }}>
                        {icon}
                    </div>
                    <span className="text-sm font-medium text-slate-500">{label}</span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
            </div>
        </motion.div>
    );
}

// ── Custom Bar Tooltip ──
function CustomBarTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 px-4 py-3">
            <p className="font-semibold text-slate-700 mb-1">{label}</p>
            <p className="text-indigo-600 font-bold text-lg">{payload[0].value}</p>
            <p className="text-xs text-slate-400">Rata-rata Skor</p>
        </div>
    );
}

// ── Custom Pie Label ──
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
            className="text-xs font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stressData, setStressData] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState('all');
    const [loading, setLoading] = useState(true);

    // ── Auth check ──
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    // ── Fetch surveys list ──
    useEffect(() => {
        axios.get('http://localhost:5000/api/surveys')
            .then(res => setSurveys(res.data))
            .catch(err => console.error('Error fetching surveys:', err));
    }, []);

    // ── Fetch stress factor data ──
    useEffect(() => {
        setLoading(true);
        const url = selectedSurvey === 'all'
            ? 'http://localhost:5000/api/answers/stress-factors'
            : `http://localhost:5000/api/answers/stress-factors-by-survey?survey_id=${selectedSurvey}`;

        axios.get(url)
            .then(res => {
                setStressData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching stress factors:', err);
                setLoading(false);
            });
    }, [selectedSurvey]);

    // ── Computed stats ──
    const stats = useMemo(() => {
        if (!stressData.length) return { totalRespondents: 0, dominantFactor: '-', avgOverall: 0 };
        const totalRespondents = Math.max(...stressData.map(d => d.total_respondents || 0));
        const dominantFactor = stressData[0]?.category || '-';
        const avgOverall = (stressData.reduce((sum, d) => sum + parseFloat(d.avg_score || 0), 0) / stressData.length).toFixed(2);
        return { totalRespondents, dominantFactor, avgOverall };
    }, [stressData]);

    // ── Radar data ──
    const radarData = useMemo(() =>
        stressData.map(d => ({
            category: d.category,
            score: parseFloat(d.avg_score),
            fullMark: 5,
        }))
        , [stressData]);

    // ── Pie data ──
    const pieData = useMemo(() =>
        stressData.map(d => ({
            name: d.category,
            value: parseFloat(d.avg_score),
        }))
        , [stressData]);

    if (!user) return <p className="p-5 text-lg">Loading user data...</p>;

    return (
        <div className="p-4 w-full overflow-y-auto h-[96vh] scrollbar-none">
            {/* ── Welcome Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-5 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
                <img
                    src={`http://localhost:5000/uploads/${user.image}`}
                    alt="Profile"
                    className="w-20 h-20 object-cover rounded-full ring-4 ring-indigo-100"
                />
                <div>
                    <h1 className="font-bold text-3xl text-slate-800">Welcome, {user.name}</h1>
                    <p className="text-slate-500 mt-1">Analisis faktor dominan stress kerja berdasarkan hasil survey.</p>
                </div>
            </motion.div>

            {/* ── Survey Filter ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6 flex items-center gap-4"
            >
                <label className="text-sm font-semibold text-slate-600">Filter Survey:</label>
                <select
                    value={selectedSurvey}
                    onChange={(e) => setSelectedSurvey(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all cursor-pointer min-w-[240px]"
                >
                    <option value="all">📊 Semua Survey</option>
                    {surveys.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                </select>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <StatCard icon="👥" label="Total Responden" value={stats.totalRespondents} color="#6366f1" delay={0.15} />
                <StatCard icon="🔥" label="Faktor Dominan" value={stats.dominantFactor} color="#ec4899" delay={0.25} />
                <StatCard icon="📈" label="Rata-rata Skor" value={stats.avgOverall} color="#10b981" delay={0.35} />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        <p className="text-slate-400 text-sm">Memuat data...</p>
                    </div>
                </div>
            ) : stressData.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-slate-100"
                >
                    <p className="text-5xl mb-4">📋</p>
                    <p className="text-slate-500 font-medium text-lg">Belum ada data survey</p>
                    <p className="text-slate-400 text-sm mt-1">Data akan muncul setelah ada jawaban survey yang disubmit.</p>
                </motion.div>
            ) : (
                <>
                    {/* ── Bar Chart ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6"
                    >
                        <h2 className="font-bold text-xl text-slate-800 mb-1">📊 Rata-rata Skor per Faktor Stress</h2>
                        <p className="text-sm text-slate-400 mb-6">Semakin tinggi skor, semakin dominan faktor stress tersebut (skala 1-5)</p>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stressData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <defs>
                                    {stressData.map((_, i) => (
                                        <linearGradient key={`gradient-${i}`} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={GRADIENT_PAIRS[i % GRADIENT_PAIRS.length].from} stopOpacity={1} />
                                            <stop offset="100%" stopColor={GRADIENT_PAIRS[i % GRADIENT_PAIRS.length].to} stopOpacity={0.7} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                                <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="avg_score" radius={[12, 12, 0, 0]} barSize={60}>
                                    {stressData.map((_, i) => (
                                        <Cell key={`cell-${i}`} fill={`url(#barGrad-${i})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* ── Radar + Pie Row ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Radar Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                        >
                            <h2 className="font-bold text-xl text-slate-800 mb-1">🕸️ Radar Perbandingan Faktor</h2>
                            <p className="text-sm text-slate-400 mb-6">Visualisasi perbandingan semua faktor stress secara bersamaan</p>
                            <ResponsiveContainer width="100%" height={320}>
                                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
                                    <PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <Radar
                                        name="Skor"
                                        dataKey="score"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.25}
                                        strokeWidth={2}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Pie Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                        >
                            <h2 className="font-bold text-xl text-slate-800 mb-1">🍩 Distribusi Faktor Stress</h2>
                            <p className="text-sm text-slate-400 mb-6">Proporsi kontribusi setiap faktor terhadap total skor stress</p>
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={4}
                                        dataKey="value"
                                        animationBegin={200}
                                        animationDuration={800}
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={`pie-${i}`} fill={COLORS[i % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`${value} (avg)`, 'Skor']}
                                        contentStyle={{
                                            background: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(8px)',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        formatter={(value) => <span className="text-slate-600 text-sm">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>

                    {/* ── Detail Table ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8"
                    >
                        <h2 className="font-bold text-xl text-slate-800 mb-4">📋 Detail Faktor Stress Kerja</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-500">Ranking</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-500">Kategori Faktor</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-500">Rata-rata Skor</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-500">Total Responden</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-500">Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stressData.map((item, idx) => {
                                        const score = parseFloat(item.avg_score);
                                        let level, levelColor, levelBg;
                                        if (score >= 4) { level = 'Sangat Tinggi'; levelColor = '#dc2626'; levelBg = '#fef2f2'; }
                                        else if (score >= 3) { level = 'Tinggi'; levelColor = '#f59e0b'; levelBg = '#fffbeb'; }
                                        else if (score >= 2) { level = 'Sedang'; levelColor = '#3b82f6'; levelBg = '#eff6ff'; }
                                        else { level = 'Rendah'; levelColor = '#10b981'; levelBg = '#ecfdf5'; }
                                        return (
                                            <tr key={item.category} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                                                        style={{ background: COLORS[idx % COLORS.length] }}>
                                                        {idx + 1}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-slate-700">{item.category}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                                                            <div className="h-full rounded-full transition-all duration-700"
                                                                style={{
                                                                    width: `${(score / 5) * 100}%`,
                                                                    background: `linear-gradient(90deg, ${GRADIENT_PAIRS[idx % GRADIENT_PAIRS.length].from}, ${GRADIENT_PAIRS[idx % GRADIENT_PAIRS.length].to})`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-slate-700">{item.avg_score}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{item.total_respondents} orang</td>
                                                <td className="py-3 px-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold"
                                                        style={{ color: levelColor, background: levelBg }}>
                                                        {level}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}

export default DashboardPage;