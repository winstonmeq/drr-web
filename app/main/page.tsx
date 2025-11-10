'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AlertModal from './alertModal';
import ReportsSection from './reportModal';
import PostOnline  from './postOnline';
import EmergencyList from './emergencyData';



interface UserData {
  id: string;
  email: string;
  wname: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
  munId: string;
  provId: string;
}

interface AuthData {
  token: string;
  user: UserData;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'posts' | 'reports'>('emergency');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

     useEffect(() => {
          const token = typeof window !== 'undefined' ? localStorage.getItem("authData") : null;
          if (!token) {
              setError("No token found. Please log in.");
              router.push("/weblogin");
              return;
          }
  
          const authData: AuthData = JSON.parse(token);
          setUserData(authData.user);
          setIsLoading(false);
        
      }, []);
 

  const Logout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('authData');
      router.push('/weblogin');
    }
  };



  const tabTitles: Record<string, string> = {
  emergency: 'Control Room',
  reports: 'Report Dashboard',
  posts: 'Posts Manager',
};


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
        <Link href={userData ? `/maps?munId=${userData.munId}&provId=${userData.provId}` : '/weblogin'}>
          <h2 className="text-xl font-bold mb-6 text-gray-800">Back</h2>
        </Link>
        <h2 className="text-xl font-bold mb-6 text-gray-800">{userData?.wname}</h2>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('emergency')}
            className={`block p-2 rounded-lg w-full text-left ${
              activeTab === 'emergency' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Emergency
          </button>

            <button
            onClick={() => setActiveTab('posts')}
            className={`block p-2 rounded-lg w-full text-left ${
              activeTab === 'posts' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Online Posts
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`block p-2 rounded-lg w-full text-left ${
              activeTab === 'reports' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Reports
          </button>
          <button onClick={() => Logout()} className="p-2 rounded-lg w-full text-left hover:bg-gray-100">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {tabTitles[activeTab] || 'Dashboard'}
            </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAlertModal(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Alert
            </Button>
        
          </div>
        </header>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6 flex items-center justify-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </CardContent>
          </Card>
        ) : activeTab === 'emergency' ? (
         
              
           <EmergencyList />
          
        ) : activeTab === 'reports' ? (
          <div>
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Print Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <ReportsSection />
                )}
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'posts' ? (
          <div>
            <PostOnline />

          </div>
        ) : null }
      </div>

      {/* Modals */}
      {showAlertModal && userData && (
        <AlertModal
          onClose={() => setShowAlertModal(false)}
          lat="0.0"
          lng="0.0"
          mobile={userData.mobile}
          webUserId={userData.id}
          munId={userData.munId}
          provId={userData.provId}
          munName={userData.wname}
        />
      )}
     
     
    </div>
  );
};

export default Dashboard;