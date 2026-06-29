import React, { useMemo } from 'react';
import { useFetch } from './hooks/useFetch';
import { motion } from 'framer-motion';

const Structure = () => {
  const { data: members = [], loading: membersLoading } = useFetch('members');
  const { data: departments = [], loading: deptsLoading } = useFetch('departments', 'name');

  const structureByDept = useMemo(() => {
    return departments.map(dept => {
      const deptMembers = members.filter(m => m.departmentId === dept.id);
      const ketua = deptMembers.find(m => m.position === 'Ketua');
      const wakil = deptMembers.find(m => m.position === 'Wakil');
      const staff = deptMembers.filter(m => m.position === 'Staff').sort((a, b) => a.name.localeCompare(b.name));
      
      return {
        ...dept,
        ketua,
        wakil,
        staff,
        hasMembers: deptMembers.length > 0,
      };
    }).filter(dept => dept.hasMembers);
  }, [members, departments]);

  const loading = membersLoading || deptsLoading;

  const MemberCard = ({ member, isLeader = false }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`text-center p-4 bg-white rounded-2xl shadow-md border border-gray-100 ${isLeader ? 'col-span-2 sm:col-span-1' : ''}`}
    >
      <img
        src={member.photoUrl || 'https://via.placeholder.com/150'}
        alt={member.name}
        className={`mx-auto rounded-full object-cover mb-4 border-4 ${isLeader ? 'w-24 h-24 border-emerald-200' : 'w-20 h-20 border-gray-100'}`}
      />
      <h3 className={`font-bold ${isLeader ? 'text-emerald-900' : 'text-sm text-gray-800'}`}>{member.name}</h3>
      {isLeader && <p className="text-sm text-emerald-600 font-semibold">{member.position}</p>}
      <p className="text-xs text-gray-500">{member.prodi}</p>
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

        <div className="space-y-20">
          {structureByDept.map(dept => (
            <div key={dept.id}>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-emerald-800">{dept.name}</h2>
                <p className="text-gray-500 mt-2">{dept.description}</p>
              </div>

              {/* Pimpinan Departemen */}
              {(dept.ketua || dept.wakil) && (
                <div className="mb-12">
                  <div className="flex justify-center gap-8 flex-wrap">
                    {dept.ketua && <MemberCard member={dept.ketua} isLeader={true} />}
                    {dept.wakil && <MemberCard member={dept.wakil} isLeader={true} />}
                  </div>
                </div>
              )}

              {/* Anggota Staff */}
              {dept.staff.length > 0 && (
                <div>
                  <h3 className="text-center text-xl font-semibold text-gray-700 mb-8 border-b pb-4">Anggota Staff</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {dept.staff.map(member => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
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
      <p className="text-xs text-gray-500">{member.prodi}</p>
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
                      <p className="text-xs text-gray-500">{member.prodi}</p>
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