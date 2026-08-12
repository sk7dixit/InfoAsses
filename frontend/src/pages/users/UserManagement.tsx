import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi, EmployeeStats } from '../../services/employee.api';
import { Employee, Role, EmploymentStatus } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import {
  UserPlus,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Boxes,
  Activity,
  Calendar,
  AlertCircle,
  Eye,
  Edit,
  UserX,
  X,
  CheckCircle2,
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phone: '',
    role: 'SALES' as Role,
    joiningDate: new Date().toISOString().split('T')[0],
    contractStart: '',
    contractEnd: '',
    status: 'ACTIVE' as EmploymentStatus,
    loginEnabled: true,
    password: '',
    notes: '',
  });

  const [formError, setFormError] = useState('');

  // Fetch Employees
  const { data: employeesRes, isLoading } = useQuery({
    queryKey: ['employees', searchTerm, roleFilter, statusFilter],
    queryFn: () =>
      employeeApi.getEmployees({
        search: searchTerm,
        role: (roleFilter as Role) || undefined,
        status: (statusFilter as EmploymentStatus) || undefined,
        limit: 100,
      }),
  });

  // Fetch Employee Stats
  const { data: statsRes } = useQuery({
    queryKey: ['employee-stats'],
    queryFn: () => employeeApi.getStats(),
  });

  const employees = employeesRes?.data || [];
  const stats: EmployeeStats = statsRes?.data || {
    total: employees.length || 24,
    active: 21,
    onContract: 2,
    inactive: 1,
    roles: { sales: 12, warehouse: 7, accounts: 4, admin: 1 },
  };

  // Sort Employees locally
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime();
    if (sortBy === 'oldest') return new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
    if (sortBy === 'contract') {
      if (!a.contractEnd) return 1;
      if (!b.contractEnd) return -1;
      return new Date(a.contractEnd).getTime() - new Date(b.contractEnd).getTime();
    }
    return 0;
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => employeeApi.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to create employee');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Employee>) => employeeApi.updateEmployee(selectedEmployee!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to update employee');
    },
  });

  // Toggle Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status, loginEnabled }: { id: string; status: EmploymentStatus; loginEnabled: boolean }) =>
      employeeApi.toggleStatus(id, { status, loginEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      setIsDisableModalOpen(false);
      setSelectedEmployee(null);
    },
  });

  const generateRoleEmployeeId = (targetRole: Role, allEmp: Employee[]) => {
    const rolePrefixMap: Record<Role, string> = {
      SALES: 'saleemp_',
      WAREHOUSE: 'whemp_',
      ACCOUNTS: 'acemp_',
      ADMIN: 'admin_emp_',
    };
    const prefix = rolePrefixMap[targetRole] || 'saleemp_';
    const sameRoleEmps = allEmp.filter(
      (e) => e.role === targetRole || e.employeeId.toLowerCase().startsWith(prefix.toLowerCase())
    );
    const nextNum = sameRoleEmps.length + 1;
    const padNum = String(nextNum).padStart(3, '0');
    return `${prefix}${padNum}`;
  };

  const resetForm = (targetRole: Role = 'SALES') => {
    const empId = generateRoleEmployeeId(targetRole, employees);
    setFormData({
      fullName: '',
      employeeId: empId,
      email: '',
      phone: '',
      role: targetRole,
      joiningDate: new Date().toISOString().split('T')[0],
      contractStart: '',
      contractEnd: '',
      status: 'ACTIVE',
      loginEnabled: true,
      password: '',
      notes: '',
    });
    setFormError('');
  };

  const handleRoleChange = (newRole: Role) => {
    const newEmpId = generateRoleEmployeeId(newRole, employees);
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      employeeId: newEmpId,
    }));
  };

  const handleOpenAddModal = () => {
    resetForm('SALES');
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setFormError('');
    updateMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      joiningDate: formData.joiningDate,
      contractStart: formData.contractStart || null,
      contractEnd: formData.contractEnd || null,
      status: formData.status,
      loginEnabled: formData.loginEnabled,
      notes: formData.notes,
    });
  };

  const handleDisableAccess = () => {
    if (!selectedEmployee) return;
    statusMutation.mutate({
      id: selectedEmployee.id,
      status: 'INACTIVE',
      loginEnabled: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Employees
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
              {stats.total} employees
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage employee accounts, roles, contract dates, and access permissions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenAddModal}
          icon={<UserPlus className="w-4 h-4" />}
        >
          Add Employee
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Employees</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Staff</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On Contract</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.onContract}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-slate-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inactive / Departed</p>
              <h3 className="text-2xl font-bold text-slate-600 mt-1">{stats.inactive}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* ROLE DISTRIBUTION SUMMARY BAR */}
      <div className="bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Role Distribution</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-medium">{stats.total} total accounts</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-700 font-medium">
          <span className="inline-flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Sales</span>
            <span className="font-bold text-slate-900">{stats.roles?.sales || 0}</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Warehouse</span>
            <span className="font-bold text-slate-900">{stats.roles?.warehouse || 0}</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Accounts</span>
            <span className="font-bold text-slate-900">{stats.roles?.accounts || 0}</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Admin</span>
            <span className="font-bold text-slate-900">{stats.roles?.admin || 0}</span>
          </span>
        </div>
      </div>

      {/* UNIFIED COMPACT HORIZONTAL TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-card">
        {/* Dominant 45-50% Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, employee ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 h-11 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all shadow-sm hover:border-slate-300"
          />
        </div>

        {/* Horizontal Filters (Role, Status, Sort) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto text-xs">
          <div className="w-full sm:w-36">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { label: 'All Roles', value: '' },
                { label: 'Sales', value: 'SALES' },
                { label: 'Warehouse', value: 'WAREHOUSE' },
                { label: 'Accounts', value: 'ACCOUNTS' },
                { label: 'Admin', value: 'ADMIN' },
              ]}
            />
          </div>

          <div className="w-full sm:w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'On Contract', value: 'ON_CONTRACT' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
            />
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { label: 'Sort: Newest first', value: 'newest' },
                { label: 'Sort: Oldest first', value: 'oldest' },
                { label: 'Sort: Name A–Z', value: 'name' },
                { label: 'Sort: Contract ending soon', value: 'contract' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : sortedEmployees.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No employee records found</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Employee ID</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Joining Date</th>
                  <th className="py-3.5 px-6">Contract</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{emp.fullName}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{emp.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold text-slate-700">{emp.employeeId}</td>
                    <td className="py-4 px-6">
                      <Badge variant={emp.role} />
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {new Date(emp.joiningDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {emp.contractEnd ? (
                        <span className="font-medium text-slate-700">
                          {new Date(emp.contractEnd).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Permanent</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : emp.status === 'ON_CONTRACT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setIsViewModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                        title="View details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setFormData({
                            fullName: emp.fullName,
                            employeeId: emp.employeeId,
                            email: emp.email,
                            phone: emp.phone,
                            role: emp.role,
                            joiningDate: new Date(emp.joiningDate).toISOString().split('T')[0],
                            contractStart: emp.contractStart ? new Date(emp.contractStart).toISOString().split('T')[0] : '',
                            contractEnd: emp.contractEnd ? new Date(emp.contractEnd).toISOString().split('T')[0] : '',
                            status: emp.status,
                            loginEnabled: emp.loginEnabled,
                            password: '',
                            notes: emp.notes || '',
                          });
                          setIsEditModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition-colors"
                        title="Edit employee"
                      >
                        Edit
                      </button>
                      {emp.status !== 'INACTIVE' && emp.role !== 'ADMIN' && (
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsDisableModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-semibold transition-colors"
                          title="Disable access"
                        >
                          Disable
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE EMPLOYEE MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Employee Record">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              required
            />
            <Input
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="EMP-014"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Work Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rahul@company.com"
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department / Role"
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value as Role)}
              options={[
                { label: 'Sales', value: 'SALES' },
                { label: 'Warehouse', value: 'WAREHOUSE' },
                { label: 'Accounts', value: 'ACCOUNTS' },
                { label: 'Admin', value: 'ADMIN' },
              ]}
            />

            <Select
              label="Employment Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'On Contract', value: 'ON_CONTRACT' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              required
            />
            <Input
              label="Contract Start"
              type="date"
              value={formData.contractStart}
              onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
            />
            <Input
              label="Contract End"
              type="date"
              value={formData.contractEnd}
              onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.loginEnabled}
                onChange={(e) => setFormData({ ...formData, loginEnabled: e.target.checked })}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Create Portal Login Credentials</span>
            </label>

            {formData.loginEnabled && (
              <div className="mt-3">
                <Input
                  label="Initial Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Set initial password (min 6 chars)"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={createMutation.isPending}>
              Create Employee
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Employee Detail Profile">
        {selectedEmployee && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedEmployee.fullName}</h3>
                <p className="text-slate-500 font-mono mt-0.5">{selectedEmployee.employeeId}</p>
              </div>
              <Badge variant={selectedEmployee.role} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</span>
                <p className="font-bold text-slate-900">{selectedEmployee.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Phone Number</span>
                <p className="font-bold text-slate-900">{selectedEmployee.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Joining Date</span>
                <p className="font-bold text-slate-900">{new Date(selectedEmployee.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Employment Status</span>
                <p className="font-bold text-slate-900">{selectedEmployee.status}</p>
              </div>
            </div>

            {selectedEmployee.contractEnd && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Contract Period</span>
                <p className="font-semibold text-amber-900">
                  {selectedEmployee.contractStart ? new Date(selectedEmployee.contractStart).toLocaleDateString() : 'N/A'} &rarr;{' '}
                  {new Date(selectedEmployee.contractEnd).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Portal Login Access:</span>
              <span className={`font-bold ${selectedEmployee.loginEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {selectedEmployee.loginEnabled ? 'Enabled ✓' : 'Disabled ✗'}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department / Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
              options={[
                { label: 'Sales', value: 'SALES' },
                { label: 'Warehouse', value: 'WAREHOUSE' },
                { label: 'Accounts', value: 'ACCOUNTS' },
                { label: 'Admin', value: 'ADMIN' },
              ]}
            />

            <Select
              label="Employment Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'On Contract', value: 'ON_CONTRACT' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            />
            <Input
              label="Contract Start"
              type="date"
              value={formData.contractStart}
              onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
            />
            <Input
              label="Contract End"
              type="date"
              value={formData.contractEnd}
              onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* DISABLE ACCESS CONFIRMATION MODAL */}
      <Modal isOpen={isDisableModalOpen} onClose={() => setIsDisableModalOpen(false)} title="Disable Employee Access">
        {selectedEmployee && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Disable portal access for {selectedEmployee.fullName}?</span>
              </div>
              <p className="leading-relaxed text-rose-700">
                {selectedEmployee.fullName} ({selectedEmployee.employeeId}) will no longer be able to sign in to the operations portal. Historical records will be preserved.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button variant="ghost" onClick={() => setIsDisableModalOpen(false)}>
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleDisableAccess}
                isLoading={statusMutation.isPending}
              >
                Disable Access
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
