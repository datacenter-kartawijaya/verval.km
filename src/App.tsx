import React, { useState, useEffect, useMemo } from 'react';
import { auth, db, loginWithGoogle, logout, loginWithCredentials, OperationType, handleFirestoreError } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, onSnapshot, query, where, doc, setDoc, updateDoc, addDoc, deleteDoc, orderBy, limit, getDocs } from 'firebase/firestore';
import { Toaster, toast } from 'sonner';
import { Project, Certificate, UserProfile, MasterVillageData } from './types';
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  MapPin,
  Database,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Menu,
  X,
  Trash2,
  Edit2,
  MoreVertical,
  Check,
  Upload,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import * as XLSX from 'xlsx';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import logoKwm from './logo-kwm.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const LoginPage = ({ onCredentialLogin }: { onCredentialLogin: (u: string, p: string) => Promise<void> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onCredentialLogin(username, password);
    } catch (err: any) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white">
      <div className="flex flex-col justify-center p-6 md:p-12 lg:p-24 space-y-8">
        <div className="flex flex-col gap-6">
          <img 
            src={logoKwm} 
            alt="Logo KWM" 
            className="w-32 h-32 object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-3xl tracking-tighter">Aplikasi Verval</span>
            <span className="font-semibold text-slate-500 text-sm tracking-tight">CV. KARTAWIJAYA MANDIRI</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[0.9] tracking-tighter">
            Sistem Verifikasi <br /> <span className="text-indigo-600">Data Pertanahan.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md">
            Platform manajemen verifikasi dan validasi data pertanahan multi-proyek untuk Badan Pertanahan Nasional.
          </p>
        </div>

        <div className="pt-8 space-y-6">
          <Card className="p-8 max-w-sm border-indigo-100 shadow-2xl shadow-indigo-100/50 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">Login Sistem</h3>
                <p className="text-sm text-slate-500">Masukkan kredensial Anda untuk melanjutkan.</p>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <Input 
                  label="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Masukkan username..." 
                  required 
                />
                <Input 
                  label="Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Masukkan password..." 
                  required 
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full py-6 text-lg rounded-2xl shadow-lg shadow-indigo-200">
                {loading ? 'Memproses...' : 'Masuk Sekarang'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-slate-400">
          <div>© Kartawijaya Mandiri 2026</div>
          <div>BPN RI</div>
          <div>Pusdatin</div>
          <div>Verval v2.0</div>
        </div>
      </div>

      <div className="hidden lg:block bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)] opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            {[1,2,3,4].map(i => (
              <div key={i} className={cn(
                "aspect-square rounded-3xl border border-slate-800 p-6 flex flex-col justify-between",
                i === 1 ? "bg-slate-800/50 backdrop-blur-xl" : "bg-transparent"
              )}>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  {i === 1 ? <TrendingUp className="w-5 h-5 text-indigo-400" /> : <Database className="w-5 h-5 text-slate-600" />}
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-12 bg-slate-700 rounded"></div>
                  <div className="h-2 w-20 bg-slate-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <p className="text-white font-medium">Administrator Utama</p>
                <p className="text-slate-400 text-sm">Sedang memantau 12 proyek aktif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)} {...props}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  disabled,
  type = 'button'
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50"
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  className,
  name,
  required,
  defaultValue
}: { 
  label?: string; 
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;
  type?: string;
  className?: string;
  name?: string;
  required?: boolean;
  defaultValue?: string;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input 
      type={type}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
    />
  </div>
);

const Select = ({ 
  label, 
  value, 
  onChange, 
  options,
  className,
  name,
  defaultValue,
  disabled
}: { 
  label?: string; 
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  options: { label: string; value: string }[];
  className?: string;
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <select 
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white disabled:bg-slate-100 disabled:text-slate-500"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const Checkbox = ({ 
  label, 
  checked, 
  onChange, 
  name, 
  value,
  className,
  defaultChecked
}: any) => (
  <label className={cn("flex items-center gap-2 cursor-pointer group", className)}>
    <div className="relative flex items-center justify-center">
      <input 
        type="checkbox" 
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
      />
      <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
    </div>
    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
  </label>
);

