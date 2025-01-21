'use client'

import { useState } from 'react'
import { User, UserRole } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface UserManagementProps {
  users: User[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'CASE_MANAGER' as UserRole
  })

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create user')
      }

      const createdUser = await response.json()
      setUsers([createdUser, ...users])
      setIsAddingUser(false)
      setNewUser({ email: '', name: '', role: 'CASE_MANAGER' })
      
      toast.success('User created successfully', {
        description: 'An invitation email has been sent with login credentials.'
      })
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user', {
        description: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <Button onClick={() => setIsAddingUser(true)}>Add User</Button>
      </div>

      {isAddingUser && (
        <form onSubmit={handleAddUser} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
              className="w-full p-2 border rounded"
            >
              <option value="CASE_MANAGER">Case Manager</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
        ))}
      </div>
    </div>
  )
} 