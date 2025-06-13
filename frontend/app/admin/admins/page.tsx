"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
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
    return matchesSearch
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

  const handleSave = () => {
    loadAdmins()
    setIsDialogOpen(false)
    setSelectedAdmin(null)
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600">Manage administrator accounts and permissions</p>
          </div>
          <Button onClick={handleCreate} className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search admins by username, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Admins List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin) => (
            <Card key={admin.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{admin.username}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{admin.role}</Badge>
                    {currentAdmin && admin.id === currentAdmin.id && <Badge variant="default">You</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{admin.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm">{new Date(admin.createdAt).toLocaleDateString()}</p>
                  </div>
                  {admin.lastLogin && (
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="text-sm">{new Date(admin.lastLogin).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(admin)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(admin)}
                    disabled={currentAdmin && admin.id === currentAdmin.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No admins found.</p>
          </div>
        )}

        <AdminFormDialog admin={selectedAdmin} open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSave} />

        <ConfirmDialog
          open={!!archiveAdmin}
          onOpenChange={() => setArchiveAdmin(null)}
          title="Archive Admin"
          description={`Are you sure you want to archive ${archiveAdmin?.username}? They will no longer be able to access the system.`}
          onConfirm={confirmArchive}
        />
      </div>
    </AdminLayout>
  )
}
