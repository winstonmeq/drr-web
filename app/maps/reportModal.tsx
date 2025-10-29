// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface EmergencyData {
//   emergency: string;
//   lat: string;
//   long: string;
//   mobile: string;
//   barangay: string;
//   name: string;
//   photoURL: string;
//   status: boolean;
//   verified: boolean;
//   situation: string;
//   munName: string;
//   createdAt: string;
//   mobUserId: string;
//   munId: string;
//   provId: string;
// }

// interface UserData {
//   id: string;
//   email: string;
//   wname: string;
//   mobile: string;
//   mapCenter:string;
//   createdAt: string;
//   updatedAt: string;
//   munId: string;
//   provId: string;
// }

// interface AuthData {
//   token: string;
//   user: UserData;
// }

// interface ReportModalProps {
//   onClose: () => void;
// }

// const ReportModal: React.FC<ReportModalProps> = ({ onClose }) => {
//   const [data, setData] = useState<EmergencyData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
  
//   const [startDate, setStartDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;
//   const [totalPages, setTotalPages] = useState(1);
//   const [, setFilteredPatients] = useState<EmergencyData[] | null>(
//     null
//   );
//   const tableRef = useRef<HTMLDivElement>(null);
//   const modalRef = useRef<HTMLDivElement>(null);

//   // Handle clicking outside modal to close
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   const fetchEmergency = useCallback(async (munId:string, provId: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency?munId=${munId}&provId=${provId}`, {
//         cache: "no-store",
//       });
//       const result = await res.json();

//       console.log("API Response:", result.emergency_data);
//       setData(result.emergency_data);
//       setFilteredPatients(result.emergency_data);
//       setTotalPages(Math.ceil(result.emergency_data.length / rowsPerPage));
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//       setError("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {

//  const token = localStorage.getItem("authData");
//         if (!token) {
//             setError("No token found. Please log in.");          
//             return;
//         }

//         const authData: AuthData = JSON.parse(token);
//         setUserData(authData.user); // Set user data from authData

//     fetchEmergency(authData.user.munId, authData.user.provId);
//   }, [fetchEmergency]);

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//  const handleFilter = async (munId?: string, provId?: string, startDate?: Date, endDate?: Date) => {
//   setLoading(true);
//   setError(null); // Reset error state on new request
//   try {
//     // Format dates safely
//     const formattedStartDate = startDate && !isNaN(startDate.getTime())
//       ? startDate.toISOString().split("T")[0]
//       : undefined;
//     const formattedEndDate = endDate && !isNaN(endDate.getTime())
//       ? endDate.toISOString().split("T")[0]
//       : undefined;

//     // Build query parameters, omitting undefined values
//     const queryParams = new URLSearchParams();
//     if (munId) queryParams.append("munId", munId);
//     if (provId) queryParams.append("provId", provId);
//     if (formattedStartDate) queryParams.append("startDate", formattedStartDate);
//     if (formattedEndDate) queryParams.append("endDate", formattedEndDate);

//     const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"; // Fallback URL
//     const response = await fetch(
//       `${baseUrl}/api/emergency?${queryParams.toString()}`,
//       {
//         cache: "no-store",
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to fetch patients: ${response.status} ${errorText}`);
//     }

//     const result = await response.json();
//     setData(result.emergency_data);
//     setFilteredPatients(result.emergency_data);
//     setTotalPages(Math.ceil(result.totalRecords / rowsPerPage)); // Use totalRecords from backend

//     return result; // Optional: return result for further processing if needed
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Failed to load patients.";
//     console.error("Error fetching patients:", error);
//     setError(errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };

// const handleFilter2 = async () => {
//   if (userData?.munId && userData?.provId) {
//     await handleFilter(
//       userData.munId,
//       userData.provId,
//       new Date(startDate),
//       new Date(endDate)
//     );
//   } else {
//     setError("User data is missing municipality or province ID.");
//   }
// };


//   // Add this function to generate the narrative
// const generateNarrative = (data: EmergencyData[], startDate: string, endDate: string) => {
//   const totalEmergencies = data.length;
//   const emergencyTypes = [...new Set(data.map(item => item.emergency))];
//   const activeEmergencies = data.filter(item => item.status).length;
//   const inactiveEmergencies = totalEmergencies - activeEmergencies;
//   const barangays = [...new Set(data.map(item => item.barangay))];

//   const narrative = `
//     <h2>Emergency Incident Report Summary</h2>
//     <p>This report covers emergency incidents reported in the Municipality of President Roxas from <strong>${startDate}</strong> to <strong>${endDate}</strong>.</p>
//     <p><strong>Total Incidents:</strong> ${totalEmergencies}</p>
//     <p><strong>Emergency Types:</strong> ${emergencyTypes.join(", ")}</p>
//     <p><strong>Active Incidents:</strong> ${activeEmergencies} (${((activeEmergencies / totalEmergencies) * 100).toFixed(1)}%)</p>
//     <p><strong>Inactive Incidents:</strong> ${inactiveEmergencies} (${((inactiveEmergencies / totalEmergencies) * 100).toFixed(1)}%)</p>
//     <p><strong>Affected Barangays:</strong> ${barangays.join(", ")}</p>
//     <p>The following table provides detailed information on each reported incident, including the type of emergency, the name of the reporting individual, location details, date, status, and contact information.</p>
//   `;
  
//   return narrative;
// };

//   const handlePrint = () => {
//     const printContent = document.createElement("div");
//     printContent.innerHTML = `
//      <html>
//       <head>
//         <title>Emergency Incident Report</title>
//         <style>
//           @page { size: A4; margin: 10mm; }
//           body { font-family: Arial, sans-serif; text-align: left; width: 800px; margin: auto; }
//           h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
//           h2 { font-size: 16px; text-align: center; margin-bottom: 10px; }
//           p { font-size: 12px; margin-bottom: 10px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 15px; }
//           th, td { border: 1px solid black; padding: 8px; text-align: left; font-size: 12px; }
//           th { background-color: #f2f2f2; }
//         </style>
//       </head>
//       <body>
//         <h1>MDRRMO</h1>
//         <h2>Incidents Report for ${startDate} to ${endDate}</h2>
//         ${generateNarrative(paginatedData, startDate, endDate)}
//         ${tableRef.current?.innerHTML}
//       </body>
//     </html>
//     `;

//     const printWindow = document.createElement("iframe");
//     printWindow.style.position = "absolute";
//     printWindow.style.width = "0px";
//     printWindow.style.height = "0px";
//     printWindow.style.border = "none";
//     document.body.appendChild(printWindow);

//     const doc =
//       printWindow.contentDocument || printWindow.contentWindow?.document;
//     if (doc) {
//       doc.open();
//       doc.write(printContent.innerHTML);
//       doc.close();
//       printWindow.contentWindow?.focus();
//       printWindow.contentWindow?.print();
//       document.body.removeChild(printWindow);
//     }
//   };

//   if (loading)
//     return (
//       <div
//         className="fixed inset-0 flex items-center justify-center z-50"
//         style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}
//       >
//         <p>Loading...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div
//         className="fixed inset-0 flex items-center justify-center z-50"
//         style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}
//       >
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );

