"use client"

import { useState, useEffect } from "react"
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

// Mock data - in a real app this would come from your API
const MOCK_MEMBERS = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    phone: "555-123-4567",
    status: "active",
    lastAttended: "2025-04-20T10:00:00Z",
    lastFollowUp: "2025-04-15T14:30:00Z",
    assignedTo: "Pastor James"
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Williams",
    email: "michael.w@example.com",
    phone: "555-987-6543",
    status: "new",
    lastAttended: "2025-04-20T10:00:00Z",
    lastFollowUp: null,
    assignedTo: "Deacon Wilson"
  },
  {
    id: "3",
    firstName: "Jennifer",
    lastName: "Smith",
    email: "jennifer.s@example.com",
    phone: "555-456-7890",
    status: "active",
    lastAttended: "2025-04-17T18:30:00Z",
    lastFollowUp: "2025-04-10T11:15:00Z",
    assignedTo: "Minister Thompson"
  },
  {
    id: "4",
    firstName: "Robert",
    lastName: "Davis",
    email: "robert.d@example.com",
    phone: "555-789-0123",
    status: "inactive",
    lastAttended: "2025-03-05T10:00:00Z",
    lastFollowUp: "2025-04-16T14:00:00Z",
    assignedTo: "Deacon Wilson"
  },
  {
    id: "5",
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.b@example.com",
    phone: "555-234-5678",
    status: "active",
    lastAttended: "2025-04-20T10:00:00Z",
    lastFollowUp: "2025-04-18T09:45:00Z",
    assignedTo: "Pastor James"
  },
  {
    id: "6",
    firstName: "David",
    lastName: "Martinez",
    email: "david.m@example.com",
    phone: "555-345-6789",
    status: "new",
    lastAttended: "2025-04-20T10:00:00Z",
    lastFollowUp: null,
    assignedTo: "Minister Thompson"
  },
  {
    id: "7",
    firstName: "Lisa",
    lastName: "Taylor",
    email: "lisa.t@example.com",
    phone: "555-456-7890",
    status: "active",
    lastAttended: "2025-04-20T10:00:00Z",
    lastFollowUp: "2025-04-12T13:30:00Z",
    assignedTo: "Pastor James"
  }
]


export function MembersDataTable({ filter = "all" }) {
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    // In a real app, fetch from your API with the filter
    let filteredMembers = [...MOCK_MEMBERS]
    
    if (filter === "new") {
      filteredMembers = filteredMembers.filter(m => m.status === "new")
    } else if (filter === "followup") {
      // Simplified logic - in reality would be more complex based on attendance patterns
      filteredMembers = filteredMembers.filter(m => 
        m.status === "inactive" || 
        !m.lastFollowUp || 
        new Date(m.lastFollowUp) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      )
    }
    
    setMembers(filteredMembers)
  }, [filter])
  
  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date)
  }
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  const getInitials = (firstName, lastName) => {
    return (firstName[0] + lastName[0]).toUpperCase()
  }
  
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    return (
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.phone.includes(searchQuery)
    )
  })

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
              <TableHead>Assigned To</TableHead>
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
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(member.firstName, member.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {member.firstName} {member.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member.phone}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>{formatDate(member.lastAttended)}</TableCell>
                  <TableCell>{formatDate(member.lastFollowUp)}</TableCell>
                  <TableCell>{member.assignedTo}</TableCell>
                  <TableCell>
                    <Link href={`/members/${member.id}`}>
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