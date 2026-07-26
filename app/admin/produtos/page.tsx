import { prisma } from '@/lib/prisma';
import ProdutosAdminClient from './ProdutosAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminProdutos() {
    const produtos = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return <ProdutosAdminClient initialProducts={produtos} />;
}
