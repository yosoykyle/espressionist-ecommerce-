"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Edit, Trash2, ArchiveRestore } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { adminStore, initializeData, type Admin } from "@/lib/data-store"
import { AdminFormDialog } from "@/components/admin-form-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { authService } from "@/lib/api-service"
import { adminUserService } from "@/lib/api-service"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar } from "@/components/ui/avatar"

export default function AdminAdminsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [archiveAdmin, setArchiveAdmin] = useState<Admin | null>(null)
  const [restoreAdmin, setRestoreAdmin] = useState<Admin | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn()
    if (!isLoggedIn) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      initializeData()
      loadAdmins()
    }
  }, [router])

  const loadAdmins = async () => {
    const allAdmins = await adminStore.getAll()
    setAdmins(allAdmins)
  }

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArchived = showArchived ? admin.archived : !admin.archived
    return matchesSearch && matchesArchived
  })

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedAdmin(null)
    setIsDialogOpen(true)
  }

  const handleArchive = (admin: Admin) => {
    if (currentAdmin && admin.id === currentAdmin.id) {
      toast({
        title: "Cannot Archive",
        description: "You cannot archive your own account.",
        variant: "destructive",
      })
      return
    }
    setArchiveAdmin(admin)
  }

  const confirmArchive = async () => {
    if (archiveAdmin) {
      try {
        await adminUserService.deleteAdmin(archiveAdmin.id)
        await loadAdmins()
        toast({
          title: "Admin Archived",
          description: `${archiveAdmin.username} has been archived.`,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to archive admin.",
          variant: "destructive",
        })
      }
      setArchiveAdmin(null)
    }
  }

  const handleRestore = (admin: Admin) => {
    setRestoreAdmin(admin)
  }

  const confirmRestore = async () => {
    if (restoreAdmin) {
      try {
        await adminUserService.restoreAdmin(restoreAdmin.id)
        await loadAdmins()
        toast({
          title: "Admin Restored",
          description: `${restoreAdmin.username} has been restored.`,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to restore admin.",
          variant: "destructive",
        })
      }
      setRestoreAdmin(null)
    }
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600">Manage system administrators and their roles</p>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Button
              variant="outline"
              onClick={() => setShowArchived(!showArchived)}
              className="flex-1 sm:flex-none"
            >
              {showArchived ? "Show Active" : "Show Archived"}
            </Button>
            <Button 
              onClick={handleCreate}
              className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No admins found.
                      {searchTerm && (
                        <Button
                          variant="link"
                          onClick={() => setSearchTerm("")}
                          className="ml-2"
                        >
                          Clear search
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <Avatar>
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-medium">
                            {admin.username.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{admin.username}</div>
                        <div className="md:hidden text-sm text-gray-500">{admin.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {admin.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.role === "Super Admin" ? "default" : "secondary"}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={admin.archived ? "destructive" : "outline"}>
                          {admin.archived ? "Archived" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(admin)}
                            title="Edit admin"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {admin.archived ? (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRestore(admin)}
                              title="Restore admin"
                            >
                              <ArchiveRestore className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleArchive(admin)}
                              disabled={currentAdmin?.id === admin.id}
                              title="Archive admin"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <AdminFormDialog
          admin={selectedAdmin}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={() => {
            loadAdmins()
            setIsDialogOpen(false)
            setSelectedAdmin(null)
          }}
        />
        <ConfirmDialog
          open={!!archiveAdmin}
          onOpenChange={() => setArchiveAdmin(null)}
          title="Archive Admin"
          description={`Are you sure you want to archive ${archiveAdmin?.username}? They will no longer be able to access the system.`}
          onConfirm={confirmArchive}
        />
        <ConfirmDialog
          open={!!restoreAdmin}
          onOpenChange={() => setRestoreAdmin(null)}
          title="Restore Admin"
          description={`Are you sure you want to restore ${restoreAdmin?.username}? They will regain access to the system.`}
          onConfirm={confirmRestore}
        />
      </div>
    </AdminLayout>
  )
}
