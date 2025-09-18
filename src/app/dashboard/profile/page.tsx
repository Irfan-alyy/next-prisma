// src/app/dashboard/profile/page.tsx
'use client';

import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  const { data: session, update } = useSession();
  const [role, setRole] = useState<string>(session?.user?.type as string || "");
  const [name, setName] = useState<string>(session?.user?.name || "")
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [removed, setRemoved] = useState(false)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setRemoved(true)
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdate = async () => {
    setIsUploading(true)
    try {
      const type = role
      const formData = new FormData();
      formData.append("type", type)
      if (name.trim()) formData.append("name", name)
      if (imageFile) formData.append("image", imageFile)
      if (!imageFile && removed) formData.append("removed", "true")

      const response = await fetch('/api/user', {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        const updatedUser = await response.json();
        await update({
          ...session,
          user: {
            ...session?.user,
            type: updatedUser.type,
            image: updatedUser.image
          }
        });
        setIsUploading(false)
        router.push("/dashboard");
        return
      }
    } catch (error) {
      console.error(error)
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <section className="py-16">
        <motion.div className="max-w-md mx-auto flex gap-3 flex-col px-4 bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl text-gray-700 font-bold ">Update Profile</h2>

          {/* Profile Image Section */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="flex items-center justify-between pr-10 space-x-4">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Choose Image
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Max 5MB, JPG/PNG
                </p>
              </div>
              <div className="relative">
                {previewUrl ? (
                  <Image
                  width={80}
                  height={80}
                    src={previewUrl}
                    alt="Selected Image"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  !removed && !!session?.user?.image ? (
                    <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                      <Image
                        src={session?.user?.image}
                        alt="Profile Picture"
                        width={80}
                        height={80}
                        priority={true}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-2xl"><User /></span>
                    </div>

                  )
                )}

                {!!(previewUrl || session?.user?.image && !removed) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

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
                { session?.user?.type==="employer" &&
                (
                  <>
                  <option value="employer">Employer</option>
                  <option value="candidate">Candidate</option>
                  </>
                ) 
                } 
                {session?.user?.type==="candidate" &&
                <>
                <option value="candidate" selected>Candidate</option>
                <option value="employer">Employer</option>
                
                </>
                }
              </select>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            disabled={isUploading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUploading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              } transition-colors`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default ProfilePage;