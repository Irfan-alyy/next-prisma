// src/app/dashboard/profile/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Type, User, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const { data: session, update } = useSession();
  const [role, setRole] = useState<string>("candidate");
  const [name,setName]=useState<string>(session?.user?.name || "")
  const router= useRouter()
  const handleUpdate = async () => {
    const type=role
    const response=await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name }),
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
    <div className="min-h-screen bg-gray-50 font-inter">
      <section className="py-16">
        <motion.div className="max-w-md mx-auto flex gap-3 flex-col px-4 bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl text-gray-700 font-bold ">Update Profile</h2>
          <div>
          <label htmlFor="name" className=" text-gray-700 text-sm">User Name:</label>
          <div className="relative">
            <User className="absolute top-2 left-3 h-5 w-5 text-gray-600" />
            <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
          </div>
          </div>
          <div>
          <label htmlFor="name" className="text-gray-700 text-sm">User Type:</label>
          <div className="relative">
            <UserCog className="absolute top-2 left-3 h-5 w-5 text-gray-600" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'candidate' | 'employer')}
              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
            >
              <option  value="candidate">Candidate</option>
              <option  value="employer">Employer</option>
            </select>
          </div>
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