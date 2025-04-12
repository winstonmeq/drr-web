"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  purok: string;
  barangay: string;
  name: string;
  position: string;
  photoURL: string;
  status: boolean;
  verified: boolean;
  situation: string;
  munName: string;
  createdAt: string;
  munId: string;
  provId: string;
}

interface ReportModalProps {
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose }) => {
  const [data, setData] = useState<EmergencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [, setFilteredPatients] = useState<EmergencyData[] | null>(
    null
  );
  const tableRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const fetchEmergency = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://qalert.uniall.tk/api/emergency", {
        cache: "no-store",
      });
      const result = await res.json();

      console.log("API Response:", result.emergency_data);
      setData(result.emergency_data);
      setFilteredPatients(result.emergency_data);
      setTotalPages(Math.ceil(result.emergency_data.length / rowsPerPage));
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmergency();
  }, [fetchEmergency]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate
        ? startDate.toString().split("T")[0]
        : undefined;
      const formattedEndDate = endDate
        ? endDate.toString().split("T")[0]
        : undefined;

      const response = await fetch(
        `https://qalert.uniall.tk/api/emergency?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          cache: "no-store",
        }
      );
      if (response.ok) {
        const result = await response.json();
        setData(result.emergency_data);
        setFilteredPatients(result.emergency_data);
        setTotalPages(Math.ceil(result.emergency_data.length / rowsPerPage));
      } else {
        console.error("Failed to fetch patients");
        setError("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <html>
        <head>
          <title>Print Report</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: Arial, sans-serif; text-align: center; width: 800px; margin: auto; }
            h1 { font-size: 16px; margin-bottom: 5px; }
            h2 { font-size: 14px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>MDRRMO of President Roxas</h1>
          <h2>Incidents Reports for the Month of ${startDate} - ${endDate}</h2>
          ${tableRef.current?.innerHTML}
        </body>
      </html>
    `;

    const printWindow = document.createElement("iframe");
    printWindow.style.position = "absolute";
    printWindow.style.width = "0px";
    printWindow.style.height = "0px";
    printWindow.style.border = "none";
    document.body.appendChild(printWindow);

    const doc =
      printWindow.contentDocument || printWindow.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent.innerHTML);
      doc.close();
      printWindow.contentWindow?.focus();
      printWindow.contentWindow?.print();
      document.body.removeChild(printWindow);
    }
  };

  if (loading)
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}
      >
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}
      >
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-7xl p-2 overflow-y-auto"
      >
        <Card className="w-full border-gray-600 h-1/2">
          <CardHeader className="relative">
            <CardTitle className="text-center text-xl font-semibold">
              Report Pages
            </CardTitle>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4 flex-wrap">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <Button onClick={handleFilter}>Filter</Button>
                <Button onClick={handlePrint}>Print</Button>
              </div>
            </div>
            <div ref={tableRef}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Emergency</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Purok</TableHead>
                    <TableHead>Barangay</TableHead>
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
                      <TableCell>{item.purok}</TableCell>
                      <TableCell>{item.barangay}</TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.status ? "Active" : "Inactive"}</TableCell>
                      <TableCell>{item.mobile}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportModal;