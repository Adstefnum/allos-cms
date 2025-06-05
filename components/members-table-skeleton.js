import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function MembersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[260px] px-6 py-4">Member</TableHead>
              <TableHead className="min-w-[140px] px-6 py-4">Last Attended</TableHead>
              <TableHead className="min-w-[140px] px-6 py-4">Last Contact</TableHead>
              <TableHead className="min-w-[160px] px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-4 min-w-[220px]">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex flex-col min-w-[120px]">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                      <Skeleton className="h-7 w-[100px] rounded" />
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle min-w-[120px]">
                    <Skeleton className="h-4 w-[90px]" />
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle min-w-[120px]">
                    <Skeleton className="h-4 w-[90px]" />
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle min-w-[140px]">
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-[40px]" />
                      <Skeleton className="h-9 w-[60px]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}