//   // Calculate pagination
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}
//     >
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-xl w-7xl p-2 overflow-y-auto"
//       >
//         <Card className="w-full border-gray-600 h-1/2">
//           <CardHeader className="relative">
//             <CardTitle className="text-center text-xl font-semibold">
//               Report Pages
//             </CardTitle>
//             <button
//               onClick={onClose}
//               className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//             >
//               Close
//             </button>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-4 mb-4 flex-wrap">
//               <div>
//                 <Label>Start Date</Label>
//                 <Input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>End Date</Label>
//                 <Input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//               </div>
//               <div className="flex gap-4 mt-4">
//                 <Button onClick={handleFilter2}>Filter</Button>
//                 <Button onClick={handlePrint}>Print</Button>
//               </div>
//             </div>
//             <div ref={tableRef}>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>#</TableHead>
//                     <TableHead>Emergency</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Address</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Mobile</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {paginatedData.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{startIndex + index + 1}</TableCell>
//                       <TableCell>{item.emergency}</TableCell>
//                       <TableCell>{item.name}</TableCell>
//                       <TableCell>{item.barangay}</TableCell>
//                       <TableCell>
//                         {new Date(item.createdAt).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>{item.status ? "Active" : "Inactive"}</TableCell>
//                       <TableCell>{item.mobile}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex justify-center mt-4 space-x-4">
//               <Button
//                 disabled={currentPage === 1}
//                 onClick={() => handlePageChange(currentPage - 1)}
//               >
//                 Previous
//               </Button>
//               <span>
//                 Page {currentPage} of {totalPages}
//               </span>
//               <Button
//                 disabled={currentPage === totalPages}
//                 onClick={() => handlePageChange(currentPage + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ReportModal;