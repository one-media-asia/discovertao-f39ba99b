import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Contact from '@/components/Contact';

export default function MSDTProgram() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">PADI MSDT Program</h1>
          <p className="text-xl text-muted-foreground">
            Master Scuba Diver Trainer • Koh Tao, Thailand
          </p>
        </div>

        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">What is the PADI MSDT?</h2>
          <p className="text-muted-foreground mb-4">
            The PADI Master Scuba Diver Trainer (MSDT) rating is the next step after becoming a PADI Open Water Scuba Instructor (OWSI). It demonstrates that you have training experience and have diversified your teaching abilities by earning 5 or more PADI Specialty Instructor ratings.
          </p>
          <p className="text-muted-foreground">
            The MSDT rating makes you more marketable as a dive professional and opens up additional career opportunities in the scuba diving industry worldwide.
          </p>
        </Card>

        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">•</span>
              <span>PADI Open Water Scuba Instructor (OWSI) certification</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">•</span>
              <span>Minimum 25 PADI certifications issued (any combination of courses)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">•</span>
              <span>5 or more PADI Specialty Instructor ratings</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">•</span>
              <span>Current PADI Teaching status and insurance</span>
            </li>
          </ul>
        </Card>

        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">MSDT Preparation Program</h2>
          <p className="text-muted-foreground mb-4">
            Our MSDT Preparation Program helps you earn the Specialty Instructor ratings you need to qualify. We offer a wide range of Specialty Instructor courses that you can complete on Koh Tao.
          </p>
          <p className="text-muted-foreground mb-6">
            Work with our experienced Course Directors to develop your teaching skills across multiple specialty areas, gaining hands-on experience in the best diving conditions.
          </p>

          <h3 className="text-xl font-semibold mb-4">Available Specialty Instructor Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Deep Diver Instructor',
              'Wreck Diver Instructor',
              'Enriched Air (Nitrox) Instructor',
              'Night Diver Instructor',
              'Peak Performance Buoyancy Instructor',
              'Search & Recovery Instructor',
              'Underwater Navigator Instructor',
              'Fish Identification Instructor',
              'Boat Diver Instructor',
              'Equipment Specialist Instructor',
              'Sidemount Instructor',
              'DPV Instructor',
              'Self Reliant Diver Instructor',
              'Emergency Oxygen Provider Instructor',
            ].map((specialty) => (
              <div key={specialty} className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">{specialty}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-8 p-6 bg-primary/5">
          <h2 className="text-2xl font-bold mb-4">MSDT Package Pricing</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Individual Specialty Instructor Course</span>
              <span className="text-2xl font-bold text-primary">฿8,500</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">3 Specialty Instructor Package</span>
              <span className="text-2xl font-bold text-primary">฿22,500</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">5 Specialty Instructor Package (MSDT Prep)</span>
              <span className="text-2xl font-bold text-primary">฿35,000</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            All prices include PADI materials, certification fees, and equipment rental. PADI membership fees not included.
          </p>
        </Card>

        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Why Get Your MSDT on Koh Tao?</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">✓</span>
              <span>Work with PADI Course Directors with 20+ years experience</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">✓</span>
              <span>Diverse dive sites perfect for specialty training</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">✓</span>
              <span>Year-round warm water diving conditions</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">✓</span>
              <span>Gain real teaching experience with student divers</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">✓</span>
              <span>Affordable living costs while training</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 font-bold">✓</span>
              <span>Flexible scheduling to fit your timeline</span>
            </li>
          </ul>
        </Card>

        <Card className="mb-8 p-6 bg-primary/10">
          <h2 className="text-2xl font-bold mb-6">Ready to Become an MSDT?</h2>
          <p className="text-muted-foreground mb-4">
            Take the next step in your dive career. Contact us to discuss your current certifications and create a personalized MSDT preparation plan.
          </p>
          <Button size="lg" onClick={() => navigate('/booking?course=msdt-program')}>
            Enquire Now
          </Button>
        </Card>

        <div className="mt-12">
          <Contact />
        </div>
      </div>
    </main>
  );
}
