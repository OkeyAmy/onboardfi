import React, { useState, useEffect, useRef } from 'react';
import { OnboardNavbar } from '@/components/OnboardNavbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { simulatedQuests } from '@/data/simulatedQuests';
import gsap from 'gsap';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  background_image_url: string;
}

const QuestCard = ({
  quest,
  type,
  isCreated,
  onDelete,
}: {
  quest: any;
  type: 'simulated' | 'db';
  isCreated?: boolean;
  onDelete?: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const isSimulated = type === 'simulated';

  return (
    <div
      className="relative cursor-pointer group"
      onClick={() => navigate(isSimulated ? `/quest/${quest.id}` : isCreated ? `/event/${quest.id}/edit` : `/quest/${quest.id}`)}
    >
      <div className="overflow-hidden mb-3">
        <div
          className="aspect-[4/3] bg-muted bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${isSimulated ? quest.backgroundImage : quest.background_image_url})` }}
        />
      </div>
      <div className="absolute top-4 left-4 flex flex-col gap-0">
        {isSimulated ? (
          <div className="px-3 h-[23px] flex items-center" style={{ backgroundColor: quest.difficulty === 'Beginner' ? '#00ff88' : quest.difficulty === 'Intermediate' ? '#f59e0b' : '#ef4444' }}>
            <div className="text-[11px] font-bold uppercase leading-none text-black">{quest.difficulty}</div>
          </div>
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
      {isCreated && !isSimulated && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this quest?')) onDelete(quest.id); }}
          className="absolute top-4 right-4 bg-background border border-foreground p-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      {isSimulated && (
        <div className="absolute top-4 right-4">
          <img src={quest.hostAvatar} alt={quest.hostName} className="w-8 h-8 rounded-full border-2 border-background" />
        </div>
      )}
      <h3 className="text-base font-medium text-foreground">{quest.title}</h3>
      {isSimulated && <p className="text-xs text-muted-foreground mt-0.5">{quest.reward}</p>}
    </div>
  );
};

const MyEvents = () => {
  const [user, setUser] = useState<User | null>(null);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'registered' | 'simulated'>('simulated');
  const [slideStyle, setSlideStyle] = useState({ width: 0, transform: 'translateX(0)' });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate('/'); return; }
      setUser(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) { navigate('/'); return; }
      setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user]);

  useEffect(() => {
    const btn = tabRefs.current[activeTab];
    if (btn) {
      setSlideStyle({ width: btn.offsetWidth, transform: `translateX(${btn.offsetLeft}px)` });
    }
  }, [activeTab, createdEvents.length, registeredEvents.length]);

  const fetchMyEvents = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: created } = await supabase.from('events').select('id, title, date, time, background_image_url').eq('created_by', user.id).order('target_date', { ascending: true });
      setCreatedEvents(created || []);
      const { data: registrations } = await supabase.from('event_registrations').select('event_id, events (id, title, date, time, background_image_url)').eq('user_id', user.id);
      setRegisteredEvents(registrations?.map(r => r.events).filter(Boolean) as Event[] || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
      toast.success('Quest deleted');
      fetchMyEvents();
    } catch { toast.error('Failed to delete quest'); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="My Quests" description="Manage your quests and track progress" />
      <OnboardNavbar />

      <div className="flex-1 pt-28 md:pt-36 pb-16 px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-8">My Quests</h1>

        {/* Tabs */}
        <div className="relative flex gap-0 mb-12">
          <div className="absolute top-0 left-0 h-full bg-[#00ff88] border border-foreground transition-all duration-300 ease-out pointer-events-none" style={{ width: slideStyle.width, transform: slideStyle.transform }} />
          {(['simulated', 'created', 'registered'] as const).map(tab => (
            <button
              key={tab}
              ref={el => { tabRefs.current[tab] = el; }}
              onClick={() => setActiveTab(tab)}
              className="relative z-10 px-6 py-3 text-[11px] font-medium uppercase text-foreground border border-foreground transition-colors max-sm:flex-1 bg-transparent first:border-r-0 last:border-l-0"
            >
              {tab === 'simulated' ? `Quests (${simulatedQuests.length})` : tab === 'created' ? `Created (${createdEvents.length})` : `Registered (${registeredEvents.length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {activeTab === 'simulated' ? (
            simulatedQuests.map((q, i) => (
              <div key={q.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
                <QuestCard quest={q} type="simulated" />
              </div>
            ))
          ) : loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">Loading...</div>
          ) : (activeTab === 'created' ? createdEvents : registeredEvents).length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {activeTab === 'created' ? "You haven't created any quests yet" : "You haven't registered for any quests yet"}
            </div>
          ) : (
            (activeTab === 'created' ? createdEvents : registeredEvents).map(event => (
              <QuestCard key={event.id} quest={event} type="db" isCreated={activeTab === 'created'} onDelete={activeTab === 'created' ? handleDeleteEvent : undefined} />
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyEvents;
