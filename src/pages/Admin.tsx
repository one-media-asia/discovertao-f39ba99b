import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Trash2, RefreshCw, Users, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BookingInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  course_title: string;
  preferred_date: string | null;
  experience_level: string | null;
  message: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingInquiry[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    // Check admin role
    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!role) {
      toast.error('Admin access required');
      navigate('/admin/login');
      return;
    }
    await fetchBookings();
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
        return;
      }
      setBookings(data || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase
        .from('booking_inquiries')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      await fetchBookings();
      setDeleteId(null);
      toast.success('Booking deleted successfully');
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  const handleSendInvoice = async (booking: BookingInquiry) => {
    try {
      const payload = {
        access_key: 'e4c4edf6-6e35-456a-87da-b32b961b449a',
        to: booking.email,
        subject: `Invoice: ${booking.course_title}`,
        name: booking.name,
        message: `Hello ${booking.name},\n\nThis is your invoice for ${booking.course_title}.\nAmount: ${booking.message || 'TBD'}\n\nIf you have paid, please reply with confirmation.\n\nThanks,\nDiving In Asia`,
        cc: 'payments@divinginasia.com',
      } as any;

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        toast.success('Invoice sent');
      } else {
        toast.error('Failed to send invoice');
      }
    } catch {
      toast.error('Failed to send invoice');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={fetchBookings} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Booking Inquiries ({bookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No booking inquiries found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Course/Dive</TableHead>
                      <TableHead>Preferred Date</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(booking.created_at), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${booking.email}`} className="text-blue-600 hover:underline">
                            {booking.email}
                          </a>
                        </TableCell>
                        <TableCell>{booking.phone || '-'}</TableCell>
                        <TableCell>{booking.course_title}</TableCell>
                        <TableCell>
                          {booking.preferred_date
                            ? format(new Date(booking.preferred_date), 'MMM d, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>{booking.experience_level || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate" title={booking.message || ''}>
                          {booking.message || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(booking.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleSendInvoice(booking)}>
                              Send Invoice
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking inquiry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteBooking}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
