import React from 'react';
import { User, Shield, Mail } from 'lucide-react';

const UserManagement = ({ users }) => (
  <div className="p-10 flex-1 overflow-y-auto">
    <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
    <div className="grid gap-4">
      {users.map(u => (
        <div key={u._id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-slate-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{u.name}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
            {u.role}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default UserManagement;