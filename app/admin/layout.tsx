import { redirect } from 'next/navigation';
import { supabase } from '@/utils/supabase'; // Sesuaikan path Supabase Anda

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil session user yang sedang login secara Server-Side
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Jika tidak ada user yang login, tendang kembali ke halaman login
  if (authError || !user) {
    redirect('/login');
  }

  // 2. MITIGASI E-01 & E-02: Ambil Role langsung dari Database (Bukan dari Cookie/Client)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role') // Asumsi ada kolom 'role' di tabel profiles
    .eq('id', user.id)
    .single();

  // 3. Validasi ketat: Jika error, tidak ada profil, atau role BUKAN admin
  if (profileError || !profile || profile.role !== 'admin') {
    console.error(`[SECURITY ALERT] Akses ilegal ke panel Admin oleh User ID: ${user.id}`);
    // Tendang user biasa ke halaman home mereka
    redirect('/home');
  }

  // =================================================================
  // Jika lolos sampai sini, user DIJAMIN adalah Admin yang sah
  // =================================================================

  return (
    <div className="admin-layout-container">
      {/* Anda bisa menambahkan Sidebar atau Header Admin di sini */}
      <nav>
        {/* Navigasi Admin */}
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  );
}