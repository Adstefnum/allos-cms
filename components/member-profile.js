"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  MessageSquare, 
  Plus,
  Edit
} from "lucide-react";

export default function MemberProfile({ memberId }) {
  const [newNote, setNewNote] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      const res = await fetch(`/api/members/${memberId}`);
      const data = await res.json();
      setMember(data);
    }
    fetchMember();
  }, [memberId]);

  if (!member) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Not Found</h2>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const attendanceRate = member.attendanceHistory && member.attendanceHistory.length > 0
    ? Math.round(
        (member.attendanceHistory.filter(a => a.present).length / member.attendanceHistory.length) * 100
      )
    : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Needs Follow-up":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
            <Link href="/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
              <p className="text-gray-600 mt-1">Member since {formatDate(member.joinDate)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(member.status)}>
                {member.status}
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => setIsEditMode(!isEditMode)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditMode ? "Cancel Edit" : "Edit Member"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{member.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{member.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{member.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">Last attended: {formatDate(member.lastAttendance)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Assignment & Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Assignment & Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                  <p className="text-lg font-medium text-blue-600">{member.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Contact</Label>
                  <p className="text-gray-900">{formatDate(member.lastContact)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Attendance Rate</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${attendanceRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{attendanceRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Notes & Follow-ups</TabsTrigger>
                <TabsTrigger value="attendance">Attendance History</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                        Follow-up Notes
                      </span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Add new note form */}
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <Label htmlFor="new-note" className="text-sm font-medium">Add New Note</Label>
                        <Input
                          id="new-note"
                          placeholder="Enter your follow-up note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="mt-2"
                        />
                        <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                          Save Note
                        </Button>
                      </div>

                      {/* Existing notes */}
                      {member.notes && member.notes.map((note) => (
                        <div key={note._id || note.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-blue-600">{note.author}</span>
                            <span className="text-sm text-gray-500">{formatDate(note.date)}</span>
                          </div>
                          <p className="text-gray-900">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                      Recent Attendance History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {member.attendanceHistory && member.attendanceHistory.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium text-gray-900">
                            {formatDate(record.date)}
                          </span>
                          <Badge 
                            className={record.present 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                            }
                          >
                            {record.present ? "Present" : "Absent"}
                          </Badge>
                      </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};