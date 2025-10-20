'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import AlertModal from './alertModal';
import PostModal from './postModal';
import ReportsSection from './reportModal';

interface EmergencyData {
  id: string;
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  name: string;
  photoURL: string;
  munName: string;
  situation: string;
  verified: string;
  createdAt: string;
  updatedAt: string;
  provId: string;
  munId: string;
}

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
  const [activeTab, setActiveTab] = useState<'emergency' | 'alerts' | 'reports'>('emergency');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [emergencyData, setEmergencyData] = useState<EmergencyData[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const [selectedPostData, setSelectedPostData] = useState<EmergencyData | null>(null);


  const router = useRouter();

  // Fetch emergency data
  const fetchEmergencyData = async (munId: string, provId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency?munId=${munId}&provId=${provId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      setEmergencyData(result.emergency_data || []);
    } catch (error) {
      console.error('Error fetching emergency data:', error);
      setError('Failed to fetch emergency data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  
  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem("authData");
    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      router.push("/weblogin");
      return;
    }

    const authData: AuthData = JSON.parse(token);
    setUserData(authData.user);

    if (activeTab === 'emergency') {
      fetchEmergencyData(authData.user.munId, authData.user.provId);
    }
  }, [activeTab]);

  const Logout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('authData');
      router.push('/weblogin');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
        <Link href="/maps"><h2 className="text-xl font-bold mb-6 text-gray-800">Back</h2></Link>
        <h2 className="text-xl font-bold mb-6 text-gray-800">{userData?.wname}</h2>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('emergency')}
            className={`block p-2 rounded-lg w-full text-left ${activeTab === 'emergency' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'}`}
          >
            Emergency
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`block p-2 rounded-lg w-full text-left ${activeTab === 'reports' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'}`}
          >
            Reports
          </button>

          <button
            onClick={() => Logout()}
            className="p-2 rounded-lg w-full text-left hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'emergency' ? 'Control Room' : 'Report Dashboard'}
          </h1>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAlertModal(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> New Alert
            </Button>

          
            <Button
              onClick={
                userData
                  ? () => fetchEmergencyData(userData.munId, userData.provId)
                  : undefined
              }
              disabled={isLoading}
              className="flex items-center gap-2"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
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
          emergencyData.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No emergency data available.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Emergency Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Emergency</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Municipality</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emergencyData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>{item.emergency}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.barangay}</TableCell>
                          <TableCell>{item.munName}</TableCell>
                          <TableCell>{item.mobile}</TableCell>
                          <TableCell>
                            {item.verified ? (
                              <span className="text-green-600 font-medium">Verified</span>
                            ) : (
                              <span className="text-red-500 font-medium">Unverified</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                          <TableCell>
<Button
  className="w-full sm:w-auto hover:bg-gray-600 transition-colors duration-200 cursor-pointer text-xs sm:text-sm"
  onClick={() => {
    setSelectedPostData(item);
    setShowPostModal(true);
  }}
>
  Posts
</Button>
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
           <div>
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Incident Reports</CardTitle>
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
        )}
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
      {showPostModal && selectedPostData && userData && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          data={selectedPostData}
          webUserId={userData.id}
          selectedLocation={{
            lat: selectedPostData.lat,
            long: selectedPostData.long,
          }}
        />
      )}

    </div>
  );
};

export default Dashboard;
