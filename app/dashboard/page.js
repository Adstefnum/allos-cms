
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersIcon, CalendarIcon, PhoneIcon } from "@/components/icons"
import { StatsCard } from "@/components/stats-card"
import {MembersTableSkeleton } from "@/components/members-table-skeleton"
import { MembersDataTable } from "@/components/members-data-table"

export default function Dashboard(){
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Church Member Dashboard</h1>
          <p className="text-gray-600">Manage and track church member engagement</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Members"
          value={124}
          description="Active members in database"
          icon={<UsersIcon className="h-4 w-4 text-blue-600" />}
        />
        <StatsCard
          title="This Sunday"
          value={87}
          description="Members in attendance"
          icon={<CalendarIcon className="h-4 w-4 text-blue-600" />}
        />
        <StatsCard
          title="Follow-Ups"
          value={23}
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
                <MembersDataTable filter="all" />
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
                <MembersDataTable filter="new" />
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
                <MembersDataTable filter="followup" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> 
      </div>
    </div>
  );
};
