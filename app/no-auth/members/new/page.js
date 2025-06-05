"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export default function NewMemberPage() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joinDate: today,
    status: "",
    lastAttendance: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send non-empty fields
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "")
      );
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating member:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Add New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status (optional)</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Select Status --</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Needs Follow-up">Needs Follow-up</option>
                  <option value="New">New</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastAttendance">Last Attendance (optional)</Label>
                <Input
                  id="lastAttendance"
                  name="lastAttendance"
                  type="date"
                  value={formData.lastAttendance}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Member
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
