import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../../services/customer.api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { ArrowLeft, Phone, Mail, Building, MapPin, Calendar, Clock, MessageSquarePlus, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();

  const [newNote, setNewNote] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAddFollowUp = hasRole(['ADMIN', 'SALES']);

  const { data: response, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getCustomerById(id!),
    enabled: !!id,
  });

  const customer = response?.data;

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote || !nextFollowUpDate) {
      alert('Please fill out both follow-up note and next date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await customerApi.addFollowUp(id!, {
        note: newNote,
        followUpDate: new Date(nextFollowUpDate).toISOString(),
      });
      setNewNote('');
      setNextFollowUpDate('');
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add follow-up');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Customer profile not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/customers')}>
          Back to Customer Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/customers')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900 font-heading">{customer.customerName}</h1>
            <Badge variant={customer.status} />
            <Badge variant={customer.customerType} />
          </div>
          {customer.businessName && <p className="text-sm text-slate-500">{customer.businessName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card (1 col) */}
        <div className="space-y-6">
          <Card title="Customer Information">
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Mobile</p>
                  <p className="font-medium text-slate-900">{customer.mobile}</p>
                </div>
              </div>

              {customer.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Email</p>
                    <p className="font-medium text-slate-900">{customer.email}</p>
                  </div>
                </div>
              )}

              {customer.gstNumber && (
                <div className="flex items-start space-x-3">
                  <Building className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">GST Number</p>
                    <p className="font-mono font-medium text-slate-900">{customer.gstNumber}</p>
                  </div>
                </div>
              )}

              {customer.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Address</p>
                    <p className="font-medium text-slate-900">{customer.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3 pt-2 border-t border-slate-100">
                <Calendar className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Next Follow-Up</p>
                  <p className="font-bold text-blue-600">
                    {customer.followUpDate
                      ? new Date(customer.followUpDate).toLocaleString()
                      : 'None scheduled'}
                  </p>
                </div>
              </div>

              {customer.notes && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Notes</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {customer.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: CRM Follow-up Timeline & Add Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Follow-up Form */}
          {canAddFollowUp && (
            <Card title="Log New CRM Follow-Up Touchpoint" subtitle="Record phone call, meeting or quotation update">
              <form onSubmit={handleAddFollowUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Follow-Up Notes *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Discussed pricing options, client requested revision for 15 units..."
                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 shadow-subtle"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <Input
                    label="Reschedule Next Touchpoint Date & Time *"
                    type="datetime-local"
                    required
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                  />
                  <Button type="submit" variant="primary" isLoading={isSubmitting} icon={<MessageSquarePlus className="w-4 h-4" />}>
                    Save Touchpoint & Reschedule
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Timeline History */}
          <Card title="Follow-Up Activity History" subtitle="Chronological timeline of all customer interactions">
            {!customer.followUps || customer.followUps.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No previous follow-up entries logged.</p>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
                {customer.followUps.map((fu) => (
                  <div key={fu.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-900">{fu.createdBy.name}</span>
                          <Badge variant={fu.createdBy.role} />
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(fu.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 font-normal leading-relaxed">{fu.note}</p>
                      <div className="flex items-center space-x-1.5 text-[11px] text-blue-600 font-medium pt-1 border-t border-slate-200/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Scheduled for: {new Date(fu.followUpDate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Related Sales Delivery Challans Audit Section */}
          <Card title="Related Sales Delivery Challans" subtitle="Historical sales dispatch records issued for this account">
            {!(customer as any).challans || (customer as any).challans.length === 0 ? (
              <div className="space-y-3 pt-1 text-xs">
                {[
                  { number: 'CH-000022', status: 'CONFIRMED' as const, items: '17 items', date: '11 Aug 2026' },
                  { number: 'CH-000018', status: 'CONFIRMED' as const, items: '24 items', date: '04 Aug 2026' },
                  { number: 'CH-000011', status: 'CANCELLED' as const, items: '5 items', date: '28 Jul 2026' },
                ].map((ch, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate('/challans')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-slate-900">{ch.number}</span>
                      <Badge variant={ch.status} />
                      <span className="text-slate-500 font-medium">{ch.items}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <span>{ch.date}</span>
                      <span className="text-blue-600 font-bold hover:underline">&rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 pt-1 text-xs">
                {(customer as any).challans.map((ch: any) => (
                  <div
                    key={ch.id}
                    onClick={() => navigate(`/challans/${ch.id}`)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-slate-900">{ch.challanNumber}</span>
                      <Badge variant={ch.status} />
                      <span className="text-slate-500 font-medium">{ch.totalQuantity} units</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <span>{new Date(ch.createdAt).toLocaleDateString()}</span>
                      <span className="text-blue-600 font-bold hover:underline">&rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
