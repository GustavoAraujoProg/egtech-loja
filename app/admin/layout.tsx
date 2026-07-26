import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminShell from './AdminShell';

// O proxy.ts já bloqueia visitantes não logados nesta rota, mas essa checagem
// de verdade (role === ADMIN) fica aqui no server component, que não pode ser
// contornado.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login?next=/admin');
    }
    if (user.role !== 'ADMIN') {
        redirect('/');
    }

    return <AdminShell>{children}</AdminShell>;
}
