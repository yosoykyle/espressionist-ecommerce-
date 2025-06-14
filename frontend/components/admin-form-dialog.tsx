"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { adminStore, type Admin } from "@/lib/data-store"
import { adminUserService } from "@/lib/api-service"

interface AdminFormDialogProps {
  admin: Admin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

const roles = ["Super Admin", "Manager", "Staff"]

export function AdminFormDialog({ admin, open, onOpenChange, onSave }: AdminFormDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username,
        email: admin.email,
        password: "",
        confirmPassword: "",
        role: admin.role,
      })
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      })
    }
    setErrors({})
  }, [admin, open])

  const validateForm = async () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = "Username is required"
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters"

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.role) newErrors.role = "Role is required"

    // Password validation
    if (!admin) {
      // New admin requires password
      if (!formData.password) newErrors.password = "Password is required"
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters (required by system)"

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    } else if (formData.password) {
      // Existing admin with password change
      if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters (required by system)"

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    // Check for duplicate username/email
    const existingAdmins = await adminStore.getAll()
    const duplicateUsername = existingAdmins.find(
      (a) => a.username === formData.username && (!admin || a.id !== admin.id),
    )
    const duplicateEmail = existingAdmins.find((a) => a.email === formData.email && (!admin || a.id !== admin.id))

    if (duplicateUsername) newErrors.username = "Username already exists"
    if (duplicateEmail) newErrors.email = "Email already exists"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!(await validateForm())) return

    const adminData: any = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      role: formData.role as Admin["role"],
    }
    if (formData.password) {
      adminData.password = formData.password
    }

    try {
      // Use API service for create or update
      await (admin
        ? adminUserService.saveAdmin({ ...adminData, id: admin.id })
        : adminUserService.saveAdmin(adminData))
      toast({
        title: admin ? "Admin Updated" : "Admin Created",
        description: `${adminData.username} has been ${admin ? "updated" : "created"} successfully.`,
      })
      onSave()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save admin. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{admin ? "Edit Admin" : "Add New Admin"}</DialogTitle>
          <DialogDescription>
            {admin
              ? "Update the admin user details. Leave password blank to keep the current password."
              : "Create a new admin user with the required information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">{admin ? "Password (leave blank to keep current)" : "Password *"}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <Label>Role *</Label>
            <Select
              name="role"
              value={formData.role}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, role: value }))
                if (errors.role) {
                  setErrors((prev) => ({ ...prev, role: "" }))
                }
              }}
            >
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
              {admin ? "Update Admin" : "Create Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
