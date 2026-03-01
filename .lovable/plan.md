

## Fix Booking Save + Build Errors

### Problems Found

1. **Booking not saving to database**: `BookingPage.tsx` sends inquiries to Web3Forms and a local `/api/bookings` endpoint, but never inserts into the Supabase `booking_inquiries` table. It also never calls the `send-booking-notification` edge function.

2. **Account page broken (TS2769)**: `Account.tsx` queries a `profiles` table that doesn't exist in the database schema.

3. **Edge function type errors (TS18046)**: `err` and `error` variables are typed as `unknown` in `bookings/index.ts` and `send-booking-notification/index.ts` -- need explicit type casting.

---

### Plan

#### 1. Fix BookingPage.tsx -- save to Supabase + send notification

Replace the Web3Forms + local API logic with:
- `supabase.from('booking_inquiries').insert(...)` to persist the inquiry
- `supabase.functions.invoke('send-booking-notification', { body: ... })` to email payments@divinginasia.com
- Keep the PayPal payment link flow as-is

#### 2. Fix Account.tsx -- remove profiles query

Remove the `profiles` table query since it doesn't exist. Use only the auth user data (`user.id`, `user.email`, `user.created_at`).

#### 3. Fix edge function type errors

- In `bookings/index.ts` line 54: cast `err` to `Error` -- `(err as Error).message`
- In `send-booking-notification/index.ts` line 58: cast `error` to `Error` -- `(error as Error).message`

---

### Technical Details

**BookingPage.tsx `onSubmit` replacement:**
```text
1. Insert into booking_inquiries via Supabase client (name, email, phone, course_title, preferred_date, experience_level, message)
2. Invoke send-booking-notification edge function with booking details
3. Show PayPal link or navigate home based on payment choice
```

**Account.tsx fix:**
Remove lines 30-34 (profiles query) and build user object directly from auth data only.

