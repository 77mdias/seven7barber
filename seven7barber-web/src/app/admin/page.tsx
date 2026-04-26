import Link from 'next/link';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
}

function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="bg-[#272727] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-3xl font-heading font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-[#bababa]">{title}</div>
      {subtitle && <div className="text-xs text-[#732F3B] mt-1">{subtitle}</div>}
    </div>
  );
}

interface AppointmentRow {
  id: string;
  time: string;
  client: string;
  barber: string;
  service: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

const MOCK_APPOINTMENTS: AppointmentRow[] = [
  { id: '1', time: '09:00', client: 'Carlos Santos', barber: 'João Silva', service: 'Corte Masculino', status: 'SCHEDULED' },
  { id: '2', time: '10:00', client: 'Pedro Oliveira', barber: 'Maria Costa', service: 'Barba Completa', status: 'CONFIRMED' },
  { id: '3', time: '11:00', client: 'Lucas Ferreira', barber: 'João Silva', service: 'Corte + Barba', status: 'SCHEDULED' },
  { id: '4', time: '14:00', client: 'André Lima', barber: 'Pedro Santos', service: 'Sobrancelha', status: 'CONFIRMED' },
  { id: '5', time: '15:00', client: 'Rafael Costa', barber: 'Maria Costa', service: 'Tratamento Capilar', status: 'SCHEDULED' },
];

const STATUS_COLORS = {
  SCHEDULED: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export default function AdminDashboard() {
  const todayCount = MOCK_APPOINTMENTS.length;
  const confirmedCount = MOCK_APPOINTMENTS.filter(a => a.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#111] border-b-2 border-[#732F3B]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-white">SEVEN</span>
            <span className="font-heading text-2xl font-bold text-[#732F3B]">7</span>
            <span className="font-heading text-2xl font-bold text-white">BARBER</span>
            <span className="ml-4 text-sm text-[#bababa]">Admin</span>
          </div>
          <Link href="/" className="text-sm font-medium text-[#732F3B] hover:text-white uppercase tracking-wide transition-colors">
            Voltar ao site
          </Link>
        </div>
      </header>

      <div className="container py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold text-white">Dashboard</h1>
          <span className="text-[#bababa]">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Agendamentos Hoje" value={todayCount} subtitle={`${confirmedCount} confirmados`} icon="📅" />
          <MetricCard title="Faturamento Semanal" value="R$ 1.250,00" icon="💰" />
          <MetricCard title="Taxa Conclusão" value="87%" icon="✅" />
          <MetricCard title="Nota Média" value="4.8" icon="⭐" />
        </div>

        {/* Appointments section */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#272727]">
          <div className="p-6 border-b border-[#272727] flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white">Agendamentos de Hoje</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-[#272727] text-[#bababa] rounded text-sm hover:bg-[#333]">Filtrar</button>
              <button className="px-3 py-1.5 bg-[#732F3B] text-white rounded text-sm hover:bg-[#401021]">+ Novo</button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#272727]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#bababa] uppercase tracking-wider">Horário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#bababa] uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#bababa] uppercase tracking-wider">Barbeiro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#bababa] uppercase tracking-wider">Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#bababa] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#bababa] uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_APPOINTMENTS.map((apt) => (
                  <tr key={apt.id} className="border-b border-[#272727] hover:bg-[#272727]/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-white">{apt.time}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white">{apt.client}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[#bababa]">{apt.barber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[#bababa]">{apt.service}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[apt.status]}`}>
                        {apt.status === 'SCHEDULED' ? 'Agendado' : apt.status === 'CONFIRMED' ? 'Confirmado' : apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-[#732F3B] hover:text-white text-sm mr-3">Editar</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#272727] flex items-center justify-between">
            <span className="text-sm text-[#bababa]">Mostrando 1-5 de 12 agendamentos</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#272727] text-[#bababa] rounded text-sm hover:bg-[#333] disabled:opacity-50" disabled>← Anterior</button>
              <button className="px-3 py-1 bg-[#272727] text-[#bababa] rounded text-sm hover:bg-[#333]">Próximo →</button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/barbers" className="bg-[#272727] rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors">
            <span className="text-2xl mb-4 block">💇</span>
            <h3 className="font-heading text-lg font-bold text-white mb-2">Gerenciar Barbeiros</h3>
            <p className="text-sm text-[#bababa]">Ver agenda, performance e configurações</p>
          </Link>
          <Link href="/admin/clients" className="bg-[#272727] rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors">
            <span className="text-2xl mb-4 block">👥</span>
            <h3 className="font-heading text-lg font-bold text-white mb-2">Gerenciar Clientes</h3>
            <p className="text-sm text-[#bababa]">Lista de clientes e histórico</p>
          </Link>
          <Link href="/admin/settings" className="bg-[#272727] rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors">
            <span className="text-2xl mb-4 block">⚙️</span>
            <h3 className="font-heading text-lg font-bold text-white mb-2">Configurações</h3>
            <p className="text-sm text-[#bababa]">Horário de funcionamento e outros</p>
          </Link>
        </div>
      </div>
    </div>
  );
}