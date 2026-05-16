import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Shield, User, Search, X } from 'lucide-react';
import { getUsers, deleteUser, adminUpdateUser } from '../api';
import { toast } from '../components/Toaster';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import TableSkeleton from '../components/TableSkeleton';

const AdminUserList = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = useCallback(async (keyword = "", pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getUsers({ 
        keyword, 
        pageNumber: pageNum,
        pageSize: 10 
      });
      
      // Backend returns { users, page, pages, count }
      setUserList(data.users || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
      setTotalCount(data.count || 0);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchTerm, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUsers]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User removed');
        fetchUsers(searchTerm, page);
      } catch (error) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const toggleAdminHandler = async (user) => {
    try {
      await adminUpdateUser({
        ...user,
        isAdmin: !user.isAdmin
      });
      toast.success(`User ${user.isAdmin ? 'demoted' : 'promoted'} successfully`);
      fetchUsers(searchTerm, page);
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground italic">View and manage registered customers</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button 
                onClick={clearFilters}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Admin Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeleton columns={4} />
                ) : (
                  <>
                    {userList.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                              <User className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{user._id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground/70">{user.email}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <button 
                              onClick={() => toggleAdminHandler(user)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                user.isAdmin 
                                  ? 'bg-gold text-black' 
                                  : 'bg-white/5 text-muted-foreground border border-glass-border/20 hover:border-gold/30 hover:text-foreground'
                              }`}
                            >
                              {user.isAdmin ? <Shield size={14} /> : <User size={14} />}
                              {user.isAdmin ? 'Admin' : 'Customer'}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={user.isAdmin}
                            className={`hover:text-red-500 hover:bg-red-500/10 ${user.isAdmin ? 'opacity-20 cursor-not-allowed' : ''}`}
                            onClick={() => deleteHandler(user._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {userList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No users found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => fetchUsers(searchTerm, page - 1)}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {[...Array(pages).keys()].map((x) => (
                  <Button
                    key={x + 1}
                    variant={page === x + 1 ? "default" : "outline"}
                    size="sm"
                    className={page === x + 1 ? "bg-gold text-black" : ""}
                    onClick={() => fetchUsers(searchTerm, x + 1)}
                  >
                    {x + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pages}
                onClick={() => fetchUsers(searchTerm, page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserList;
