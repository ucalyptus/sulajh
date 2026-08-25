'use client'

import { useState } from 'react'
import { User, UserRole } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: 0,
  },
  form: {
    backgroundColor: colors.white,
    padding: spacing[6],
    borderRadius: radii.lg,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing[4],
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  userCard: {
    backgroundColor: colors.white,
    padding: spacing[4],
    borderRadius: radii.lg,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 500,
    margin: 0,
  },
  userText: {
    fontSize: '0.875rem',
    color: colors.gray500,
    margin: 0,
  },
})

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
        throw new Error('Failed to create user')
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
      toast.error('Failed to create user')
    }
  }

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <h2 {...stylex.props(styles.heading)}>Manage Users</h2>
        <Button onClick={() => setIsAddingUser(true)}>Add User</Button>
      </div>

      {isAddingUser && (
        <form onSubmit={handleAddUser} {...stylex.props(styles.form)}>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </div>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="user-role">Role</Label>
            <Select
              value={newUser.role}
              onValueChange={(val) => setNewUser({ ...newUser, role: val as UserRole })}
            >
              <SelectTrigger style={{ width: '100%' }}>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASE_MANAGER">Case Manager</SelectItem>
                <SelectItem value="NEUTRAL">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div {...stylex.props(styles.actionsRow)}>
            <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      )}

      <div {...stylex.props(styles.list)}>
        {users.map((user) => (
          <div key={user.id} {...stylex.props(styles.userCard)}>
            <div>
              <h3 {...stylex.props(styles.userName)}>{user.name}</h3>
              <p {...stylex.props(styles.userText)}>{user.email}</p>
              <p {...stylex.props(styles.userText)}>{user.role}</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
