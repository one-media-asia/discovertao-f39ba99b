import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const FunDivingSection = () => {
  const navigate = useNavigate();

  const trips = [
    {
      title: 'Fun Dive',
      badge: 'Recreational',
      image: '/images/photo-1682687982423-295485af248a.avif',
      duration: 'Half day — 2 dives',
      description: 'Guided dives to nearby reefs — suitable for certified divers of all levels.',
      price: '฿2,000',
      bookingItem: 'Fun Dive',
      deposit: 500,
    },
    {
      title: 'Discover Scuba (Try Dive)',
      badge: 'Beginner',
      image: '/images/photo-1659518893171-b15e20a8e201.avif',
      duration: 'Half day — introduction dive',
      description: 'Perfect for first-timers — pool skills followed by a shallow guided dive.',
      price: '฿1,000',
      bookingItem: 'Discover Scuba',
      deposit: 1000,
    },
    {
      title: 'Sail Rock Special',
      badge: 'Full Day',
      image: '/images/photo-1618865181016-a80ad83a06d3.avif',
      duration: 'Full day — 3 dives with lunch',
      description: 'Full day offshore trip to Sail Rock — chances for whalesharks and large pelagics.',
      price: '฿2,900',
      bookingItem: 'Sail Rock Special',
      deposit: 1500,
    },
  ];

  return (
    <section id="fun-diving" className="py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 sm:px-[24px]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Fun Diving Koh Tao</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Already certified? Join our guided fun diving trips and explore Koh Tao's best dive sites with experienced PADI dive guides.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {trips.map((trip, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{trip.title}</CardTitle>
                  <Badge>{trip.badge}</Badge>
                </div>
                <CardDescription>{trip.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">{trip.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{trip.price}</span>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/booking?item=${encodeURIComponent(trip.bookingItem)}&type=dive&deposit=${trip.deposit}&currency=THB`
                      )
                    }
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => navigate('/fun-diving-koh-tao')}>
            View All Fun Diving Options
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FunDivingSection;
