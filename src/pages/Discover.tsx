import React, { useState, useEffect, useRef } from 'react';
import { OnboardNavbar } from '@/components/OnboardNavbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import Footer from '@/components/Footer';
import TextType from '@/components/TextType';
import { simulatedQuests } from '@/data/simulatedQuests';
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

const QuestCard = ({ quest, type = 'simulated' }: { quest: any; type?: 'simulated' | 'db' }) => {
  const navigate = useNavigate();
  const isSimulated = type === 'simulated';

  return (
    <div
      className="relative cursor-pointer group"
      onClick={() => navigate(isSimulated ? `/quest/${quest.id}` : `/quest/${quest.id}`)}
    >
      <div className="overflow-hidden mb-3">
        <div
          className="aspect-square bg-muted bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${isSimulated ? quest.backgroundImage : quest.background_image_url})` }}
        />
      </div>

      {/* Tags / Date */}
      <div className="absolute top-4 left-4 flex flex-col gap-0">
        {isSimulated ? (
          <>
            <div className="px-3 h-[23px] flex items-center" style={{ backgroundColor: quest.difficulty === 'Beginner' ? '#00ff88' : quest.difficulty === 'Intermediate' ? '#f59e0b' : '#ef4444' }}>
              <div className="text-[11px] font-bold uppercase leading-none text-black">{quest.difficulty}</div>
            </div>
            <div className="bg-background border border-foreground px-3 h-[23px] flex items-center">
              <div className="text-[11px] font-medium leading-none text-foreground">{quest.category}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-background border border-foreground px-3 h-[23px] flex items-center">
              <div className="text-[11px] font-medium uppercase leading-none text-foreground">{quest.date}</div>
            </div>
            <div className="bg-background border border-t-0 border-foreground px-3 h-[23px] flex items-center">
              <div className="text-[11px] font-medium leading-none text-foreground">{quest.time}</div>
            </div>
          </>
        )}
      </div>

      {/* Host avatar */}
      {isSimulated && (
        <div className="absolute top-4 right-4">
          <img src={quest.hostAvatar} alt={quest.hostName} className="w-8 h-8 rounded-full border-2 border-background" />
        </div>
      )}

      <h3 className="text-lg font-medium text-foreground">{isSimulated ? quest.title : quest.title}</h3>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-muted-foreground">{isSimulated ? quest.hostName : quest.address}</p>
        {isSimulated && <p className="text-xs font-medium text-foreground">{quest.reward}</p>}
      </div>
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
    gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
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
          <div className="gsap-hero mt-6 md:mt-10 text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl h-16">
            <TextType
              texts={[
                "Turn Web3 documentation into verifiable, rewardable onchain tasks.",
                "Complete quests, prove your skills, get rewarded.",
                "Protocol Aligned Learning Infrastructure.",
              ]}
              typingSpeed={40}
              deletingSpeed={25}
              pauseDuration={2000}
              showCursor
              cursorCharacter="_"
            />
          </div>
          <div className="gsap-hero mt-8 flex flex-wrap gap-3">
            <div className="border border-foreground px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-foreground">Interactive Docs</div>
            <div className="border border-foreground px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-foreground">Onchain Verification</div>
            <div className="border border-foreground px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-foreground">Token Rewards</div>
          </div>
        </div>
      </section>

      {/* Featured Quests (Simulated) */}
      <section className="px-4 md:px-8 pb-8 pt-6 md:pt-8">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-base md:text-lg lg:text-xl font-normal text-foreground">Featured Quests</h2>
          <span className="text-base md:text-lg lg:text-xl font-normal border border-foreground px-2 py-1 text-foreground">{simulatedQuests.length}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {simulatedQuests.map((quest, index) => (
            <div key={quest.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}>
              <QuestCard quest={quest} type="simulated" />
            </div>
          ))}
        </div>
      </section>

      {/* DB Events */}
      {filteredEvents.length > 0 && (
        <section className="px-4 md:px-8 pb-16 pt-6 md:pt-8 flex-1">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-base md:text-lg lg:text-xl font-normal text-foreground">Community Quests</h2>
            <span className="text-base md:text-lg lg:text-xl font-normal border border-foreground px-2 py-1 text-foreground">{filteredEvents.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading quests...</div>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}>
                  <QuestCard quest={event} type="db" />
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Discover;
