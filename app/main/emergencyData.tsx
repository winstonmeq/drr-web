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
import { Loader2, AlertCircle, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FindLocation from './findLocation';
import PostModal from './postModal';
import FindAdress from './findAddress';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EmergencyItem {
  id: string;
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  name: string;
  photoURL: string;
  munName: string;
  status: string;
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

const EmergencyList: React.FC = () => {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [emergencyData, setEmergencyData] = useState<EmergencyItem[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
 const [selectedEmergency, setSelectedEmergency] = useState<EmergencyItem | null>(null);
 const [selectedPostData, setSelectedPostData] = useState<EmergencyItem | null>(null);
 const [showPostModal, setShowPostModal] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState<{ status: string; verified: string; barangay: string }>({
    status: 'false',
    verified: 'unverified',
    barangay: '',
  });

  const router = useRouter();

  const fetchEmergencyData = async (munId: string, provId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency?munId=${munId}&provId=${provId}`,
        { cache: 'no-store' }
      );
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

  const updateEmergency = async (id: string, status: string, verified: string, barangay: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, verified, barangay}),
      });

      console.log('Update response status:', res.status);
      if (!res.ok) throw new Error(`HTTP error! status`);

      const updatedData = await res.json();

      console.log('Updated emergency data:', updatedData);

      setEmergencyData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updatedData.status.toString(),
                verified: updatedData.verified ? 'verified' : 'unverified',
                barangay: updatedData.barangay || barangay, // fallback to sent value
              }
            : item
        )
      );

      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating emergency:', error);
      setError('Failed to update emergency. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authData');
    if (!token) {
      setError('No token found. Please log in.');
      setIsLoading(false);
      router.push('/weblogin');
      return;
    }

    const authData: AuthData = JSON.parse(token);
    setUserData(authData.user);
    fetchEmergencyData(authData.user.munId, authData.user.provId);
  }, []);

  // useEffect(() => {
  //   if (!userData?.munId || !userData?.provId) return;

  //   const intervalId = setInterval(() => {
  //     console.log('Refreshing emergency data at:', new Date().toLocaleTimeString());
  //     fetchEmergencyData(userData.munId, userData.provId);
  //   }, 60000);

  //   return () => clearInterval(intervalId);
  // }, [userData?.munId, userData?.provId]);

  const handleOpenUpdateModal = (item: EmergencyItem) => {
    setSelectedEmergency(item);
    setUpdateForm({
      status: item.status,
      verified: item.verified,
      barangay: item.barangay,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = () => {
    if (selectedEmergency) {
      updateEmergency(selectedEmergency.id, updateForm.status, updateForm.verified, updateForm.barangay);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
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
        ) : emergencyData.length === 0 ? (
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
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
               <TableBody>
  {emergencyData.map((item) => (
    <TableRow
      key={item.id}
      className={`hover:bg-gray-50 transition-colors`}
    >
      <TableCell>
  {(() => {
    switch (item.emergency.toLowerCase()) {
      case "fire":
        return <Badge className="bg-red-600 text-white">FIRE</Badge>;
      case "ambulance":
        return <Badge className="bg-blue-600 text-white">Ambulance</Badge>;
      case "flood":
        return <Badge className="bg-teal-600 text-white">Flood</Badge>;
      case "landslide":
        return <Badge className="bg-orange-500 text-white">Landslide</Badge>;
      case "police":
        return <Badge className="bg-indigo-600 text-white">Police</Badge>;
      case "road_accident":
        return <Badge className="bg-yellow-500 text-black">Road Accident</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{item.emergency}</Badge>;
    }
  })()}
</TableCell>

      <TableCell>{item.name}</TableCell>

      <TableCell>
        {/* {item.barangay == "" ? (
          <FindLocation lat={item.lat} long={item.long} />
        ) : (
          item.barangay
        )} */}

        {item.barangay === "" ? (
            <FindLocation
              lat={item.lat}
              long={item.long}
              onFound={(found) => {
                console.log("Auto Barangay Found:", found);

                // prevent infinite update loop
                if (!item.barangay && found !== "Unknown location") {
                  updateEmergency(
                    item.id,
                    item.status,
                    item.verified,
                    found
                  );
                }
              }}
            />
          ) : (
            item.barangay
          )}
          
      </TableCell>

      <TableCell>{item.munName}</TableCell>
      <TableCell>{item.mobile}</TableCell>

     <TableCell>
  {item.verified === "verified" ? (
    <Badge className="bg-blue-600 text-white">Verified</Badge>
  ) : (
    <Badge className="bg-orange-500 text-white">Unverified</Badge>
  )}
</TableCell>

{/* STATUS BADGE */}
<TableCell>
  {item.status === "confirmed" ? (
    <Badge className="bg-red-600 text-white">Confirmed</Badge>
  ) : (
    <Badge className="bg-gray-500 text-white">Unconfirmed</Badge>
  )}
</TableCell>

      <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>

      <TableCell className="flex gap-2">

        {/* <Button
          className="w-full sm:w-auto hover:bg-gray-600 transition-colors duration-200 cursor-pointer text-xs sm:text-sm"
          onClick={() => {
            setSelectedPostData(item)
            setShowPostModal(true)
          }}
        >
          View
        </Button>

        <Button
          className="hover:bg-blue-600 transition-colors text-xs sm:text-sm"
          onClick={() => handleOpenUpdateModal(item)}
        >
          Edit
        </Button> */}

        <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                                    <DropdownMenuItem>
                                                    <Button variant={"ghost"} 
                                                     onClick={() => {
                                                        setSelectedPostData(item)
                                                        setShowPostModal(true)
                                                      }}
                                                    >
                                                        Publish
                                                    </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>  <Button variant={"ghost"} 
                                                     onClick={() => {
                                                       handleOpenUpdateModal(item)
                                                      }}
                                                    >
                                                        Edit
                                                    </Button></DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Button variant={"ghost"} 
                                                     onClick={() => {
                                                        
                                                      }}
                                                    >
                                                        Delete
                                                    </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
          </DropdownMenu>

      </TableCell>


    </TableRow>
  ))}
</TableBody>

                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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
      {showUpdateModal && selectedEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle>Update Emergency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">Barangay</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={updateForm.barangay}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, barangay: e.target.value })
              }
              placeholder="Enter or correct barangay"
            />

            <div className="text-xs text-gray-500">
      <FindAdress
        lat={selectedEmergency?.lat || ''}
        long={selectedEmergency?.long || ''}
        onLocationFound={(barangay) => {
          if (barangay && barangay !== 'Error' && barangay !== 'Loading...') {
            setUpdateForm(prev => ({ ...prev, barangay }));
          }
        }}
      />
    </div>
          
          </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={updateForm.status}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, status: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Change status
                    </option>
                    <option value="confirmed">confirmed</option>
                    <option value="unconfirmed">unconfirmed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateSubmit} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmergencyList;
