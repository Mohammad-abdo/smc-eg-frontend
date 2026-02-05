import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, Shield, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useApi';
import { toast } from 'sonner';

const UsersManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const permissions = [
    { id: 'products', label: language === 'ar' ? 'إدارة المنتجات' : 'Manage Products' },
    { id: 'news', label: language === 'ar' ? 'إدارة الأخبار' : 'Manage News' },
    { id: 'users', label: language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users' },  
    { id: 'settings', label: language === 'ar' ? 'إدارة الإعدادات' : 'Manage Settings' },
    { id: 'contacts', label: language === 'ar' ? 'عرض جهات الاتصال' : 'View Contacts' },
    { id: 'complaints', label: language === 'ar' ? 'عرض الشكاوى' : 'View Complaints' },
    { id: 'tenders', label: language === 'ar' ? 'إدارة المناقصات' : 'Manage Tenders' },
    { id: 'members', label: language === 'ar' ? 'إدارة الأعضاء' : 'Manage Members' },
  ];

  const handleEdit = (user: any) => {
    setEditingUser({ ...user });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingUser) {
      if (!editingUser.name || !editingUser.email) {
        toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
      if (!editingUser.id && !editingUser.password) {
        toast.error(language === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter password');
        return;
      }
      try {
        if (editingUser.id) {
          await updateUser.mutateAsync({ id: editingUser.id, updates: editingUser });
          toast.success(language === 'ar' ? 'تم تحديث المستخدم بنجاح' : 'User updated successfully');
        } else {
          await createUser.mutateAsync(editingUser);
          toast.success(language === 'ar' ? 'تم إنشاء المستخدم بنجاح' : 'User created successfully');
        }
        setIsDialogOpen(false);
        setEditingUser(null);
      } catch (error: any) {
        console.error('Error saving user:', error);
        const errorMessage = error?.message || 'Unknown error';
        toast.error(language === 'ar' ? `فشل في حفظ المستخدم: ${errorMessage}` : `Failed to save user: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
      try {
        await deleteUser.mutateAsync(id);
        toast.success(language === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل في حذف المستخدم' : 'Failed to delete user');
      }
    }
  };

  const handleAdd = () => {
    setEditingUser({
      name: '',
      email: '',
      password: '',
      role: 'viewer' as const,
      status: 'active' as const,
      permissions: [],
    });
    setIsDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    if (!editingUser) return;
    const current = editingUser.permissions || [];
    const updated = current.includes(permissionId)
      ? current.filter((p: string) => p !== permissionId)
      : [...current, permissionId];
    setEditingUser({ ...editingUser, permissions: updated });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{t('users') || 'Users'}</h2>
          <p className="text-muted-foreground mt-1">{t('manageUsers') || 'Manage users and permissions'}</p>
        </div>
        <Button onClick={handleAdd} disabled={createUser.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addUser') || 'Add User'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search') || 'Search users...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('usersList') || 'Users List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('name') || 'Name'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('email') || 'Email'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('role') || 'Role'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('status') || 'Status'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={user.role === 'admin' ? 'bg-red-500' : user.role === 'editor' ? 'bg-blue-500' : 'bg-gray-500'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[150]">
          <DialogHeader>
            <DialogTitle>{editingUser?.id ? t('editUser') || 'Edit User' : t('addUser') || 'Add User'}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('name') || 'Name'} *</Label>
                  <Input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('email') || 'Email'} *</Label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
              </div>
              {!editingUser.id && (
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'كلمة المرور' : 'Password'} *</Label>
                  <Input
                    type="password"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                  />
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('role') || 'Role'}</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('status') || 'Status'}</Label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('permissions') || 'Permissions'}</Label>
                <div className="grid gap-3 p-4 border rounded-lg">
                  {permissions.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={perm.id}
                        checked={editingUser.permissions?.includes(perm.id) || editingUser.permissions?.includes('all')}
                        onCheckedChange={() => togglePermission(perm.id)}
                        disabled={editingUser.permissions?.includes('all')}
                      />
                      <label htmlFor={perm.id} className="text-sm font-medium cursor-pointer">
                        {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={createUser.isPending || updateUser.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {createUser.isPending || updateUser.isPending ? 'Saving...' : (t('save') || 'Save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;

