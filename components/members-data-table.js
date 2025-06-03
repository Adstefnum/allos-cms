"use client"

import { useState, useMemo } from "react"
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

export function MembersDataTable({ filter = "all", members = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering logic
  const filteredMembers = useMemo(() => {
    let filtered = [...members];
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
  }, [members, filter, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
      case 'Needs Follow-up':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Needs Follow-up</Badge>
      case 'New':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
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

  return (
    <div className="space-y-4">
      <div className="flex items-center">
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
        <Link href="/members/new">
          <Button className="ml-4">
            Add Member
          </Button>
        </Link>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Attended</TableHead>
              <TableHead>Last Contact</TableHead>
              {/* <TableHead>Assigned To</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member._id || member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {member.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member.phone}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>{formatDate(getLastAttended(member.attendanceHistory))}</TableCell>
                  <TableCell>{formatDate(getLastContact(member.notes))}</TableCell>
                  {/* <TableCell>{member.assignedTo}</TableCell> */}
                  <TableCell>
                    <Link href={`/members/${member._id || member.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
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