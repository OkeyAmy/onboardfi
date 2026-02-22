import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OnboardNavbar } from '@/components/OnboardNavbar';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { simulatedQuests, SimulatedQuest, QuestStep } from '@/data/simulatedQuests';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';

const difficultyColor: Record<string, string> = {
  Beginner: '#00ff88',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

const actionTypeIcon: Record<string, string> = {
  deploy: '🚀',
  interact: '⚡',
  sign: '✍️',
  bridge: '🌉',
  verify: '✅',
};

const QuestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [dbEvent, setDbEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if this is a simulated quest or a DB event
  const simulatedQuest = simulatedQuests.find(q => q.id === id);

  useEffect(() => {
    if (!simulatedQuest && id) {
      // Fetch from DB
      supabase.from('events').select('*').eq('id', id).maybeSingle().then(({ data }) => {
        setDbEvent(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, simulatedQuest]);

  useEffect(() => {
    gsap.fromTo('.quest-detail-animate', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
  }, [loading]);

  const handleCompleteStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    toast({ title: 'Step Completed!', description: 'Verification successful. Moving to next step.' });
    
    if (simulatedQuest && currentStep < simulatedQuest.steps.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 800);
    }
  };

  const allStepsCompleted = simulatedQuest
    ? simulatedQuest.steps.every(s => completedSteps.has(s.id))
    : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground">Loading quest...</span>
      </div>
    );
  }

  // If it's a DB event (not simulated), show a simple detail view
  if (!simulatedQuest && dbEvent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEOHead title={dbEvent.title} description={dbEvent.description?.substring(0, 160)} />
        <OnboardNavbar />
        <main className="flex-1 pt-28 md:pt-36 px-4 md:px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/')} className="text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors">← Back to Discover</button>
            <div className="aspect-video bg-muted bg-cover bg-center mb-8" style={{ backgroundImage: `url(${dbEvent.background_image_url})` }} />
            <h1 className="text-3xl md:text-5xl font-medium text-foreground mb-4">{dbEvent.title}</h1>
            <div className="flex gap-3 mb-6">
              <span className="border border-foreground px-3 py-1 text-[11px] uppercase font-medium">{dbEvent.date}</span>
              <span className="border border-foreground px-3 py-1 text-[11px] uppercase font-medium">{dbEvent.time}</span>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">{dbEvent.description}</p>
            <p className="text-sm text-muted-foreground">{dbEvent.address}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!simulatedQuest) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <OnboardNavbar />
        <h1 className="text-2xl text-foreground mb-4">Quest Not Found</h1>
        <button onClick={() => navigate('/')} className="border border-foreground px-6 py-2 text-sm uppercase font-medium text-foreground hover:bg-foreground hover:text-background transition-colors">Back to Discover</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title={simulatedQuest.title} description={simulatedQuest.description.substring(0, 160)} />
      <OnboardNavbar />

      <main className="flex-1 pt-28 md:pt-36 px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('/')} className="quest-detail-animate text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors">← Back to Discover</button>

          {/* Two-page layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Page 1: Quest Info */}
            <div className="quest-detail-animate">
              <div className="aspect-video bg-muted bg-cover bg-center mb-6" style={{ backgroundImage: `url(${simulatedQuest.backgroundImage})` }} />

              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-[11px] uppercase font-bold tracking-wider" style={{ backgroundColor: difficultyColor[simulatedQuest.difficulty], color: '#000' }}>
                  {simulatedQuest.difficulty}
                </span>
                <span className="border border-foreground px-3 py-1 text-[11px] uppercase font-medium text-foreground">{simulatedQuest.category}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-tight">{simulatedQuest.title}</h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">{simulatedQuest.description}</p>

              {/* Host */}
              <div className="flex items-center gap-3 mb-6">
                <img src={simulatedQuest.hostAvatar} alt={simulatedQuest.hostName} className="w-10 h-10 rounded-full border border-foreground/20" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Hosted by</p>
                  <p className="text-sm font-medium text-foreground">{simulatedQuest.hostName}</p>
                </div>
              </div>

              {/* Reward */}
              <div className="border border-foreground p-4 flex items-center justify-between">
                <span className="text-[11px] uppercase font-medium tracking-wider text-foreground">Reward</span>
                <span className="text-sm font-medium text-foreground">{simulatedQuest.reward}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {simulatedQuest.tags.map(tag => (
                  <span key={tag} className="border border-foreground/30 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>

            {/* Page 2: Task Steps */}
            <div className="quest-detail-animate">
              <div className="border border-foreground p-6 mb-6">
                <h2 className="text-lg font-medium text-foreground mb-1">Task Execution</h2>
                <p className="text-sm text-muted-foreground">Complete each step to earn your reward</p>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex-1 h-1 bg-muted overflow-hidden">
                  <div className="h-full bg-[#00ff88] transition-all duration-500" style={{ width: `${(completedSteps.size / simulatedQuest.steps.length) * 100}%` }} />
                </div>
                <span className="text-[11px] font-medium text-foreground">{completedSteps.size}/{simulatedQuest.steps.length}</span>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {simulatedQuest.steps.map((step, index) => {
                  const isCompleted = completedSteps.has(step.id);
                  const isCurrent = index === currentStep;
                  const isLocked = index > currentStep && !isCompleted;

                  return (
                    <div
                      key={step.id}
                      className={`border transition-all duration-300 ${
                        isCompleted ? 'border-[#00ff88] bg-[#00ff88]/5' :
                        isCurrent ? 'border-foreground' :
                        'border-foreground/20 opacity-50'
                      }`}
                    >
                      {/* Step Header */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-inherit">
                        <span className="text-lg">{isCompleted ? '✅' : actionTypeIcon[step.actionType]}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">Step {index + 1}</span>
                            {isCompleted && <span className="text-[10px] uppercase tracking-wider text-[#00ff88] font-bold">Completed</span>}
                          </div>
                          <h3 className="text-sm font-medium text-foreground">{step.title}</h3>
                        </div>
                      </div>

                      {/* Step Content (expanded for current) */}
                      {(isCurrent || isCompleted) && (
                        <div className="px-4 py-4">
                          <p className="text-sm text-muted-foreground mb-4">{step.instruction}</p>
                          {!isCompleted && (
                            <button
                              onClick={() => handleCompleteStep(step.id)}
                              className="w-full py-3 text-[11px] font-bold uppercase tracking-wider bg-foreground text-background hover:bg-[#00ff88] hover:text-black transition-colors"
                            >
                              {step.actionLabel}
                            </button>
                          )}
                          {isCompleted && (
                            <p className="text-xs text-[#00ff88] font-medium">{step.verificationHint}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Claim Reward */}
              {allStepsCompleted && (
                <div className="mt-8 border-2 border-[#00ff88] p-6 text-center animate-fade-in">
                  <h3 className="text-lg font-medium text-foreground mb-2">🎉 Quest Complete!</h3>
                  <p className="text-sm text-muted-foreground mb-4">All steps verified. Claim your reward.</p>
                  <button
                    onClick={() => {
                      toast({ title: 'Reward Claimed!', description: `You earned: ${simulatedQuest.reward}` });
                    }}
                    className="px-8 py-3 bg-[#00ff88] text-black text-[11px] font-bold uppercase tracking-wider hover:bg-[#00dd77] transition-colors"
                  >
                    Claim {simulatedQuest.reward}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuestDetail;
