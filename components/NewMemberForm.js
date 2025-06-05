"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function NewMemberForm({ open, onClose, onCreate }) {
  const today = new Date().toISOString().split('T')[0];
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    address: "",
    joinDate: today,
    status: "",
    lastAttendance: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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
        const newMember = await response.json();
        if (onCreate) onCreate(newMember);
        setFormData(initialFormState);
        onClose();
      }
    } catch (error) {
      // Optionally show error
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
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
              <div className="flex gap-2 mt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Member"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 