import React, { useMemo } from 'react';
import { useFetch } from './hooks/useFetch';
import { motion } from 'framer-motion';
import { UserCircle2 } from 'lucide-react';

const Structure = () => {
  const { data: members = [], loading: membersLoading } = useFetch('members');
  const { data: departments = [], loading: deptsLoading } = useFetch('departments', 'name');

  const { ketua, wakil, staffByDept } = useMemo(() => {
    const ketua = members.find(m => m.position === 'Ketua');
    const wakil = members.find(m => m.position === 'Wakil');
    const staff = members.filter(m => m.position === 'Staff');

    const staffByDept = departments.map(dept => ({
      ...dept,
      members: staff.filter(s => s.departmentId === dept.id).sort((a, b) => a.name.localeCompare(b.name)),
    })).filter(dept => dept.members.length > 0);

    return { ketua, wakil, staffByDept };
  }, [members, departments]);

  const loading = membersLoading || deptsLoading;

  const MemberCard = ({ member }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="text-center p-4 bg-white rounded-2xl shadow-md border border-gray-100"
    >
      <img
        src={member.photoUrl || 'https://via.placeholder.com/150'}
        alt={member.name}
        className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-emerald-100"
      />
      <h3 className="font-bold text-emerald-900">{member.name}</h3>
      <p className="text-sm text-emerald-600 font-semibold">{member.position}</p>
    </motion.div>
  );

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center">Memuat Struktur Organisasi...</div>;
  }

  return (
    <section id="structure" className="py-20 bg-gray-50 pt-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 tracking-tight">Struktur Kepengurusan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Mengenal lebih dekat tim yang berada di balik layar IMAMA UNESA.</p>
        </div>

        {/* Ketua dan Wakil */}
        {(ketua || wakil) && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center text-emerald-800 mb-8">Pimpinan Organisasi</h2>
            <div className="flex justify-center gap-8 flex-wrap">
              {ketua && <MemberCard member={ketua} />}
              {wakil && <MemberCard member={wakil} />}
            </div>
          </div>
        )}

        {/* Staff per Departemen */}
        <div className="space-y-16">
          {staffByDept.map(dept => (
            <div key={dept.id}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-emerald-800">{dept.name}</h2>
                <p className="text-gray-500">{dept.description}</p>
              </div>
              {dept.members.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {dept.members.map(member => (
                    <motion.div
                      key={member.id}
                      whileHover={{ y: -5 }}
                      className="text-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                      <img
                        src={member.photoUrl || 'https://via.placeholder.com/100'}
                        alt={member.name}
                        className="w-20 h-20 mx-auto rounded-full object-cover mb-3 border-2 border-gray-100"
                      />
                      <h4 className="font-semibold text-sm text-gray-800">{member.name}</h4>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 italic">Belum ada anggota di departemen ini.</p>
              )}
            </div>
          ))}
        </div>

        {members.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-400 italic">Struktur kepengurusan belum dipublikasikan.</div>
        )}
      </div>
    </section>
  );
};

export default Structure;