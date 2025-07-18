"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import clsx from "clsx"
import { Switch } from "@/components/ui/switch"
import { MembersTableSkeleton } from "@/components/members-table-skeleton"

export function MembersDataTable({ filter = "all", members = [], hideInactive = true, setHideInactive, loading = false, onDelete, onStatusChange, setShowImport, setShowNewMember }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localMembers, setLocalMembers] = useState(members);

  useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  const statusOptions = [
    { value: "Active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "Inactive", label: "Inactive", color: "bg-red-100 text-red-800" },
    { value: "Needs Follow-up", label: "Needs Follow-up", color: "bg-yellow-100 text-yellow-800" },
    { value: "New", label: "New", color: "bg-blue-100 text-blue-800" },
  ];

  // Filtering logic
  const filteredMembers = useMemo(() => {
    let filtered = [...localMembers];
    if (hideInactive) {
      filtered = filtered.filter(m => m.status !== "Inactive");
    }
    if (filter === "new") {
      filtered = filtered.filter(m => m.status === "New");
    } else if (filter === "followup") {
      filtered = filtered.filter(m => m.status === "Needs Follow-up" || m.status === "New");
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.name?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.phone?.includes(searchQuery)
      );
    }
    return filtered;
  }, [localMembers, filter, searchQuery, hideInactive]);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date);
  }; 

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  // Get most recent attendance and contact
  const getLastAttended = (attendanceHistory) => {
    if (!attendanceHistory || attendanceHistory.length === 0) return null;
    const sorted = [...attendanceHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted[0]?.date;
  };
  const getLastContact = (notes) => {
    if (!notes || notes.length === 0) return null;
    const sorted = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted[0]?.date;
  };

  const handleDelete = async (id) => {
    const memberToDelete = localMembers.find(m => (m._id || m.id) === id);
    if (!confirm("Are you sure you want to delete this member?")) return;
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    setLocalMembers(prev => prev.filter(m => (m._id || m.id) !== id));
    if (onDelete && memberToDelete) onDelete(memberToDelete);
  };

  const handleStatusChange = async (id, newStatus) => {
    const oldStatus = localMembers.find(m => (m._id || m.id) === id)?.status;
    await fetch(`/api/members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setLocalMembers(prev => prev.map(m => (m._id || m.id) === id ? { ...m, status: newStatus } : m));
    if (onStatusChange && oldStatus) onStatusChange(id, oldStatus, newStatus);
  };

  if (loading) {
    return <MembersTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={hideInactive}
            onCheckedChange={setHideInactive}
            id="hide-inactive-toggle"
          />
          <label htmlFor="hide-inactive-toggle" className="text-sm text-gray-700 select-none cursor-pointer">
            Hide Inactive
          </label>
        </div>
        <Button onClick={() => setShowImport(false) || setShowNewMember(true)} className="bg-blue-600 text-white">Add Member</Button>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[900px] border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="min-w-[260px] px-6 py-4 border-b">Member</TableHead>
              <TableHead className="min-w-[140px] px-6 py-4 border-b">Last Attended</TableHead>
              <TableHead className="min-w-[140px] px-6 py-4 border-b">Last Contact</TableHead>
              {/* <TableHead>Assigned To</TableHead> */}
              <TableHead className="min-w-[160px] px-6 py-4 border-b">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 px-6 py-4">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member, idx) => (
                <TableRow
                  key={member._id || member.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-blue-50 border-b"
                      : "bg-gray-50 hover:bg-blue-50 border-b"
                  }
                >
                  <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-4 min-w-[220px]">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-[120px]">
                        <span className="font-medium">
                          {member.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member.phone}
                        </span>
                      </div>
                      <select
                        value={member.status}
                        onChange={e => handleStatusChange(member._id || member.id, e.target.value)}
                        className={clsx(
                          "ml-4 border rounded px-2 py-1 text-sm font-medium",
                          statusOptions.find(opt => opt.value === member.status)?.color
                        )}
                        style={{ minWidth: 120 }}
                      >
                        {statusOptions.map(opt => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className={opt.color}
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle min-w-[120px]">{formatDate(getLastAttended(member.attendanceHistory))}</TableCell>
                  <TableCell className="px-6 py-4 align-middle min-w-[120px]">{formatDate(getLastContact(member.notes))}</TableCell>
                  {/* <TableCell>{member.assignedTo}</TableCell> */}
                  <TableCell className="px-6 py-4 align-middle min-w-[140px]">
                    <Link href={`/members/${member._id || member.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(member._id || member.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}