'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
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
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  provId: string;
  munId: string;
}

// Assume postnotify returns similar structure
interface PostData {
  id: string;
  emergency: string; // Changed from postType to emergency for consistency
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  name: string;
  photoURL: string;
  munName: string;
  situation: string;
  verified: boolean;
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
  const [activeTab, setActiveTab] = useState<'emergency' | 'posts'>('emergency');
  const [emergencyData, setEmergencyData] = useState<EmergencyData[]>([]);
  const [postsData, setPostsData] = useState<PostData[]>([]);
    const [userData, setUserData] = useState<UserData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const router = useRouter();



  const fetchEmergencyData = async (munId:string, provId:string) => {
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
      setEmergencyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  

  const fetchPostsData = async (munId:string, provId:string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/getpostnotify?munId=${munId}&provId=${provId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      console.log(result.posts); // Debug: Log the response to check structure
      setPostsData(result.posts || []); // Adjust if key differs
    } catch (error) {
      console.error('Error fetching posts data:', error);
      setError('Failed to fetch posts data. Please try again later.');
      setPostsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

     const token = localStorage.getItem("authData");
    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      router.push("/weblogin");
      return;
    }

    const authData: AuthData = JSON.parse(token);
    setUserData(authData.user); // Set user data from authData
    
     
    if (activeTab === 'emergency') {
      fetchEmergencyData(authData.user.munId, authData.user.provId);
    } else if (activeTab === 'posts') {
    } else {
      fetchPostsData(authData.user.munId, authData.user.provId);
    }
  }, [activeTab, router]);

  // Emergency Bar Chart (Emergency Type Distribution)
  const emergencyCounts = emergencyData.reduce((acc, curr) => {
    acc[curr.emergency] = (acc[curr.emergency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emergencyBarChartData = {
    labels: Object.keys(emergencyCounts),
    datasets: [
      {
        label: 'Emergency Types',
        data: Object.values(emergencyCounts),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Emergency Type Distribution',
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Incidents' } },
      x: { title: { display: true, text: 'Emergency Type' } },
    },
  };

  // Emergency Pie Chart (Emergencies by Time Period)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const emergencyTodayCount = emergencyData.filter(
    (item) => new Date(item.createdAt) >= todayStart
  ).length;
  const emergencyLast7DaysCount = emergencyData.filter(
    (item) => new Date(item.createdAt) >= sevenDaysAgo && new Date(item.createdAt) < todayStart
  ).length;
  const emergencyLast30DaysCount = emergencyData.filter(
    (item) => new Date(item.createdAt) >= thirtyDaysAgo && new Date(item.createdAt) < sevenDaysAgo
  ).length;

  const emergencyPieChartData = {
    labels: ['Today', 'Last 7 Days', 'Last 30 Days'],
    datasets: [
      {
        label: 'Emergencies by Time Period',
        data: [emergencyTodayCount, emergencyLast7DaysCount, emergencyLast30DaysCount],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // Blue
          'rgba(34, 197, 94, 0.6)', // Green
          'rgba(249, 115, 22, 0.6)', // Orange
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Emergencies by Time Period',
        font: { size: 16 },
      },
    },
  };

  // Posts Bar Chart (Post Type Distribution)
  const postCounts = postsData.reduce((acc, curr) => {
    acc[curr.emergency] = (acc[curr.emergency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const postsBarChartData = {
    labels: Object.keys(postCounts),
    datasets: [
      {
        label: 'Post Types',
        data: Object.values(postCounts),
        backgroundColor: 'rgba(236, 72, 153, 0.6)', // Pink
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
      },
    ],
  };

  const postsBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Post Type Distribution',
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Posts' } },
      x: { title: { display: true, text: 'Post Type' } },
    },
  };

  const Logout = async () => {
    
    localStorage.removeItem('authData'); // Clear auth data
    router.push('/weblogin'); // Redirect to login page
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
        <Link href="/maps"><h2 className="text-xl font-bold mb-6 text-gray-800"> Back  </h2></Link>
                <Link href="/maps"><h2 className="text-xl font-bold mb-6 text-gray-800"> {userData?.wname}  </h2></Link>

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
            Posts Online
          </button>
            <button
            onClick={() => Logout()}
            className="p-2 rounded-lg w-full text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'emergency' ? 'Emergency Dashboard' : 'Posts Online Dashboard'}
          </h1>
          <Button
            onClick={
              activeTab === 'emergency'
                ? () => {
                    if (userData) fetchEmergencyData(userData.munId, userData.provId);
                  }
                : () => { if (userData) fetchPostsData(userData.munId, userData.provId); }
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
        </header>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar data={emergencyBarChartData} options={barChartOptions} />
                  </div>
                </CardContent>
              </Card>
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Emergencies by Time Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie data={emergencyPieChartData} options={pieChartOptions} />
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Emergency</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Barangay</TableHead>
                          <TableHead>Municipality</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead>Situation</TableHead>
                          <TableHead>Verified</TableHead>
                          <TableHead>Created At</TableHead>
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
                            <TableCell>{item.situation}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  item.verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.verified ? 'Yes' : 'No'}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        ) : postsData.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No posts data available.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Post Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar data={postsBarChartData} options={postsBarChartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Posts Online Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Barangay</TableHead>
                        <TableHead>Municipality</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Situation</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {postsData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>{item.emergency}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.barangay}</TableCell>
                          <TableCell>{item.munName}</TableCell>
                          <TableCell>{item.mobile}</TableCell>
                          <TableCell>{item.situation}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.verified ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;