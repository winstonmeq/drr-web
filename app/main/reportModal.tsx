"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmergencyData {
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  name: string;
  status: boolean;
  verified: boolean;
  situation: string;
  munName: string;
  createdAt: string;
  mobUserId: string;
  munId: string;
  provId: string;
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

const ReportsSection: React.FC = () => {
  const [data, setData] = useState<EmergencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const tableRef = useRef<HTMLDivElement>(null);

  const fetchEmergency = useCallback(async (munId: string, provId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency?munId=${munId}&provId=${provId}`, {
        cache: "no-store",
      });
      const result = await res.json();
      setData(result.emergency_data || []);
      setTotalPages(Math.ceil((result.emergency_data?.length || 0) / rowsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authData");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const authData: AuthData = JSON.parse(token);
    setUserData(authData.user);
    fetchEmergency(authData.user.munId, authData.user.provId);
  }, [fetchEmergency]);

  const handleFilter = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency?munId=${userData.munId}&provId=${userData.provId}&startDate=${startDate}&endDate=${endDate}`,
        { cache: "no-store" }
      );
      const result = await res.json();
      setData(result.emergency_data || []);
      setTotalPages(Math.ceil((result.emergency_data?.length || 0) / rowsPerPage));
    } catch (error) {
      setError(`Failed to filter data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Emergency Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Incident Reports</h2>
          <p>From ${startDate} to ${endDate}</p>
          ${tableRef.current?.innerHTML || ""}
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  if (loading)
    return <div className="flex justify-center py-10">Loading...</div>;

  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <Label>Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <Button onClick={handleFilter}>Filter</Button>
        <Button onClick={handlePrint}>Print</Button>
      </div>

      <div ref={tableRef} className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Emergency</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mobile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{item.emergency}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.barangay}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{item.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>{item.mobile}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4 gap-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ReportsSection;
