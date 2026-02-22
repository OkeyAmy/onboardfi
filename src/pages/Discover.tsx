import React, { useState, useEffect, useRef } from 'react';
import { OnboardNavbar } from '@/components/OnboardNavbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { EventsCarousel } from '@/components/EventsCarousel';
import Footer from '@/components/Footer';
import gsap from 'gsap';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  background_image_url: string;
  target_date: string;
  address: string;
}

const QuestCard = ({ event }: { event: Event }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative cursor-pointer group"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="overflow-hidden mb-3">
        <div
          className="aspect-square bg-muted bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${event.background_image_url})` }}
        />
      </div>
      <div className="absolute top-4 left-4 flex flex-col gap-0">
        <div className="bg-background border border-foreground px-3 h-[23px] flex items-center">
          <div className="text-[11px] font-medium uppercase leading-none text-foreground">{event.date}</div>
        </div>
        <div className="bg-background border border-t-0 border-foreground px-3 h-[23px] flex items-center">
          <div className="text-[11px] font-medium leading-none text-foreground">{event.time}</div>
        </div>
      </div>
      <h3 className="text-lg font-medium text-foreground">{event.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{event.address}</p>
    </div>
  );
};

const Discover = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll('.gsap-hero');
    gsap.fromTo(
      els,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    );
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, background_image_url, target_date, address')
        .order('target_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date().getTime();
    const target = new Date(event.target_date).getTime();
    const oneHour = 1000 * 60 * 60;
    return target >= now - oneHour;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="OnboardFi — Protocol Aligned Learning Infrastructure"
        description="Turn Web3 documentation into verifiable, rewardable onchain tasks. Learn, verify, and earn."
        keywords="web3, onboarding, learn to earn, onchain tasks, protocol learning, documentation"
      />
      <OnboardNavbar />

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 md:pt-44 lg:pt-52 pb-8 md:pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="gsap-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground tracking-tight leading-[1.05]">
            <span className="inline-block border border-foreground px-3 md:px-6 py-2 md:py-3">Learn.</span>
            <span className="inline-block bg-[#00ff88] text-black border border-foreground px-3 md:px-6 py-2 md:py-3 -ml-px">Verify.</span>
            <span className="inline-block border border-foreground px-3 md:px-6 py-2 md:py-3 -ml-px">Earn.</span>
          </h1>
          <p className="gsap-hero mt-6 md:mt-10 text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl">
            A protocol that turns Web3 documentation into verifiable, rewardable onchain tasks. Complete quests, prove your skills, get rewarded.
          </p>
          <div className="gsap-hero mt-8 flex flex-wrap gap-3">
            <div className="border border-foreground px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-foreground">
              Interactive Docs
            </div>
            <div className="border border-foreground px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-foreground">
              Onchain Verification
            </div>
            <div className="border border-foreground px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-foreground">
              Token Rewards
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quests Carousel */}
      <EventsCarousel />

      {/* All Quests Grid */}
      <section id="quests-section" className="px-4 md:px-8 pb-16 pt-6 md:pt-16 flex-1">
        <div>
          <div className="flex flex-wrap items-center gap-0 mb-8">
            <h2 className="text-base md:text-lg lg:text-xl font-normal text-foreground">Active Quests</h2>
            <span className="text-base md:text-lg lg:text-xl font-normal border border-foreground px-2 py-1 ml-2 text-foreground">
              {filteredEvents.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading quests...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No active quests found
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <QuestCard event={event} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Discover;
