"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersIcon, CalendarIcon, PhoneIcon } from "@/components/icons"
import { StatsCard } from "@/components/stats-card"
import { MembersTableSkeleton } from "@/components/members-table-skeleton"
import { MembersDataTable } from "@/components/members-data-table"
import apiClient from "@/libs/api";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [data, setData] = useState({
    count: 0,
    presentCount: 0,
    followUpCount: 0,
    members: []
  });
  const [showImport, setShowImport] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [hideInactive, setHideInactive] = useState(true);
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      const res = await fetch('/api/members');
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const responseData = await res.json();
      setData({
        count: responseData?.count || 0,
        presentCount: responseData?.presentCount || 0,
        followUpCount: responseData?.followUpCount || 0,
        members: responseData?.members || []
      });
      setLoading(false);
    }
    fetchDashboardData();
  }, [importResult]);

  const handleImportCSV = async (e) => {
    e.preventDefault();
    if (!fileInputRef.current.files[0]) return;
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    const res = await fetch('/api/members/import-csv', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    setImportResult(result);
    setShowImport(false);
  };

  const { presentCount, followUpCount, members } = data;
  const activeMembersCount = members.filter(m => m.status !== 'Inactive').length;
  const totalMembersCount = members.length;
  const displayedCount = hideInactive ? activeMembersCount : totalMembersCount;

  // Local stat adjustment handlers
  const handleMemberDelete = (deletedMember) => {
    setData(prev => {
      const newMembers = prev.members.filter(m => (m._id || m.id) !== (deletedMember._id || deletedMember.id));
      // Recalculate stats based on newMembers
      const presentCount = newMembers.filter(m => m.status !== 'Inactive' && m.attendanceHistory?.some(a => a.present)).length;
      const followUpCount = newMembers.filter(m => m.status === 'Needs Follow-up').length;
      return {
        ...prev,
        members: newMembers,
        presentCount,
        followUpCount,
      };
    });
  };

  const handleStatusChange = (id, oldStatus, newStatus) => {
    setData(prev => {
      const newMembers = prev.members.map(m => (m._id || m.id) === id ? { ...m, status: newStatus } : m);
      // Recalculate stats based on newMembers
      const presentCount = newMembers.filter(m => m.status !== 'Inactive' && m.attendanceHistory?.some(a => a.present)).length;
      const followUpCount = newMembers.filter(m => m.status === 'Needs Follow-up').length;
      return {
        ...prev,
        members: newMembers,
        presentCount,
        followUpCount,
      };
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Church Member Dashboard</h1>
            <p className="text-gray-600">Manage and track church member engagement</p>
          </div>
          <Button onClick={() => setShowImport(true)} className="bg-blue-600 text-white">Import CSV</Button>
        </div>
        {importResult && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            Imported {importResult.createdCount} members successfully.
          </div>
        )}
        {showImport && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Import Members from CSV</h2>
              <form onSubmit={handleImportCSV}>
                <input type="file" accept=".csv" ref={fileInputRef} required className="mb-4" />
                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 text-white">Upload</Button>
                  <Button type="button" variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
                </div>
              </form>
              <div className="text-xs text-gray-500 mt-2">CSV columns: <b>name</b>, <b>phone</b></div>
            </div>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Members"
            value={displayedCount}
            description={hideInactive ? "Active members in database" : "All members in database"}
            icon={<UsersIcon className="h-4 w-4 text-blue-600" />}
          />
          <StatsCard
            title="This Sunday"
            value={presentCount}
            description="Members in attendance"
            icon={<CalendarIcon className="h-4 w-4 text-blue-600" />}
          />
          <StatsCard
            title="Follow-Ups"
            value={followUpCount}
            description="Pending follow-ups this week"
            icon={<PhoneIcon className="h-4 w-4 text-blue-600" />}
          />
        </div>
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="new">New Members</TabsTrigger>
              <TabsTrigger value="followup">Needs Follow-Up</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Member Directory</CardTitle>
                <CardDescription>
                  Manage and view all church members from a central location.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MembersTableSkeleton />}>
                  <MembersDataTable
                    filter="all"
                    members={members}
                    hideInactive={hideInactive}
                    setHideInactive={setHideInactive}
                    loading={loading}
                    onDelete={handleMemberDelete}
                    onStatusChange={handleStatusChange}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="new" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Members</CardTitle>
                <CardDescription>
                  Recently joined members who need additional follow-up and care.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MembersTableSkeleton />}>
                  <MembersDataTable
                    filter="new"
                    members={members}
                    hideInactive={hideInactive}
                    setHideInactive={setHideInactive}
                    loading={loading}
                    onDelete={handleMemberDelete}
                    onStatusChange={handleStatusChange}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="followup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Follow-Up Required</CardTitle>
                <CardDescription>
                  Members who haven't attended recently or need personal contact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MembersTableSkeleton />}>
                  <MembersDataTable
                    filter="followup"
                    members={members}
                    hideInactive={hideInactive}
                    setHideInactive={setHideInactive}
                    loading={loading}
                    onDelete={handleMemberDelete}
                    onStatusChange={handleStatusChange}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
