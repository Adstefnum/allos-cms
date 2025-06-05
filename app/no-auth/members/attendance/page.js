'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const LOCAL_KEY = "attendance-progress";

export default function AttendancePage() {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    // Fetch members on component mount
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data.members);

        // Check for saved progress
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved) {
          setAttendance(JSON.parse(saved));
          setRestored(true);
        } else {
          // Initialize all members as absent
          const initialAttendance = {};
          data.members.forEach(member => {
            initialAttendance[member._id] = false;
          });
          setAttendance(initialAttendance);
        }
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

  useEffect(() => {
    // Save progress to localStorage
    if (Object.keys(attendance).length > 0) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(attendance));
    }
  }, [attendance]);

  useEffect(() => {
    if (restored) {
      toast({
        title: "Progress Restored",
        description: "Your previous attendance progress has been restored.",
      });
      setRestored(false);
    }
  }, [restored]);

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
      localStorage.removeItem(LOCAL_KEY);
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
              <div className="flex font-semibold mb-2">
                <div className="w-32">Present/Absent</div>
                <div>Name</div>
              </div>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member._id} className="flex items-center space-x-4">
                    <Checkbox
                      id={member._id}
                      checked={attendance[member._id]}
                      onCheckedChange={() => handleAttendanceChange(member._id)}
                    />
                    <label htmlFor={member._id} className="text-sm font-medium">
                      {member.name}
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
