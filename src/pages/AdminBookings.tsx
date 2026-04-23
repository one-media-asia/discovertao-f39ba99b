import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, RefreshCw, LogOut, ArrowLeft, CheckCircle2, Clock, XCircle, CheckSquare, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type PaymentStatus = 'pending' | 'paid' | 'refunded';
type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  inquiry_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  course_title: string;
  booking_date: string | null;
  amount: number | null;
  currency: string;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  payment_reference: string | null;
  notes: string | null;
  created_at: string;
}

type StatusFilter = 'all' | BookingStatus;

const paymentBadge = (s: PaymentStatus) => {
  switch (s) {
    case 'paid':
      return <Badge className="bg-primary text-primary-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>;
    case 'refunded':
      return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Refunded</Badge>;
    default:
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  }
};

const statusBadge = (s: BookingStatus) => {
  switch (s) {
    case 'confirmed':
      return <Badge variant="default">Confirmed</Badge>;
    case 'completed':
      return <Badge className="bg-accent text-accent-foreground">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
  }
};

const AdminBookings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    void checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
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
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .in('booking_status', ['confirmed', 'completed', 'cancelled'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
        return;
      }
      setBookings((data || []) as Booking[]);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBooking = async (
    id: string,
    updates: { booking_status?: BookingStatus; payment_status?: PaymentStatus },
    successMessage: string,
  ) => {
    const { error } = await supabase.from('bookings').update(updates).eq('id', id);
    if (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update booking');
      return;
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    );
    toast.success(successMessage);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (filter !== 'all' && b.booking_status !== filter) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.course_title.toLowerCase().includes(q) ||
        (b.phone || '').toLowerCase().includes(q) ||
        (b.payment_reference || '').toLowerCase().includes(q)
      );
    });
  }, [bookings, search, filter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Inquiries
            </Button>
            <h1 className="text-2xl font-bold">Bookings</h1>
          </div>
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
            <CardTitle>Confirmed & Completed Bookings ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, course, phone, or payment ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Created</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ref</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {format(new Date(b.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="font-medium">{b.name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${b.email}`} className="text-primary hover:underline">
                            {b.email}
                          </a>
                        </TableCell>
                        <TableCell>{b.phone || '-'}</TableCell>
                        <TableCell>{b.course_title}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {b.booking_date ? format(new Date(b.booking_date), 'MMM d, yyyy') : '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {b.amount != null ? `${b.currency} ${Number(b.amount).toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>{paymentBadge(b.payment_status)}</TableCell>
                        <TableCell>{statusBadge(b.booking_status)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {b.payment_reference || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={b.booking_status === 'completed'}
                              onClick={() =>
                                updateBooking(
                                  b.id,
                                  { booking_status: 'completed' },
                                  'Booking marked as completed',
                                )
                              }
                            >
                              <CheckSquare className="h-3.5 w-3.5 mr-1" /> Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={b.payment_status === 'refunded'}
                              onClick={() =>
                                updateBooking(
                                  b.id,
                                  { payment_status: 'refunded', booking_status: 'cancelled' },
                                  'Booking refunded',
                                )
                              }
                            >
                              <Undo2 className="h-3.5 w-3.5 mr-1" /> Refund
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
    </div>
  );
};

export default AdminBookings;
