import React, { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import SideBar from './SideBar.jsx';
import TicketModal from './TicketModal';
import Home from './Home';
import AdminPanel from './AdminPanel';
import Help from './Help.jsx';
import ResolutionModal from './ResolutionModal';
import KnowledgeBase from './KnowledgeBase.jsx'
import UserManagement from './UserManagement';
import TicketHistory from './TicketHistory';
import AdminHome from './AdminHome';

const Dashboard = ({ onLogout,user }) => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [users, setUsers] = useState([]);
  
  // New state to track which ticket's resolution is being viewed
  const [viewingResolutionTicket, setViewingResolutionTicket] = useState(null);

  const menuRef = useRef({});

  const adminStats = {
    pendingEscalations: tickets.filter(t => t.status === 'Escalated').length,
    totalIssuesRaised: tickets.length,
    // You can calculate more here, like average resolution or system load
    avgResolveTime: "4.2m", 
    systemLoad: "24%"
  };

  const userStats = {
    activeTickets: tickets.filter(t => t.status?.toLowerCase() !== 'closed').length,
    aiResolutionRate: "94%", // Static or calculated based on your logic
    avgResponse: "< 1m",
    systemUptime: "99.9%"
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) { console.error('Error fetching users:', error); }
  };

  useEffect(() => {
    if (user?.role === 'admin' && activeTab === 'users') fetchUsers();
  }, [activeTab]);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
  if (!user?.id) return; 
  try {
    const url = user.role === 'admin' 
      ? `http://localhost:5000/api/tickets` 
      : `http://localhost:5000/api/tickets/user/${user.id}`;
    const res = await fetch(url);
    const data = await res.json();
    setTickets(data);
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
};

  /* ---------------- CLICK OUTSIDE DROPDOWN ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openMenuId &&
        menuRef.current[openMenuId] &&
        !menuRef.current[openMenuId].contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  /* ---------------- ACTIONS ---------------- */
  const openNewTicket = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  const openExistingTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${id}/close`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setOpenMenuId(null);
        await fetchTickets();
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  const escalateTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${id}/escalate`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setOpenMenuId(null);
        await fetchTickets();
      }
    } catch (error) {
      console.error('Error escalating ticket:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: 'DELETE',
      });
      fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  /* ---------------- COMPUTED ---------------- */
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const normalizedStatus = ticket.status?.toLowerCase().replace(/\s/g, '');
    const matchesFilter = filterStatus === 'all' || normalizedStatus?.includes(filterStatus);
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('closed') || s.includes('resolved'))
      return { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle2 };
    if (s.includes('escalate'))
      return { color: 'text-amber-600', bg: 'bg-amber-100', icon: AlertCircle };
    if (s.includes('progress'))
      return { color: 'text-blue-800', bg: 'bg-blue-100', icon: Clock };
    return { color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp };
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout } user={user} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'home' ? (
          user?.role === 'admin' ? (
          <AdminHome username={user?.name} stats={adminStats}/> 
        ) : (
      <Home 
        username={user?.name || "Support User"} 
        onStartTicket={openNewTicket} 
        user={user}
        stats={userStats}
      /> 
    )
  ): activeTab === 'admin' ? (
          <AdminPanel tickets={tickets} onRefresh={fetchTickets} />
        ) : activeTab === 'users' ? (
          <UserManagement users={users} onRefresh={fetchUsers} />
        ) : activeTab === 'history' ? (
          <TicketHistory tickets={tickets} />
        ) : activeTab === 'help' ? ( 
          <div className="overflow-y-auto h-full">
            <Help user={user} onOpenTicket={openNewTicket}/> 
          </div>
        ) : activeTab === 'kb' ? ( 
         <KnowledgeBase onOpenTicket={() => setActiveTab('dashboard')} />
        ): activeTab === 'dashboard' ? (
          <>
            {/* HEADER */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-10 py-6 flex justify-between items-center shrink-0">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Ticket Management</h1>
                <p className="text-sm text-slate-500 mt-1">Monitor and manage support requests</p>
              </div>
              <button
                onClick={openNewTicket}
                className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition-all"
              >
                <Plus size={18} /> New Ticket
              </button>
            </div>

            
            <div className="bg-white/60 backdrop-blur-sm px-10 py-4 border-b border-slate-200/60 flex gap-3 shrink-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
                {['all', 'open', 'escalated', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === status ? 'bg-blue-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 p-10 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-visible">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-6 text-xs font-bold text-slate-600 text-left">Ticket Number</th>
                      <th className="p-6 text-xs font-bold text-slate-600 text-left">Issue</th>
                      <th className="p-6 text-xs font-bold text-slate-600 text-left">Category</th>
                      <th className="p-6 text-xs font-bold text-slate-600 text-left">Status</th>
                      <th className="p-6 text-xs font-bold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTickets.map((ticket) => {
                      const statusConfig = getStatusConfig(ticket.status);
                      const StatusIcon = statusConfig.icon;
                      const isClosed = ticket.status?.toLowerCase() === 'closed';

                      return (
                        <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-6">
                            <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded">
                              #{ticket._id?.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="p-6">
                            <div>
                              <div className="font-bold text-slate-900">{ticket.title}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                                {ticket.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-600">
                              {ticket.category || 'Hardware'}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
                              <StatusIcon size={14} className={statusConfig.color} />
                              <span className={`text-xs font-bold ${statusConfig.color}`}>
                                {isClosed ? 'Resolved' : ticket.status}
                              </span>
                            </div>
                          </td>
                          <td className="p-6 text-right relative overflow-visible">
                            <div className="flex justify-end gap-2">
                              {isClosed ? (
                                <button
                                  onClick={() => setViewingResolutionTicket(ticket)}
                                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                >
                                  <CheckCircle2 size={16} /> View Resolution
                                </button>
                              ) : (
                                <button
                                  onClick={() => openExistingTicket(ticket)}
                                  className="px-4 py-2 text-sm font-bold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors"
                                >
                                  Resume
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleDelete(ticket._id)} 
                                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                              
                              <button
                                onClick={() => setOpenMenuId(openMenuId === ticket._id ? null : ticket._id)}
                                className={`p-2 rounded-lg transition-all ${openMenuId === ticket._id ? 'bg-slate-100 text-blue-800' : 'text-slate-500 hover:bg-slate-100'}`}
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>

                            
                            {openMenuId === ticket._id && (
                              <div
                                ref={(el) => (menuRef.current[ticket._id] = el)}
                                className="absolute right-6 top-16 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 z-[100] animate-in fade-in zoom-in duration-200"
                              >
                                {!isClosed && (
                                  <>
                                    <button
                                      onClick={() => closeTicket(ticket._id)}
                                      className="w-full px-5 py-3 text-left text-sm hover:bg-slate-50 flex items-center gap-3 font-medium text-slate-700 first:rounded-t-xl"
                                    >
                                      <CheckCircle2 size={16} className="text-emerald-500" /> Close Ticket
                                    </button>
                                    <button
                                      onClick={() => escalateTicket(ticket._id)}
                                      className="w-full px-5 py-3 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-3 font-medium border-t border-slate-100 last:rounded-b-xl"
                                    >
                                      <AlertCircle size={16} className="text-amber-500" /> Escalate to Human
                                    </button>
                                  </>
                                )}
                                {isClosed && (
                                  <div className="px-5 py-3 text-xs text-slate-400 italic">No further actions available</div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredTickets.length === 0 && (
                  <div className="py-20 text-center text-slate-400 font-medium">No tickets matching your search.</div>
                )}
              </div>
              
            </div>
          </>
        ) : (
          <div className="p-10 text-slate-500">Knowledge Base Content Coming Soon</div>
        )}
      </main>

      
      <TicketModal
        isOpen={isModalOpen}
        ticket={selectedTicket}
        user={user}
        onClose={() => {
          setIsModalOpen(false);
          fetchTickets();
        }}
        onTicketUpdated={fetchTickets}
      />

      <ResolutionModal 
        isOpen={!!viewingResolutionTicket}
        ticket={viewingResolutionTicket}
        onClose={() => setViewingResolutionTicket(null)}
      />
    </div>
  );
};

export default Dashboard;