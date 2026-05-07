import React from 'react';
import { useFetch } from './hooks/useFetch';
import { motion } from 'framer-motion';

const Structure = () => {
  const { data: departments, loading: loadDept } = useFetch('departments');
  const { data: members, loading: loadMemb } = useFetch('members');

  if (loadDept || loadMemb) return <div className="h-screen flex items-center justify-center text-emerald-900 font-bold">Memuat Struktur...</div>;

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">Struktur Pengurus</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">Dedikasi Mahasiswa Magetan untuk Almamater dan Daerah.</p>
        </div>

        {departments.map((dept) => {
          const deptMembers = members.filter(m => m.departmentId === dept.id);
          if (deptMembers.length === 0) return null;

          return (
            <div key={dept.id} className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 flex-1 bg-emerald-200 rounded-full"></div>
                <h2 className="text-2xl font-bold text-emerald-800 uppercase tracking-widest">{dept.name}</h2>
                <div className="h-1 flex-1 bg-emerald-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {deptMembers.map((member) => (
                  <motion.div 
                    key={member.id}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-emerald-50 group transition-all"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={member.profilePhotoUrl || 'https://via.placeholder.com/400x500'} 
                        alt={member.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white text-xs italic">{member.socialMedia || '@imama_unesa'}</p>
                      </div>
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-lg font-bold text-emerald-900 truncate">{member.name}</h3>
                      <p className="text-emerald-600 font-semibold text-sm mb-2">{member.position}</p>
                      <div className="flex justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase">
                        <span>{member.studyProgram}</span>
                        <span>•</span>
                        <span>Angkatan {member.batch}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Structure;