import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-blue-950 text-slate-300 py-12 md:py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16">
                
                {/* Brand & Description */}
                <div className="flex flex-col gap-4 max-w-sm">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Health<span className="text-blue-500">Dash</span>
                    </h1>
                    <p className="text-sm leading-relaxed text-slate-400">
                        Kami berdedikasi untuk memberikan panduan, sumber daya, dan dukungan terbaik bagi kesehatan mental dan kesejahteraan emosional di lingkungan kerja Anda.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <h2 className="text-white font-semibold text-lg tracking-wide">Menu Akses</h2>
                    <ul className="flex flex-col gap-3 text-sm text-slate-400">
                        <li><Link to="/home" className="hover:text-blue-400 transition-colors">Beranda</Link></li>
                        <li><Link to="/survei" className="hover:text-blue-400 transition-colors">Isi Survey</Link></li>
                        <li><Link to="/content" className="hover:text-blue-400 transition-colors">Konten Edukasi</Link></li>
                        <li><Link to="/profile" className="hover:text-blue-400 transition-colors">Profil Saya</Link></li>
                    </ul>
                </div>
                
                {/* Dukungan */}
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <h2 className="text-white font-semibold text-lg tracking-wide">Dukungan</h2>
                    <ul className="flex flex-col gap-3 text-sm text-slate-400">
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Pusat Bantuan</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Syarat & Ketentuan</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Kebijakan Privasi</li>
                    </ul>
                </div>
            </div>

            {/* Divider & Copyright */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16">
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-slate-500 text-xs">
                        Copyright © {new Date().getFullYear()} HealthDash. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
