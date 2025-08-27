// src/app/dashboard/profile/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const { data: session, update } = useSession();
  const [role, setRole] = useState("candidate");
  const router= useRouter()
  const handleUpdate = async () => {
    const type=role
    const response=await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (response.ok) {
      const updatedUser = await response.json();
      await update({
        ...session,
        user: {
          ...session?.user,
          type: updatedUser.type,
        }
      });
      router.push("/dashboard");
      return
    }
    console.error(response)
  };

  return (
    <div className="text-black min-h-screen bg-gray-50 font-inter">
      <section className="py-16">
        <motion.div className="max-w-md mx-auto px-4 bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
          <div className="relative">
            <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'candidate' | 'employer')}
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <button onClick={handleUpdate} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md">
            Save
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default ProfilePage;