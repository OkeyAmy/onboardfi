import { useState, useRef, useEffect } from 'react';
import { OnboardNavbar } from '@/components/OnboardNavbar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useGooglePlacesAutocomplete } from '@/hooks/useGooglePlacesAutocomplete';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { ConnectWalletSheet } from '@/components/ConnectWalletSheet';
import { SEOHead } from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { z } from 'zod';

const eventSchema = z.object({
  eventName: z.string().trim().min(1, 'Quest name is required').max(200),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be HH:MM'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be HH:MM'),
  location: z.string().trim().min(1, 'Location is required').max(300),
  description: z.string().trim().min(1, 'Description is required').max(2000),
});

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { onPlaceSelected } = useGooglePlacesAutocomplete(locationInputRef);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (!session?.user) setShowAuthModal(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) setShowAuthModal(false);
      else setShowAuthModal(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    onPlaceSelected((place) => {
      setLocation(place.formatted_address || place.name || '');
    });
  }, [onPlaceSelected]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) { toast.error('Please upload a JPG, PNG, GIF, or WebP image'); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) { setShowAuthModal(true); return; }
    if (!startDate) { toast.error('Please select a start date'); return; }
    if (!endDate) { toast.error('Please select an end date'); return; }
    if (!imageFile) { toast.error('Please add a quest image'); return; }

    const result = eventSchema.safeParse({ eventName, startTime, endTime, location, description });
    if (!result.success) { toast.error(result.error.errors[0].message); return; }

    const startDateTime = new Date(startDate);
    const [sH, sM] = startTime.split(':');
    startDateTime.setHours(parseInt(sH), parseInt(sM), 0, 0);
    const endDateTime = new Date(endDate);
    const [eH, eM] = endTime.split(':');
    endDateTime.setHours(parseInt(eH), parseInt(eM), 0, 0);
    if (endDateTime <= startDateTime) { toast.error('End must be after start'); return; }

    setIsSubmitting(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('event-images').upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(filePath);

      const targetDate = new Date(startDate);
      const [h, m] = startTime.split(':');
      targetDate.setHours(parseInt(h) || 0, parseInt(m) || 0);

      const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
      const creatorName = profile?.display_name || user.email?.split('@')[0] || 'Anonymous';

      const { error: insertError } = await supabase.from('events').insert({
        title: eventName,
        description,
        date: format(startDate, 'MMMM dd, yyyy'),
        time: `${startTime} - ${endTime}`,
        address: location,
        background_image_url: publicUrl,
        target_date: targetDate.toISOString(),
        creator: creatorName,
      });
      if (insertError) throw insertError;
      toast.success('Quest created!');
      navigate('/my-events');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      toast.error('Failed to create quest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Create Quest" description="Create a new quest for the OnboardFi community" />
      <OnboardNavbar />
      <ConnectWalletSheet isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {user && (
        <div className="flex-1 max-w-7xl mx-auto pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Image Upload */}
            <div className="flex flex-col gap-3">
              <label className="w-full aspect-[4/3] border border-foreground bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-foreground text-[11px] font-medium uppercase tracking-wider">Add Image</span>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {imagePreview && (
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-3 text-[13px] font-medium uppercase tracking-wider border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-colors">
                  Change image
                </button>
              )}
            </div>

            {/* Form */}
            <div className="space-y-4 md:space-y-6">
              <input
                type="text"
                placeholder="Quest name"
                className="w-full text-foreground text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-none mb-4 md:mb-8 focus:outline-none bg-transparent border-none p-0 placeholder:text-muted-foreground/40"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />

              {/* Start */}
              <div className="grid grid-cols-[80px_1fr_80px] md:grid-cols-[100px_1fr_100px] gap-0 border border-foreground">
                <div className="flex items-center gap-1.5 border-r border-foreground px-2 md:px-3 py-2 md:py-3">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-foreground rounded-full" />
                  <span className="text-[14px] md:text-[17px] font-medium text-foreground">Start</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn("px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-left border-r border-foreground bg-background text-foreground", !startDate && "text-muted-foreground/40")}>
                      {startDate ? format(startDate, "EEE, dd MMM") : "Select date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus /></PopoverContent>
                </Popover>
                <input type="text" placeholder="15:00" className="px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground text-center bg-background focus:outline-none placeholder:text-muted-foreground/40" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>

              {/* End */}
              <div className="grid grid-cols-[80px_1fr_80px] md:grid-cols-[100px_1fr_100px] gap-0 border border-foreground">
                <div className="flex items-center gap-1.5 border-r border-foreground px-2 md:px-3 py-2 md:py-3">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-foreground rounded-full" />
                  <span className="text-[14px] md:text-[17px] font-medium text-foreground">End</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn("px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-left border-r border-foreground bg-background text-foreground", !endDate && "text-muted-foreground/40")}>
                      {endDate ? format(endDate, "EEE, dd MMM") : "Select date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus /></PopoverContent>
                </Popover>
                <input type="text" placeholder="16:00" className="px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground text-center bg-background focus:outline-none placeholder:text-muted-foreground/40" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>

              <input ref={locationInputRef} type="text" placeholder="Add location" className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground bg-background focus:outline-none placeholder:text-muted-foreground/40" value={location} onChange={(e) => setLocation(e.target.value)} />

              <textarea placeholder="Add description" rows={6} className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground bg-background focus:outline-none resize-none placeholder:text-muted-foreground/40" value={description} onChange={(e) => setDescription(e.target.value)} />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-[50px] bg-foreground text-background text-[13px] font-medium uppercase hover:bg-[#00ff88] hover:text-black transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Quest'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CreateEvent;
