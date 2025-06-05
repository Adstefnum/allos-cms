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

export default function MemberProfile({ member }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(member);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    setEditData(member);
  }, [member]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/members/${member._id || member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    });
    const updated = await res.json();
    setEditData(updated);
    setIsEditMode(false);
    setSaving(false);
  };

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

  const handleSaveNote = async () => {
    const res = await fetch(`/api/members/${member._id || member.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ notes: [...member.notes, { content: newNote, date: new Date().toISOString() }] })
    });
    const data = await res.json();
    setEditData(data);
    setNewNote("");
  }
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
              {isEditMode ? (
                <Input name="name" value={editData.name} onChange={handleEditChange} className="text-3xl font-bold text-gray-900" placeholder="Full Name" />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{editData.name}</h1>
              )}
              <p className="text-gray-600 mt-1">
                Member since {isEditMode ? (
                  <Input name="joinDate" type="date" value={editData.joinDate || ""} onChange={handleEditChange} className="inline w-auto ml-2" placeholder="Join Date" />
                ) : (
                  formatDate(editData.joinDate)
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <select name="status" value={editData.status} onChange={handleEditChange} className="border rounded px-2 py-1" placeholder="Status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Needs Follow-up">Needs Follow-up</option>
                  <option value="New">New</option>
                </select>
              ) : (
                <Badge className={getStatusColor(editData.status)}>
                  {editData.status}
                </Badge>
              )}
              <Button 
                variant="outline" 
                onClick={() => setIsEditMode(!isEditMode)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                disabled={saving}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditMode ? "Cancel" : "Edit Member"}
              </Button>
              {isEditMode && (
                <Button onClick={handleSave} className="bg-blue-600 text-white" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              )}
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
                  {isEditMode ? (
                    <Input name="email" value={editData.email || ""} onChange={handleEditChange} placeholder="Email" />
                  ) : (
                    <span className="text-gray-900">{editData.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {isEditMode ? (
                    <Input name="phone" value={editData.phone || ""} onChange={handleEditChange} placeholder="Phone Number" />
                  ) : (
                    <span className="text-gray-900">{editData.phone}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {isEditMode ? (
                    <Input name="address" value={editData.address || ""} onChange={handleEditChange} placeholder="Address" />
                  ) : (
                    <span className="text-gray-900">{editData.address}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {isEditMode ? (
                    <Input name="lastAttendance" type="date" value={editData.lastAttendance || ""} onChange={handleEditChange} placeholder="Last Attendance" />
                  ) : (
                    <span className="text-gray-900">Last attended: {formatDate(editData.lastAttendance)}</span>
                  )}
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
                  {isEditMode ? (
                    <Input name="assignedTo" value={editData.assignedTo || ""} onChange={handleEditChange} placeholder="Assigned To" />
                  ) : (
                    <p className="text-lg font-medium text-blue-600">{editData.assignedTo}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Contact</Label>
                  {isEditMode ? (
                    <Input name="lastContact" type="date" value={editData.lastContact || ""} onChange={handleEditChange} placeholder="Last Contact" />
                  ) : (
                    <p className="text-gray-900">{formatDate(editData.lastContact)}</p>
                  )}
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
                        <Button onClick={handleSaveNote} size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
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
}