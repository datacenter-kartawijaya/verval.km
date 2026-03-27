export interface Project {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  createdBy: string;
}

export interface Certificate {
  id?: string;
  projectId: string;
  albumNomor?: string;
  no?: string;
  noHak: string;
  jenisHak: string;
  namaPemegang: string;
  jenisSuratUkur: string;
  noSu: string;
  tahunSu: string;
  kecamatan: string;
  kelurahan: string;
  statusBT: 'Belum' | 'Sudah' | 'Terverifikasi';
  statusSU: 'Belum' | 'Sudah' | 'Terverifikasi';
  statusUpload: 'BT Belum' | 'SU Belum' | 'BT SU Belum' | 'Sudah Upload BTSU';
  kendala: string;
  operatorId: string;
  operatorName: string;
  tanggalPengerjaan: string;
  updatedAt: string;
  keterangan?: string;
}

export interface MasterVillageData {
  id?: string;
  projectId: string;
  no?: string;
  noHak: string;
  jenisHak: string;
  namaPemegang?: string;
  jenisSuratUkur: string;
  noSu: string;
  tahunSu: string;
  kecamatan: string;
  kelurahan: string;
  isTaken: boolean;
  takenBy?: string;
  takenByName?: string;
  takenAt?: string;
}

export interface UserProfile {
  uid: string;
  email?: string;
  displayName: string;
  username?: string;
  password?: string;
  role: 'superadmin' | 'admin' | 'operator';
  assignedProjects: string[];
}