// --- Main App ---

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmVariant?: 'danger' | 'primary';
  } | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [view, setView] = useState<'dashboard' | 'verification' | 'operators' | 'village_data'>('dashboard');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [masterVillageData, setMasterVillageData] = useState<MasterVillageData[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMasterIds, setSelectedMasterIds] = useState<string[]>([]);
  const [masterFilterStatus, setMasterFilterStatus] = useState<'All' | 'Available' | 'Taken'>('All');

  const filteredMasterData = useMemo(() => {
    return masterVillageData
      .filter(d => {
        const matchesSearch = d.noHak.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.namaPemegang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.kelurahan.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = masterFilterStatus === 'All' || 
          (masterFilterStatus === 'Available' && !d.isTaken) ||
          (masterFilterStatus === 'Taken' && d.isTaken);
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aNum = parseInt(a.noHak.replace(/\D/g, '')) || 0;
        const bNum = parseInt(b.noHak.replace(/\D/g, '')) || 0;
        if (aNum !== bNum) return aNum - bNum;
        return a.noHak.localeCompare(b.noHak);
      });
  }, [masterVillageData, searchTerm, masterFilterStatus]);
  const [albumNomorForTake, setAlbumNomorForTake] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const masterFileInputRef = React.useRef<HTMLInputElement>(null);
  const [customUser, setCustomUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kwm_custom_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- Effective Role Helper ---
  const effectiveRole = useMemo(() => {
    if (customUser?.username === 'kartawijaya') return 'superadmin';
    if (userProfile?.role) return userProfile.role;
    if (user?.email === "datacenter.kartawijaya@gmail.com") return 'superadmin';
    return null;
  }, [userProfile, user, customUser]);

  useEffect(() => {
    console.log('Effective Role:', effectiveRole);
    console.log('User Profile:', userProfile);
    console.log('User Email:', user?.email);
    console.log('User UID:', user?.uid);
  }, [effectiveRole, userProfile, user]);

  // --- Auth & Profile ---
  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        }
        setIsAuthReady(true);
      }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`));
      return () => unsub();
    } else if (customUser) {
      const unsub = onSnapshot(doc(db, 'users', customUser.uid), (doc) => {
        if (doc.exists()) {
          const profile = doc.data() as UserProfile;
          setUserProfile(profile);
          localStorage.setItem('kwm_custom_user', JSON.stringify(profile));
        }
        setIsAuthReady(true);
      }, (err) => handleFirestoreError(err, OperationType.GET, `users/${customUser.uid}`));
      return () => unsub();
    } else {
      setIsAuthReady(true);
      setUserProfile(null);
    }
  }, [user, customUser]);

  const handleCredentialLogin = async (u: string, p: string) => {
    const profile = await loginWithCredentials(u, p);
    setCustomUser(profile);
    localStorage.setItem('kwm_custom_user', JSON.stringify(profile));
  };

  const handleLogout = async () => {
    setCustomUser(null);
    localStorage.removeItem('kwm_custom_user');
    if (user) {
      await logout();
    }
    setIsSidebarOpen(false);
  };

  // --- All Users (for Admin/Superadmin) ---
  useEffect(() => {
    if (!user || !isAuthReady || !userProfile || (effectiveRole !== 'admin' && effectiveRole !== 'superadmin')) return;
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));
    return () => unsub();
  }, [user, isAuthReady, userProfile, effectiveRole]);

  // --- Projects ---
  useEffect(() => {
    if (!user || !isAuthReady || !userProfile) return;
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projs = snapshot.docs.map(doc => doc.data() as Project);
      setProjects(projs);
      if (projs.length > 0 && !activeProject) {
        setActiveProject(projs[0]);
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));
    return () => unsub();
  }, [user, isAuthReady, userProfile]);

  // --- Certificates ---
  useEffect(() => {
    if (!user || !isAuthReady || !activeProject || !userProfile) return;
    
    // Defensive check: if operator, must be assigned to the project
    if (effectiveRole === 'operator' && (!userProfile.assignedProjects || !userProfile.assignedProjects.includes(activeProject.id))) {
      setCertificates([]);
      return;
    }

    const q = query(collection(db, 'certificates'), where('projectId', '==', activeProject.id));
    
    const unsub = onSnapshot(q, (snapshot) => {
      setCertificates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate)));
    }, (err) => {
      // Only log if it's not a permission error during logout/switch
      if (isAuthReady && user) {
        handleFirestoreError(err, OperationType.LIST, 'certificates');
      }
    });
    return () => unsub();
  }, [user, isAuthReady, activeProject, userProfile, effectiveRole]);

  // --- Master Village Data ---
  useEffect(() => {
    if (!user || !isAuthReady || !activeProject || !userProfile) return;
    
    const q = query(collection(db, 'master_village_data'), where('projectId', '==', activeProject.id));
    const unsub = onSnapshot(q, (snapshot) => {
      setMasterVillageData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MasterVillageData)));
    }, (err) => {
      if (isAuthReady && user && userProfile) {
        handleFirestoreError(err, OperationType.LIST, 'master_village_data');
      }
    });
    return () => unsub();
  }, [user, isAuthReady, activeProject, userProfile]);

  // --- Projects Filtering for Sidebar ---
  const visibleProjects = useMemo(() => {
    if (effectiveRole === 'superadmin') return projects;
    if (effectiveRole === 'admin' || effectiveRole === 'operator') {
      return projects.filter(p => userProfile?.assignedProjects.includes(p.id));
    }
    return [];
  }, [projects, userProfile, effectiveRole]);

  // --- Users Filtering for Dashboard/Operators View ---
  const visibleUsers = useMemo(() => {
    // Filter duplicates: prefer documents that might have been migrated
    const uniqueMap = new Map<string, UserProfile>();
    allUsers.forEach(u => {
      // Use email or username as the unique key
      const key = u.email || u.username || u.uid;
      const existing = uniqueMap.get(key);
      
      // If we find a duplicate, we prefer the one that is likely the "live" one.
      // Since we don't have a perfect way to tell, we'll just keep the last one found
      // or the one that has more data. For now, just keeping the one with the most recent info.
      if (!existing || (u.uid && u.uid.length > 15)) { // Firebase UIDs are usually long
        uniqueMap.set(key, u);
      }
    });
    const baseUsers = Array.from(uniqueMap.values());

    if (effectiveRole === 'superadmin') return baseUsers;
    if (effectiveRole === 'admin' && activeProject) {
      // Admin sees operators assigned to their active project
      return baseUsers.filter(u => u.assignedProjects.includes(activeProject.id));
    }
    return [];
  }, [allUsers, effectiveRole, activeProject]);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const total = certificates.length;
    const verifiedBT = certificates.filter(c => c.statusBT === 'Sudah' || c.statusBT === 'Terverifikasi').length;
    const verifiedSU = certificates.filter(c => c.statusSU === 'Sudah' || c.statusSU === 'Terverifikasi').length;
    const pending = certificates.filter(c => c.statusBT === 'Belum' || c.statusSU === 'Belum').length;
    const issues = certificates.filter(c => c.kendala && c.kendala.trim() !== '').length;
    const uploaded = certificates.filter(c => c.statusUpload === 'Sudah Upload BTSU').length;

    return { total, verifiedBT, verifiedSU, pending, issues, uploaded };
  }, [certificates]);

  const chartData = [
    { name: 'BT Selesai', value: stats.verifiedBT, color: '#10b981' },
    { name: 'SU Selesai', value: stats.verifiedSU, color: '#3b82f6' },
    { name: 'Belum', value: stats.pending, color: '#6366f1' },
    { name: 'Kendala', value: stats.issues, color: '#ef4444' },
  ];

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = c.noHak.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.namaPemegang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (c.albumNomor && c.albumNomor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Belum' && (c.statusBT === 'Belum' || c.statusSU === 'Belum')) ||
                         (filterStatus === 'Sudah' && (c.statusBT === 'Sudah' && c.statusSU === 'Sudah')) ||
                         (filterStatus === 'Terverifikasi' && (c.statusBT === 'Terverifikasi' || c.statusSU === 'Terverifikasi'));
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const numA = parseInt(a.noHak.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.noHak.replace(/\D/g, '')) || 0;
    if (numA !== numB) return numA - numB;
    return a.noHak.localeCompare(b.noHak, undefined, { numeric: true, sensitivity: 'base' });
  });

  // --- Handlers ---
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProj: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      createdAt: new Date().toISOString(),
      createdBy: user?.uid || '',
    };
    try {
      await setDoc(doc(db, 'projects', newProj.id), newProj);
      setShowAddProject(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'projects');
    }
  };

  const handleAddCert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeProject || !user) return;
    const formData = new FormData(e.currentTarget);
    const newCert: Omit<Certificate, 'id'> = {
      projectId: activeProject.id,
      albumNomor: formData.get('albumNomor') as string,
      noHak: formData.get('noHak') as string,
      jenisHak: formData.get('jenisHak') as string,
      namaPemegang: formData.get('namaPemegang') as string,
      jenisSuratUkur: formData.get('jenisSuratUkur') as string,
      noSu: formData.get('noSu') as string,
      tahunSu: formData.get('tahunSu') as string,
      kecamatan: formData.get('kecamatan') as string,
      kelurahan: formData.get('kelurahan') as string,
      statusBT: formData.get('statusBT') as any || 'Belum',
      statusSU: formData.get('statusSU') as any || 'Belum',
      statusUpload: formData.get('statusUpload') as any || 'BT SU Belum',
      kendala: formData.get('kendala') as string || '',
      operatorId: user.uid,
      operatorName: userProfile?.displayName || user.displayName || 'Unknown',
      tanggalPengerjaan: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      keterangan: formData.get('keterangan') as string || '',
    };
    try {
      await addDoc(collection(db, 'certificates'), newCert);
      setShowAddCert(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'certificates');
    }
  };

  const updateCertStatus = async (id: string, status: 'Sudah' | 'Terverifikasi' | 'Belum', kendala = '') => {
    try {
      await updateDoc(doc(db, 'certificates', id), {
        statusBT: status,
        statusSU: status,
        kendala,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `certificates/${id}`);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setConfirmDialog({
      show: true,
      title: 'Hapus Proyek',
      message: 'Apakah Anda yakin ingin menghapus proyek ini? Semua data sertifikat terkait juga akan terhapus.',
      onConfirm: async () => {
        try {
          // Delete all certificates in project first
          const q = query(collection(db, 'certificates'), where('projectId', '==', projectId));
          const snapshot = await getDocs(q);
          const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'certificates', d.id)));
          await Promise.all(deletePromises);
          
          // Then delete project
          await deleteDoc(doc(db, 'projects', projectId));
          if (activeProject?.id === projectId) {
            setActiveProject(projects.find(p => p.id !== projectId) || null);
          }
          toast.success('Proyek berhasil dihapus');
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
        } finally {
          setConfirmDialog(null);
        }
      }
    });
  };

  const handleUpdateUserRole = async (uid: string, role: 'admin' | 'operator') => {
    if (userProfile?.role !== 'superadmin') {
      toast.error('Hanya Superadmin yang dapat mengubah role.');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', uid), { role });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleAssignProject = async (uid: string, projectId: string, assign: boolean) => {
    const targetUser = allUsers.find(u => u.uid === uid);
    if (!targetUser || !userProfile) return;

    // Security check: Admin can only assign projects they are assigned to
    if (userProfile.role === 'admin' && !userProfile.assignedProjects.includes(projectId)) {
      toast.error('Anda hanya dapat menugaskan proyek yang Anda kelola.');
      return;
    }

    let newProjects = [...targetUser.assignedProjects];
    if (assign) {
      if (!newProjects.includes(projectId)) newProjects.push(projectId);
    } else {
      newProjects = newProjects.filter(id => id !== projectId);
    }

    try {
      await updateDoc(doc(db, 'users', uid), { assignedProjects: newProjects });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userProfile) return;
    const formData = new FormData(e.currentTarget);
    const displayName = formData.get('displayName') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    // Admin can only add operators
    const role = effectiveRole === 'superadmin' 
      ? (formData.get('role') as 'superadmin' | 'admin' | 'operator') 
      : 'operator';

    const assignedProjectIds = formData.getAll('assignedProjects') as string[];

    // Check if user already exists
    if (allUsers.find(u => u.username && u.username === username)) {
      toast.error('User dengan username ini sudah terdaftar.');
      return;
    }

    const newUser: UserProfile = {
      uid: `custom_${Math.random().toString(36).substr(2, 9)}`,
      displayName,
      username,
      password,
      role,
      assignedProjects: assignedProjectIds
    };

    try {
      await setDoc(doc(db, 'users', newUser.uid), newUser);
      setShowAddUser(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'users');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    setConfirmDialog({
      show: true,
      title: 'Hapus User',
      message: 'Apakah Anda yakin ingin menghapus user ini?',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'users', uid));
          toast.success('User berhasil dihapus');
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
        } finally {
          setConfirmDialog(null);
        }
      }
    });
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProject || !user) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const fileBuffer = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(fileBuffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        // Skip header (row 1-3 based on image, data starts at row 4)
        const rows = sheetData.slice(3); 
        
        const newCerts: Omit<Certificate, 'id'>[] = rows
          .filter(row => row[1]) // Ensure NO HAK exists
          .map(row => ({
            projectId: activeProject.id,
            albumNomor: '', // To be filled by operator
            noHak: String(row[1] || ''),
            jenisHak: String(row[2] || ''),
            namaPemegang: String(row[3] || ''),
            jenisSuratUkur: String(row[4] || ''),
            noSu: String(row[5] || ''),
            tahunSu: String(row[6] || ''),
            kecamatan: String(row[7] || ''),
            kelurahan: String(row[8] || ''),
            statusBT: 'Belum',
            statusSU: 'Belum',
            statusUpload: 'BT SU Belum',
            kendala: String(row[9] || ''),
            operatorId: user.uid,
            operatorName: userProfile?.displayName || user.displayName || 'Unknown',
            tanggalPengerjaan: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
            keterangan: String(row[10] || ''),
          }));

        if (newCerts.length === 0) {
          toast.error('Tidak ada data valid ditemukan di file Excel');
          return;
        }

        setConfirmDialog({
          show: true,
          title: 'Impor Data Sertifikat',
          message: `Apakah Anda yakin ingin mengimpor ${newCerts.length} data sertifikat ke proyek ini?`,
          confirmText: 'Impor Sekarang',
          confirmVariant: 'primary',
          onConfirm: async () => {
            setConfirmDialog(null);
            const loadingToast = toast.loading(`Mengimpor ${newCerts.length} data...`);
            
            let successCount = 0;
            for (const cert of newCerts) {
              try {
                await addDoc(collection(db, 'certificates'), cert);
                successCount++;
              } catch (err) {
                console.error('Error importing row:', err);
              }
            }

            toast.dismiss(loadingToast);
            toast.success(`Berhasil mengimpor ${successCount} data sertifikat`);
            if (e.target) e.target.value = ''; // Reset input
          }
        });
      } catch (err) {
        console.error('Excel parse error:', err);
        toast.error('Gagal membaca file Excel. Pastikan format sesuai.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportMasterData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProject || !user) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const fileBuffer = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(fileBuffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        const rows = sheetData.slice(3); 
        
        const newMasterData: Omit<MasterVillageData, 'id'>[] = rows
          .filter(row => row[1]) 
          .map(row => ({
            projectId: activeProject.id,
            no: String(row[0] || ''),
            noHak: String(row[1] || ''),
            jenisHak: String(row[2] || ''),
            namaPemegang: String(row[3] || ''),
            jenisSuratUkur: String(row[4] || ''),
            noSu: String(row[5] || ''),
            tahunSu: String(row[6] || ''),
            kecamatan: String(row[7] || ''),
            kelurahan: String(row[8] || ''),
            isTaken: false
          }));

        if (newMasterData.length === 0) {
          toast.error('Tidak ada data valid ditemukan di file Excel');
          return;
        }

        setConfirmDialog({
          show: true,
          title: 'Impor Data Desa Master',
          message: `Apakah Anda yakin ingin mengimpor ${newMasterData.length} data desa master ke proyek ini?`,
          confirmText: 'Impor Sekarang',
          confirmVariant: 'primary',
          onConfirm: async () => {
            setConfirmDialog(null);
            const loadingToast = toast.loading(`Mengimpor ${newMasterData.length} data master...`);
            
            let successCount = 0;
            for (const item of newMasterData) {
              try {
                await addDoc(collection(db, 'master_village_data'), item);
                successCount++;
              } catch (err) {
                console.error('Error importing master row:', err);
              }
            }

            toast.dismiss(loadingToast);
            toast.success(`Berhasil mengimpor ${successCount} data desa master`);
            if (e.target) e.target.value = ''; 
          }
        });
      } catch (err) {
        console.error('Master Excel parse error:', err);
        toast.error('Gagal membaca file Excel. Pastikan format sesuai.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTakeData = async (items: MasterVillageData[], albumNomor: string) => {
    if (!activeProject || !user || items.length === 0) return;

    const loadingToast = toast.loading(`Mengambil ${items.length} data...`);
    let successCount = 0;

    for (const item of items) {
      if (item.isTaken) continue;

      const newCert: Omit<Certificate, 'id'> = {
        projectId: activeProject.id,
        albumNomor: albumNomor,
        no: item.no,
        noHak: item.noHak,
        jenisHak: item.jenisHak,
        namaPemegang: item.namaPemegang || '',
        jenisSuratUkur: item.jenisSuratUkur,
        noSu: item.noSu,
        tahunSu: item.tahunSu,
        kecamatan: item.kecamatan,
        kelurahan: item.kelurahan,
        statusBT: 'Belum',
        statusSU: 'Belum',
        statusUpload: 'BT SU Belum',
        kendala: '',
        operatorId: user.uid,
        operatorName: userProfile?.displayName || user.displayName || 'Unknown',
        tanggalPengerjaan: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      };

      try {
        // 1. Add to certificates
        await addDoc(collection(db, 'certificates'), newCert);
        // 2. Mark as taken in master data
        if (item.id) {
          await updateDoc(doc(db, 'master_village_data', item.id), {
            isTaken: true,
            takenBy: user.uid,
            takenByName: userProfile?.displayName || user.displayName || 'Unknown',
            takenAt: new Date().toISOString()
          });
        }
        successCount++;
      } catch (err) {
        console.error('Error taking data:', err);
      }
    }

    toast.dismiss(loadingToast);
    toast.success(`Berhasil mengambil ${successCount} data ke dashboard Anda`);
    setView('verification');
  };

  const handleDeleteMasterData = async (projectId: string) => {
    setConfirmDialog({
      show: true,
      title: 'Hapus Data Desa',
      message: 'Apakah Anda yakin ingin menghapus SEMUA data desa master untuk proyek ini?',
      onConfirm: async () => {
        try {
          const q = query(collection(db, 'master_village_data'), where('projectId', '==', projectId));
          const snapshot = await getDocs(q);
          const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'master_village_data', d.id)));
          await Promise.all(deletePromises);
          toast.success('Semua data desa master berhasil dihapus');
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, 'master_village_data');
        } finally {
          setConfirmDialog(null);
        }
      }
    });
  };

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const formData = new FormData(e.currentTarget);
    const updates = {
      displayName: formData.get('displayName') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as 'admin' | 'operator',
      assignedProjects: formData.getAll('assignedProjects') as string[]
    };

    try {
      await updateDoc(doc(db, 'users', editingUser.uid), updates);
      setEditingUser(null);
      toast.success('Profil user berhasil diperbarui');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${editingUser.uid}`);
    }
  };

  const handleEditCert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCert || !editingCert.id) return;
    const formData = new FormData(e.currentTarget);
    const updates = {
      albumNomor: formData.get('albumNomor') as string,
      noHak: formData.get('noHak') as string,
      jenisHak: formData.get('jenisHak') as string,
      namaPemegang: formData.get('namaPemegang') as string,
      jenisSuratUkur: formData.get('jenisSuratUkur') as string,
      noSu: formData.get('noSu') as string,
      tahunSu: formData.get('tahunSu') as string,
      kecamatan: formData.get('kecamatan') as string,
      kelurahan: formData.get('kelurahan') as string,
      statusBT: formData.get('statusBT') as any,
      statusSU: formData.get('statusSU') as any,
      statusUpload: formData.get('statusUpload') as any,
      kendala: formData.get('kendala') as string,
      tanggalPengerjaan: formData.get('tanggalPengerjaan') as string,
      updatedAt: new Date().toISOString(),
      keterangan: formData.get('keterangan') as string,
    };

    try {
      await updateDoc(doc(db, 'certificates', editingCert.id), updates);
      setEditingCert(null);
      toast.success('Data sertifikat berhasil diperbarui');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `certificates/${editingCert.id}`);
    }
  };

  const handleDeleteCert = async (id: string) => {
    console.log('Initiating delete for cert:', id);
    if (!id) {
      toast.error('Gagal menghapus: ID tidak ditemukan');
      return;
    }
    setConfirmDialog({
      show: true,
      title: 'Hapus Data Verifikasi',
      message: 'Apakah Anda yakin ingin menghapus data verifikasi ini?',
      onConfirm: async () => {
        console.log('Confirming delete for cert:', id);
        toast.info('Sedang menghapus data...');
        try {
          await deleteDoc(doc(db, 'certificates', id));
          toast.success('Data sertifikat berhasil dihapus');
          console.log('Delete successful');
        } catch (err) {
          console.error('Delete failed:', err);
          toast.error('Gagal menghapus data: ' + (err instanceof Error ? err.message : String(err)));
          handleFirestoreError(err, OperationType.DELETE, `certificates/${id}`);
        } finally {
          setConfirmDialog(null);
        }
      }
    });
  };

  const toggleUploadStatus = async (id: string, current: Certificate['statusUpload']) => {
    const statuses: Certificate['statusUpload'][] = ['BT Belum', 'SU Belum', 'BT SU Belum', 'Sudah Upload BTSU'];
    const nextIndex = (statuses.indexOf(current) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    
    try {
      await updateDoc(doc(db, 'certificates', id), {
        statusUpload: nextStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Status upload diperbarui ke: ${nextStatus}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `certificates/${id}`);
    }
  };

  if (loading || (customUser && !user)) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Menyiapkan sesi...</p>
      </div>
    </div>
  );

  if (isAuthReady && !userProfile) return <LoginPage onCredentialLogin={handleCredentialLogin} />;

  if (user && !userProfile && !isAuthReady) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Sinkronisasi Profil...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* --- Mobile Header --- */}
      <header className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center">
            <img 
              src={logoKwm} 
              alt="Logo KWM" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-xs leading-tight tracking-wide">Aplikasi Verval <br/>CV. KARTAWIJAYA MANDIRI</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* --- Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside className={cn(
        "w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 transform lg:translate-x-0 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImportExcel} 
          accept=".xlsx, .xls" 
          className="hidden" 
        />
        <div className="p-6 flex flex-col gap-4 border-b border-slate-800">
          <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <img 
              src={logoKwm} 
              alt="Logo KWM" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg leading-tight tracking-wide">Aplikasi Verval</span>
            <span className="font-medium text-slate-400 text-[10px] leading-tight tracking-wider">CV. KARTAWIJAYA MANDIRI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu Utama</div>
          <button 
            onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
              view === 'dashboard' ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
            )}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => { setView('verification'); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
              view === 'verification' ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
            )}
          >
            <FileCheck className="w-5 h-5" /> Verifikasi
          </button>

          <button 
            onClick={() => { setView('village_data'); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
              view === 'village_data' ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
            )}
          >
            <Database className="w-5 h-5" /> Data Desa
          </button>

          {(userProfile?.role === 'admin' || userProfile?.role === 'superadmin') && (
            <button 
              onClick={() => { setView('operators'); setIsSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
                view === 'operators' ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
              )}
            >
              <Users className="w-5 h-5" /> Operator
            </button>
          )}
          
          <div className="mt-8 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Proyek Aktif</div>
          <div className="space-y-1">
            {visibleProjects.map(p => (
              <button 
                key={p.id}
                onClick={() => {
                  setActiveProject(p);
                  setView('dashboard');
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm",
                  activeProject?.id === p.id ? "bg-slate-800 text-white font-medium" : "hover:bg-slate-800/50"
                )}
              >
                <span className="truncate">{p.name}</span>
                {activeProject?.id === p.id && <ChevronRight className="w-4 h-4 text-indigo-400" />}
              </button>
            ))}
            {(effectiveRole === 'admin' || effectiveRole === 'superadmin') && (
              <button 
                onClick={() => { setShowAddProject(true); setIsSidebarOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-indigo-400 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Tambah Proyek
              </button>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {userProfile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userProfile?.displayName || user?.displayName || 'User'}</p>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                  effectiveRole === 'superadmin' ? "bg-red-500 text-white" :
                  effectiveRole === 'admin' ? "bg-indigo-500 text-white" :
                  "bg-slate-700 text-slate-300"
                )}>
                  {effectiveRole || 'Guest'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 min-w-0 lg:ml-64 p-4 lg:p-8">        {view === 'dashboard' ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">{activeProject?.name || 'Pilih Proyek'}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {activeProject?.location || 'Lokasi belum ditentukan'}
                  </p>
                  {userProfile?.role === 'superadmin' && activeProject && (
                    <button 
                      onClick={() => handleDeleteProject(activeProject.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-medium underline"
                    >
                      Hapus Proyek
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="bg-white border border-slate-200">
                  <Database className="w-4 h-4" /> Import Excel
                </Button>
                <Button variant="secondary" className="bg-white border border-slate-200">
                  <Clock className="w-4 h-4" /> Riwayat
                </Button>
                <Button onClick={() => setShowAddCert(true)}>
                  <Plus className="w-4 h-4" /> Tambah Data
                </Button>
              </div>
            </header>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Data', value: stats.total, icon: Database, color: 'indigo' },
                { label: 'BT Selesai', value: stats.verifiedBT, icon: CheckCircle2, color: 'emerald' },
                { label: 'SU Selesai', value: stats.verifiedSU, icon: FileCheck, color: 'blue' },
                { label: 'Ada Kendala', value: stats.issues, icon: AlertCircle, color: 'red' },
              ].map((stat, i) => (
                <Card key={i} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                    <div className={cn(
                      "p-2 rounded-lg",
                      stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                      stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                      stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                      "bg-red-50 text-red-600"
                    )}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% dari minggu lalu</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* --- Charts --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" /> Tren Verifikasi Harian
                  </h4>
                  <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 focus:ring-0">
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-indigo-600" /> Komposisi Status
                </h4>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
                    <span className="text-xs text-slate-500">Total Data</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        ) : view === 'verification' ? (
          <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Verifikasi Data</h2>
                <p className="text-slate-500 mt-1">Lakukan pengecekan dan validasi data sertifikat untuk proyek <span className="font-bold text-indigo-600">{activeProject?.name}</span>.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setSearchTerm(''); setFilterStatus('Belum'); }}>
                  Fokus Belum Proses
                </Button>
                <Button onClick={() => setShowAddCert(true)}>
                  <Plus className="w-4 h-4" /> Tambah Data
                </Button>
              </div>
            </header>

            <Card>
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Cari No Hak, Nama, Album..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <Select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { label: 'Semua Status', value: 'All' },
                      { label: 'Belum Verifikasi', value: 'Belum' },
                      { label: 'Sudah Verifikasi', value: 'Sudah' },
                      { label: 'Terverifikasi (BPN)', value: 'Terverifikasi' },
                    ]}
                    className="w-44"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-bold text-indigo-600">{filteredCerts.length}</span> Data ditampilkan
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      {effectiveRole === 'operator' ? (
                        <>
                          <th className="px-6 py-4">Data Sertifikat</th>
                          <th className="px-6 py-4">Wilayah & Album</th>
                          <th className="px-6 py-4 text-center">Status BT</th>
                          <th className="px-6 py-4 text-center">Status SU</th>
                          <th className="px-6 py-4 text-center">Upload</th>
                          <th className="px-6 py-4 text-right">Aksi</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4">No Hak</th>
                          <th className="px-6 py-4">Jenis Hak</th>
                          <th className="px-6 py-4">Nama Pemegang</th>
                          <th className="px-6 py-4">Jenis SU</th>
                          <th className="px-6 py-4">No SU</th>
                          <th className="px-6 py-4">Tahun SU</th>
                          <th className="px-6 py-4">Kecamatan</th>
                          <th className="px-6 py-4">Kelurahan</th>
                          <th className="px-6 py-4 text-center">Status BT</th>
                          <th className="px-6 py-4 text-center">Status SU</th>
                          <th className="px-6 py-4 text-center">Upload</th>
                          <th className="px-6 py-4">Kendala</th>
                          <th className="px-6 py-4">Tgl Kerja</th>
                          <th className="px-6 py-4">Operator</th>
                          <th className="px-6 py-4">Tgl Update</th>
                          <th className="px-6 py-4">Keterangan</th>
                          <th className="px-6 py-4 text-right">Aksi</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCerts.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50 transition-colors group">
                        {effectiveRole === 'operator' ? (
                          <>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{cert.noHak}</div>
                              <div className="text-xs text-slate-500 font-medium">{cert.jenisHak}</div>
                              <div className="text-sm text-slate-600 mt-1">{cert.namaPemegang}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-400" /> {cert.kelurahan}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600">Album: {cert.albumNomor || '-'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                cert.statusBT === 'Sudah' ? "bg-emerald-100 text-emerald-700" : 
                                cert.statusBT === 'Terverifikasi' ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                              )}>
                                {cert.statusBT}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                cert.statusSU === 'Sudah' ? "bg-emerald-100 text-emerald-700" : 
                                cert.statusSU === 'Terverifikasi' ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                              )}>
                                {cert.statusSU}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <button 
                                  onClick={() => toggleUploadStatus(cert.id!, cert.statusUpload)}
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all",
                                    cert.statusUpload === 'Sudah Upload BTSU' ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                  )}
                                >
                                  {cert.statusUpload}
                                </button>
                                {cert.kendala && <span className="text-[10px] text-red-500 italic max-w-[120px] truncate" title={cert.kendala}>{cert.kendala}</span>}
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 font-bold text-slate-900">{cert.noHak}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{cert.jenisHak}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{cert.namaPemegang}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{cert.jenisSuratUkur}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{cert.noSu}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{cert.tahunSu}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{cert.kecamatan}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{cert.kelurahan}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                cert.statusBT === 'Sudah' ? "bg-emerald-100 text-emerald-700" : 
                                cert.statusBT === 'Terverifikasi' ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                              )}>
                                {cert.statusBT}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                cert.statusSU === 'Sudah' ? "bg-emerald-100 text-emerald-700" : 
                                cert.statusSU === 'Terverifikasi' ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                              )}>
                                {cert.statusSU}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => toggleUploadStatus(cert.id!, cert.statusUpload)}
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all",
                                  cert.statusUpload === 'Sudah Upload BTSU' ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                )}
                              >
                                {cert.statusUpload}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-xs text-red-500 italic max-w-[150px] truncate" title={cert.kendala}>{cert.kendala || '-'}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{cert.tanggalPengerjaan}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{cert.operatorName}</td>
                            <td className="px-6 py-4 text-[10px] text-slate-400">{new Date(cert.updatedAt).toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 max-w-[150px] truncate" title={cert.keterangan}>{cert.keterangan || '-'}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingCert(cert)}
                              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                              title="Edit & Verifikasi"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateCertStatus(cert.id!, 'Sudah')}
                              className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                              title="Verifikasi Cepat"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            {(effectiveRole === 'admin' || effectiveRole === 'superadmin') && (
                              <button 
                                onClick={() => handleDeleteCert(cert.id!)}
                                className="p-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-sm"
                                title="Hapus Data"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCerts.length === 0 && (
                  <div className="p-20 text-center text-slate-400">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Data tidak ditemukan</h3>
                    <p className="max-w-xs mx-auto mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : view === 'village_data' ? (
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Data Desa Master</h2>
                <p className="text-slate-500 mt-1">
                  {effectiveRole === 'operator' 
                    ? 'Pilih data desa untuk dikerjakan (maksimal 100 per album).' 
                    : 'Kelola data desa master untuk proyek ini.'}
                </p>
              </div>
              <div className="flex gap-3">
                {(effectiveRole === 'admin' || effectiveRole === 'superadmin') && (
                  <>
                    <Button variant="secondary" onClick={() => masterFileInputRef.current?.click()}>
                      <Upload className="w-4 h-4" /> Impor Data Desa
                    </Button>
                    <Button variant="danger" onClick={() => activeProject && handleDeleteMasterData(activeProject.id)}>
                      <Trash2 className="w-4 h-4" /> Hapus Semua
                    </Button>
                  </>
                )}
              </div>
            </header>

            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari No Hak, Nama Pemegang, atau Kelurahan..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={masterFilterStatus}
                    onChange={(e) => setMasterFilterStatus(e.target.value as any)}
                  >
                    <option value="All">Semua Status</option>
                    <option value="Available">Tersedia</option>
                    <option value="Taken">Sudah Diambil</option>
                  </select>
                </div>
                {effectiveRole === 'operator' && selectedMasterIds.length > 0 && (
                  <div className="flex items-center gap-3 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                    <input 
                      type="text" 
                      placeholder="Input No Album..." 
                      className="px-3 py-1.5 bg-white border border-indigo-200 rounded text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-32"
                      value={albumNomorForTake}
                      onChange={(e) => setAlbumNomorForTake(e.target.value)}
                    />
                    <Button 
                      className="px-3 py-1.5 text-xs"
                      disabled={!albumNomorForTake}
                      onClick={() => {
                        const selectedItems = masterVillageData.filter(d => selectedMasterIds.includes(d.id!));
                        handleTakeData(selectedItems, albumNomorForTake);
                        setSelectedMasterIds([]);
                        setAlbumNomorForTake('');
                      }}
                    >
                      Ambil {selectedMasterIds.length} Data
                    </Button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4 w-10">
                        {effectiveRole === 'operator' && (
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedMasterIds.length === filteredMasterData.filter(d => !d.isTaken).length && filteredMasterData.filter(d => !d.isTaken).length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const availableIds = filteredMasterData
                                  .filter(d => !d.isTaken)
                                  .slice(0, 100)
                                  .map(d => d.id!);
                                setSelectedMasterIds(availableIds);
                              } else {
                                setSelectedMasterIds([]);
                              }
                            }}
                          />
                        )}
                      </th>
                      <th className="px-6 py-4">No Hak</th>
                      <th className="px-6 py-4">Jenis Hak</th>
                      <th className="px-6 py-4">Jenis SU</th>
                      <th className="px-6 py-4">No SU</th>
                      <th className="px-6 py-4">Tahun SU</th>
                      <th className="px-6 py-4">Kecamatan</th>
                      <th className="px-6 py-4">Kelurahan</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMasterData.map((item) => (
                        <tr key={item.id} className={cn("hover:bg-slate-50 transition-colors", item.isTaken ? "opacity-50" : "")}>
                          <td className="px-6 py-4">
                            {!item.isTaken && effectiveRole === 'operator' && (
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                checked={selectedMasterIds.includes(item.id!)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (selectedMasterIds.length >= 100) {
                                      toast.error('Maksimal pengambilan adalah 100 data per album');
                                      return;
                                    }
                                    setSelectedMasterIds(prev => [...prev, item.id!]);
                                  } else {
                                    setSelectedMasterIds(prev => prev.filter(id => id !== item.id));
                                  }
                                }}
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">{item.noHak}</td>
                          <td className="px-6 py-4 text-slate-600">{item.jenisHak}</td>
                          <td className="px-6 py-4 text-slate-600">{item.jenisSuratUkur}</td>
                          <td className="px-6 py-4 text-slate-600">{item.noSu}</td>
                          <td className="px-6 py-4 text-slate-600">{item.tahunSu}</td>
                          <td className="px-6 py-4 text-slate-600">{item.kecamatan}</td>
                          <td className="px-6 py-4 text-slate-600">{item.kelurahan}</td>
                          <td className="px-6 py-4">
                            {item.isTaken ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                <User className="w-3 h-3" /> Diambil oleh {item.takenByName}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                Tersedia
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (

          <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Manajemen Operator</h2>
                <p className="text-slate-500 mt-1">Kelola hak akses dan penugasan proyek untuk semua pengguna.</p>
              </div>
              <Button onClick={() => setShowAddUser(true)}>
                <Plus className="w-4 h-4" /> Tambah User
              </Button>
            </header>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Nama Lengkap</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Proyek Ditugaskan</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleUsers
                      .filter(u => u.role !== 'superadmin')
                      .filter(u => {
                        // Only show master records for credential users (uid starts with custom_)
                        // Google users don't have a username field and have stable UIDs
                        if (u.username && !u.uid.startsWith('custom_')) return false;
                        return true;
                      })
                      .map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{u.displayName}</div>
                          {u.username && <div className="text-xs text-slate-500">@{u.username}</div>}
                        </td>
                        <td className="px-6 py-4">
                          {effectiveRole === 'superadmin' ? (
                            <select 
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.uid, e.target.value as any)}
                              className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="operator">Operator</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Superadmin</option>
                            </select>
                          ) : (
                            <span className="text-sm font-medium text-slate-600 capitalize">{u.role}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {projects
                              .filter(p => effectiveRole === 'superadmin' || userProfile?.assignedProjects.includes(p.id))
                              .map(p => (
                              <button
                                key={p.id}
                                onClick={() => handleAssignProject(u.uid, p.id, !u.assignedProjects.includes(p.id))}
                                className={cn(
                                  "px-2 py-1 rounded text-[10px] font-bold uppercase transition-all",
                                  u.assignedProjects.includes(p.id) 
                                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200" 
                                    : "bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200"
                                )}
                              >
                                {p.name}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" className="text-xs" onClick={() => setEditingUser(u)}>
                              Edit
                            </Button>
                            <Button variant="ghost" className="text-xs text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(u.uid)}>
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* --- Modals --- */}
      {showAddProject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Tambah Proyek Baru</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <Input label="Nama Proyek" name="name" placeholder="Contoh: BPN Kabupaten Jombang" />
              <Input label="Lokasi" name="location" placeholder="Contoh: Jawa Timur" />
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowAddProject(false)}>Batal</Button>
                <Button type="submit" className="flex-1">Simpan Proyek</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showAddCert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Tambah Data Sertifikat</h3>
            <form onSubmit={handleAddCert} className="grid grid-cols-2 gap-4">
              <Input label="Album Nomor" name="albumNomor" placeholder="Contoh: 001" className="col-span-1" />
              <Input label="No Hak" name="noHak" placeholder="Contoh: 2901" className="col-span-1" />
              <Select 
                label="Jenis Hak" 
                name="jenisHak" 
                options={[
                  { label: 'Hak Milik', value: 'Hak Milik' },
                  { label: 'Hak Guna Bangunan', value: 'Hak Guna Bangunan' },
                  { label: 'Hak Pakai', value: 'Hak Pakai' },
                ]}
              />
              <Input label="Nama Pemegang Hak" name="namaPemegang" placeholder="Nama lengkap..." className="col-span-1" />
              <Select 
                label="Jenis SU" 
                name="jenisSuratUkur" 
                options={[
                  { label: 'GS', value: 'GS' },
                  { label: 'SU', value: 'SU' },
                  { label: 'PLL', value: 'PLL' },
                ]}
              />
              <Input label="No Surat Ukur" name="noSu" placeholder="No SU..." />
              <Input label="Tahun SU" name="tahunSu" placeholder="Tahun..." />
              <Input label="Kecamatan" name="kecamatan" placeholder="Kecamatan..." />
              <Input label="Kelurahan/Desa" name="kelurahan" placeholder="Kelurahan..." />
              
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-700">Keterangan (Opsional)</label>
                <textarea 
                  name="keterangan"
                  placeholder="Masukkan keterangan tambahan..."
                  className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-6 col-span-2">
                <Button variant="secondary" className="flex-1" onClick={() => setShowAddCert(false)}>Batal</Button>
                <Button type="submit" className="flex-1">Simpan Data</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showAddUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Tambah User Baru</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input label="Nama Lengkap" name="displayName" placeholder="Nama..." required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Username" name="username" placeholder="Username..." required />
                <Input label="Password" name="password" type="password" placeholder="Password..." required />
              </div>
              <Select 
                label="Role" 
                name="role" 
                disabled={effectiveRole !== 'superadmin'}
                defaultValue={effectiveRole === 'admin' ? 'operator' : 'operator'}
                options={effectiveRole === 'superadmin' ? [
                  { label: 'Operator', value: 'operator' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Superadmin', value: 'superadmin' },
                ] : [
                  { label: 'Operator', value: 'operator' }
                ]} 
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Penugasan Proyek</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-3 border border-slate-300 rounded-lg bg-slate-50">
                  {projects
                    .filter(p => effectiveRole === 'superadmin' || userProfile?.assignedProjects.includes(p.id))
                    .map(p => (
                      <Checkbox 
                        key={p.id} 
                        label={p.name} 
                        name="assignedProjects" 
                        value={p.id}
                        defaultChecked={effectiveRole === 'admin' && userProfile?.assignedProjects.includes(p.id)}
                      />
                    ))}
                  {projects.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada proyek tersedia</p>}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowAddUser(false)}>Batal</Button>
                <Button type="submit" className="flex-1">Simpan User</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {editingCert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Edit & Verifikasi Sertifikat</h3>
              <button onClick={() => setEditingCert(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleEditCert} className="grid grid-cols-2 gap-4">
              <Input label="Album Nomor" name="albumNomor" defaultValue={editingCert.albumNomor} className="col-span-1" />
              <Input label="No Hak" name="noHak" defaultValue={editingCert.noHak} className="col-span-1" />
              <Select 
                label="Jenis Hak" 
                name="jenisHak" 
                defaultValue={editingCert.jenisHak}
                options={[
                  { label: 'Hak Milik', value: 'Hak Milik' },
                  { label: 'Hak Guna Bangunan', value: 'Hak Guna Bangunan' },
                  { label: 'Hak Pakai', value: 'Hak Pakai' },
                ]}
              />
              <Input label="Nama Pemegang Hak" name="namaPemegang" defaultValue={editingCert.namaPemegang} className="col-span-1" />
              <Select 
                label="Jenis SU" 
                name="jenisSuratUkur" 
                defaultValue={editingCert.jenisSuratUkur}
                options={[
                  { label: 'GS', value: 'GS' },
                  { label: 'SU', value: 'SU' },
                  { label: 'PLL', value: 'PLL' },
                ]}
              />
              <Input label="No Surat Ukur" name="noSu" defaultValue={editingCert.noSu} />
              <Input label="Tahun SU" name="tahunSu" defaultValue={editingCert.tahunSu} />
              <Input label="Kecamatan" name="kecamatan" defaultValue={editingCert.kecamatan} />
              <Input label="Kelurahan/Desa" name="kelurahan" defaultValue={editingCert.kelurahan} />
              
              <div className="col-span-2 grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <Select 
                  label="Status BT" 
                  name="statusBT" 
                  defaultValue={editingCert.statusBT}
                  options={[
                    { label: 'Belum', value: 'Belum' },
                    { label: 'Sudah', value: 'Sudah' },
                    { label: 'Terverifikasi (BPN)', value: 'Terverifikasi' },
                  ]}
                />
                <Select 
                  label="Status SU" 
                  name="statusSU" 
                  defaultValue={editingCert.statusSU}
                  options={[
                    { label: 'Belum', value: 'Belum' },
                    { label: 'Sudah', value: 'Sudah' },
                    { label: 'Terverifikasi (BPN)', value: 'Terverifikasi' },
                  ]}
                />
                <Select 
                  label="Status Upload" 
                  name="statusUpload" 
                  defaultValue={editingCert.statusUpload}
                  options={[
                    { label: 'BT Belum', value: 'BT Belum' },
                    { label: 'SU Belum', value: 'SU Belum' },
                    { label: 'BT SU Belum', value: 'BT SU Belum' },
                    { label: 'Sudah Upload BTSU', value: 'Sudah Upload BTSU' },
                  ]}
                />
              </div>

              <div className="col-span-2">
                <Input label="Tanggal Pengerjaan" name="tanggalPengerjaan" type="date" defaultValue={editingCert.tanggalPengerjaan} />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-700">Catatan Kendala (Opsional)</label>
                <textarea 
                  name="kendala"
                  defaultValue={editingCert.kendala}
                  placeholder="Masukkan alasan jika ada kendala..."
                  className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[80px]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-700">Keterangan (Opsional)</label>
                <textarea 
                  name="keterangan"
                  defaultValue={editingCert.keterangan}
                  placeholder="Masukkan keterangan tambahan..."
                  className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[80px]"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-6 col-span-2">
                <Button variant="secondary" className="flex-1" onClick={() => setEditingCert(null)}>Batal</Button>
                {(effectiveRole === 'admin' || effectiveRole === 'superadmin') && (
                  <Button 
                    variant="danger" 
                    className="flex-1" 
                    onClick={() => {
                      const id = editingCert.id;
                      setEditingCert(null);
                      handleDeleteCert(id!);
                    }}
                  >
                    Hapus Data
                  </Button>
                )}
                <Button type="submit" className="flex-1">Simpan Perubahan</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Edit User</h3>
            <form onSubmit={handleEditUser} className="space-y-4">
              <Input label="Nama Lengkap" name="displayName" defaultValue={editingUser.displayName} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Username" name="username" defaultValue={editingUser.username} placeholder="Username..." required />
                <Input label="Password" name="password" type="password" defaultValue={editingUser.password} placeholder="Password..." required />
              </div>
              <Select 
                label="Role" 
                name="role" 
                disabled={effectiveRole !== 'superadmin'}
                defaultValue={editingUser.role}
                options={effectiveRole === 'superadmin' ? [
                  { label: 'Operator', value: 'operator' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Superadmin', value: 'superadmin' },
                ] : [
                  { label: 'Operator', value: 'operator' }
                ]} 
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Penugasan Proyek</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-3 border border-slate-300 rounded-lg bg-slate-50">
                  {projects
                    .filter(p => effectiveRole === 'superadmin' || userProfile?.assignedProjects.includes(p.id))
                    .map(p => (
                      <Checkbox 
                        key={p.id} 
                        label={p.name} 
                        name="assignedProjects" 
                        value={p.id}
                        defaultChecked={editingUser.assignedProjects.includes(p.id)}
                      />
                    ))}
                  {projects.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada proyek tersedia</p>}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setEditingUser(null)}>Batal</Button>
                <Button type="submit" className="flex-1">Simpan Perubahan</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* --- Confirmation Dialog --- */}
      {confirmDialog && confirmDialog.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
          <Card className={cn(
            "max-w-sm w-full p-6 shadow-2xl border-t-4",
            confirmDialog.confirmVariant === 'primary' ? "border-t-indigo-600" : "border-t-red-600"
          )}>
            <div className={cn(
              "flex items-center gap-3 mb-4",
              confirmDialog.confirmVariant === 'primary' ? "text-indigo-600" : "text-red-600"
            )}>
              {confirmDialog.confirmVariant === 'primary' ? <Database className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              <h3 className="text-lg font-bold">{confirmDialog.title}</h3>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={() => setConfirmDialog(null)}
              >
                Batal
              </Button>
              <Button 
                className={cn(
                  "flex-1 text-white shadow-lg transition-all active:scale-95",
                  confirmDialog.confirmVariant === 'primary' ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-red-600 hover:bg-red-700 shadow-red-200"
                )} 
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText || 'Hapus'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <input 
        type="file" 
        ref={masterFileInputRef} 
        onChange={handleImportMasterData} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}
