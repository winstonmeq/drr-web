"use client";

import { useState, useEffect, useCallback, useRef, type ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, Loader2, MapPin, Phone, AlertCircle } from "lucide-react";

interface PostsData {
  id: string;
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
  plan?: string;
}

interface AuthData {
  token: string;
  user: UserData;
}

const PostsOnline: React.FC = () => {
  const [data, setData] = useState<PostsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  // ----- Modal & Edit/Delete States -----
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostsData | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ situation: "", barangay: "" });
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  // -----------------------------------------------------------------
  // 1. FETCH LIST
  // -----------------------------------------------------------------
  const fetchEmergency = useCallback(
    async (munId: string, provId: string, token: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/postnotify?munId=${munId}&provId=${provId}`,
          {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load data");
        const result = await res.json();
        const emergencyData: PostsData[] = result.emergency_data || [];

        setData(emergencyData);
        setTotalPages(Math.ceil(emergencyData.length / rowsPerPage));
      } catch (err) {
        console.error(err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------
  // 2. AUTH + INITIAL LOAD
  // -----------------------------------------------------------------
  useEffect(() => {
    const raw = localStorage.getItem("authData");
    if (!raw) {
      setError("No token found. Please log in.");
      return;
    }
    const auth: AuthData = JSON.parse(raw);
    setUserData(auth.user);
    fetchEmergency(auth.user.munId, auth.user.provId, auth.token);
  }, [fetchEmergency]);

  // -----------------------------------------------------------------
  // 3. PAGINATION
  // -----------------------------------------------------------------
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  useEffect(() => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  // -----------------------------------------------------------------
  // 4. DETAIL MODAL
  // -----------------------------------------------------------------
  const openDetail = (post: PostsData) => {
    setSelectedPost(post);
    setDetailOpen(true);
  };

  // -----------------------------------------------------------------
  // 5. EDIT HANDLERS
  // -----------------------------------------------------------------
  const startEdit = (post: PostsData) => {
    setEditingId(post.id);
    setEditForm({ situation: post.situation, barangay: post.barangay });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ situation: "", barangay: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const token = JSON.parse(localStorage.getItem("authData")!).token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/postnotify/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();

      setData((prev) =>
        prev.map((p) => (p.id === editingId ? updated : p))
      );
      cancelEdit();
    } catch (e) {
      alert("Failed to update post: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------------------------------
  // 6. DELETE HANDLERS
  // -----------------------------------------------------------------
  const openDeleteConfirm = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const token = JSON.parse(localStorage.getItem("authData")!).token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/postnotify/${deletingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Delete failed");

      setData((prev) => prev.filter((p) => p.id !== deletingId));
    } catch (e) {
            alert("Failed to update post: " + (e instanceof Error ? e.message : String(e)));

    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // -----------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="p-4">
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg"> {userData?.wname} <span>Posts Details</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={tableRef} className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Emergency</TableHead>
                  <TableHead>Mun/Brgy</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="max-w-[180px]">Situation</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant={item.status ? "default" : "secondary"}>
                          {item.emergency}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.barangay}</TableCell>

                      {/* Situation (editable) */}
                      <TableCell className="max-w-[180px]">
                        {editingId === item.id ? (
                          <Textarea
                            value={editForm.situation}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              setEditForm({
                                ...editForm,
                                situation: e.target.value,
                              })
                            }
                            className="h-20 resize-none"
                          />
                        ) : (
                          <span className="truncate block">
                            {item.situation}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>{item.mobile}</TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* VIEW (opens modal) */}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openDetail(item)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* EDIT / SAVE / CANCEL */}
                          {editingId === item.id ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={saveEdit}
                                disabled={saving}
                                title="Save"
                              >
                                {saving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={cancelEdit}
                                title="Cancel"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => startEdit(item)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}

                          {/* DELETE */}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openDeleteConfirm(item.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-6">
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-4 mt-6 justify-center items-center">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ====================== DETAIL MODAL ====================== */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Emergency Report Details
            </DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-5 py-4">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Reported by</p>
                  <p className="font-semibold">{selectedPost.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedPost.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <hr />

              {/* Emergency Type */}
              <div>
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Emergency Type
                </p>
                <Badge variant={selectedPost.status ? "default" : "secondary"} className="mt-1">
                  {selectedPost.emergency}
                </Badge>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </p>
                <p className="mt-1">
                  <strong>Barangay:</strong> {selectedPost.barangay}
                  <br />
                  <strong>Municipality:</strong> {selectedPost.munName}
                  <br />
                  <strong>Coordinates:</strong> {selectedPost.lat}, {selectedPost.long}
                </p>
              </div>

              {/* Situation */}
              <div>
                <p className="text-sm font-medium text-gray-700">Situation Description</p>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                  {selectedPost.situation || "No description provided."}
                </p>
              </div>

              {/* Contact */}
              <div>
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Number
                </p>
                <p className="mt-1">{selectedPost.mobile}</p>
              </div>

              {/* Status */}
              <div className="flex gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <Badge variant={selectedPost.status ? "default" : "secondary"}>
                    {selectedPost.status ? "Active" : "Resolved"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Verified</p>
                  <Badge variant={selectedPost.verified ? "default" : "outline"}>
                    {selectedPost.verified ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ====================== DELETE CONFIRM ====================== */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsOnline;