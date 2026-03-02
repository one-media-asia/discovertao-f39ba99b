import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Contact from '@/components/Contact';

const idcDates = [
  { start: 'April 7, 2026', end: 'April 24, 2026', ieDate: 'April 27–28, 2026', status: 'open' as const, spots: 6 },
  { start: 'June 2, 2026', end: 'June 19, 2026', ieDate: 'June 22–23, 2026', status: 'open' as const, spots: 8 },
  { start: 'August 4, 2026', end: 'August 21, 2026', ieDate: 'August 24–25, 2026', status: 'open' as const, spots: 8 },
  { start: 'October 5, 2026', end: 'October 22, 2026', ieDate: 'October 26–27, 2026', status: 'open' as const, spots: 8 },
  { start: 'December 7, 2026', end: 'December 24, 2026', ieDate: 'January 4–5, 2027', status: 'open' as const, spots: 8 },
];

export default function IDCSchedule() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">PADI IDC Schedule & Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Instructor Development Course • Koh Tao, Thailand
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">About the PADI IDC</h2>
          <p className="text-muted-foreground mb-4">
            The PADI Instructor Development Course (IDC) is your pathway to becoming a PADI Open Water Scuba Instructor (OWSI). Our IDC is led by a PADI Course Director with over 20 years of experience and includes both the Assistant Instructor (AI) and Open Water Scuba Instructor (OWSI) programs.
          </p>
          <p className="text-muted-foreground">
            Each IDC runs for approximately 3 weeks, followed by the PADI Instructor Examination (IE) conducted by an independent PADI Examiner. Our pass rates are consistently among the highest in Asia.
          </p>
        </Card>

        {/* Schedule */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          2026 IDC Dates
        </h2>
        <div className="space-y-4 mb-12">
          {idcDates.map((idc, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">IDC #{idx + 1}</h3>
                    <Badge variant={idc.spots <= 3 ? 'destructive' : 'default'}>
                      {idc.spots} spots available
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span><strong>IDC:</strong> {idc.start} – {idc.end}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span><strong>IE:</strong> {idc.ieDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Koh Tao, Thailand</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    navigate(
                      `/booking?item=${encodeURIComponent(`PADI IDC – ${idc.start}`)}&type=course&deposit=10000&currency=THB`
                    )
                  }
                >
                  Reserve Spot
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pricing */}
        <Card className="mb-8 p-6 bg-primary/5">
          <h2 className="text-2xl font-bold mb-6">IDC Pricing</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <span className="font-semibold">Full IDC (AI + OWSI)</span>
                <p className="text-sm text-muted-foreground">Includes all materials & certification</p>
              </div>
              <span className="text-2xl font-bold text-primary">฿65,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <span className="font-semibold">OWSI Only (already AI certified)</span>
                <p className="text-sm text-muted-foreground">Upgrade from Assistant Instructor</p>
              </div>
              <span className="text-2xl font-bold text-primary">฿45,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <span className="font-semibold">PADI IE Fee</span>
                <p className="text-sm text-muted-foreground">Paid directly to PADI</p>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">~AUD $920</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">IDC + EFRI + 5 Specialties (MSDT Prep)</span>
                <p className="text-sm text-muted-foreground">Complete career package</p>
              </div>
              <span className="text-2xl font-bold text-primary">฿95,000</span>
            </div>
          </div>
        </Card>

        {/* What's Included */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> PADI IDC Digital Crewpak</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> All course materials & slates</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> Equipment rental throughout</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> Boat & dive fees</li>
            </ul>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> PADI AI & OWSI application fees</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> Pre-IDC prep & mentoring</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> IE preparation workshops</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" /> Resume & career guidance</li>
            </ul>
          </div>
        </Card>

        {/* Prerequisites */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> PADI Divemaster certification (or equivalent from another agency)</li>
            <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Minimum 60 logged dives (100+ recommended)</li>
            <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Current EFR/First Aid certification (within 24 months)</li>
            <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Medical clearance for diving</li>
            <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Minimum 18 years old</li>
          </ul>
        </Card>

        {/* CTA */}
        <Card className="mb-8 p-6 bg-primary/10">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Instructor Career?</h2>
          <p className="text-muted-foreground mb-6">
            Send us your diving resume and preferred IDC dates. We'll review your experience and create a personalized preparation plan.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate('/booking?course=padi-idc')}>
              Apply Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/courses/instructor')}>
              View Instructor Course Details
            </Button>
          </div>
        </Card>

        <div className="mt-12">
          <Contact />
        </div>
      </div>
    </main>
  );
}
