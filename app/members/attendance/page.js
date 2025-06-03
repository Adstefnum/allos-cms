'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

export default function AttendancePage() {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch members on component mount
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data.members);
        
        // Initialize all members as absent
        const initialAttendance = {};
        data.members.forEach(member => {
          initialAttendance[member._id] = false;
        });
        setAttendance(initialAttendance);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch members",
          variant: "destructive",
        });
      }
    };

    fetchMembers();
  }, []);

  const handleAttendanceChange = (memberId) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create attendance records for each member
      const date = new Date().toISOString().split('T')[0];
      
      // Update each member's attendance history
      const updatePromises = Object.entries(attendance).map(([memberId, present]) => {
        return fetch(`/api/members/${memberId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attendanceHistory: {
              date,
              present
            }
          }),
        });
      });

      await Promise.all(updatePromises);

      toast({
        title: "Success",
        description: "Attendance has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member._id} className="flex items-center space-x-4">
                    <Checkbox
                      id={member._id}
                      checked={attendance[member._id]}
                      onCheckedChange={() => handleAttendanceChange(member._id)}
                    />
                    <label htmlFor={member._id} className="text-sm font-medium">
                      {member.firstName} {member.lastName}
                    </label>
                  </div>
                ))}
              </div>
              <Button 
                type="submit" 
                className="mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Attendance"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
