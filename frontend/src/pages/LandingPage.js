import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.svg';
import { BRAND_COLORS } from '../assets/brand';
import { BrandButton } from '../components/custom/Button';
import { BrandCard } from '../components/custom/Card';
import { BrandText } from '../components/custom/Typography';
import {
  JoyIcon,
  CalmIcon,
  AnxiousIcon,
  LoveIcon
} from '../components/custom/EmotionIcons';
import {
  EmotionWheel,
  HarmonyTimeline
} from '../components/custom/DataVisualizations';
import {
  TestimonialCard,
  coupleTestimonials,
  therapistTestimonials
} from '../components/custom/TestimonialCard';
import {
  CoupleAvatarOne,
  CoupleAvatarTwo,
  TherapistAvatarOne,
  TherapistAvatarTwo
} from '../components/custom/TestimonialAvatars';
import {
  EmotionAnalysisIllustration,
  ClientProgressIllustration
} from '../components/custom/Illustrations';

const heroStatsDefinition = [
  { label: 'better communication after 30 days', target: 85, suffix: '%' },
  { label: 'reduction in recurring conflict loops', target: 40, suffix: '%' },
  { label: 'users feeling more understood', target: 9, suffix: '/10' },
  { label: 'lift in emotional connection scores', target: 70, suffix: '%' }
];

const coupleFeatureCards = [
  {
    title: 'Emotion-first check-ins',
    body: 'Replace “what is wrong?” with guided prompts that surface real feelings in under two minutes.',
    icon: '🌡️',
    accent: 'teal'
  },
  {
    title: 'Conflict replay without blame',
    body: 'Rebuild a recent argument as a shared timeline, focusing on impact and needs instead of verdicts.',
    icon: '🧩',
    accent: 'coral'
  },
  {
    title: 'Harmony score that feels human',
    body: 'A single, living score that blends calm days, rupture repairs, and emotional risk signals.',
    icon: '🎛️',
    accent: 'blue'
  }
];

const therapistFeatureCards = [
  {
    title: 'Session-ready emotional timelines',
    body: 'Walk into every appointment with a visual of the week’s spikes, ruptures, and repairs.',
    icon: '📊',
    accent: 'blue'
  },
  {
    title: 'Documentation that writes itself',
    body: 'Convert emotional data into structured notes while you stay fully present with your clients.',
    icon: '📝',
    accent: 'teal'
  },
  {
    title: 'Clinical signals without the noise',
    body: 'Spot escalation patterns early with gentle alerts instead of rigid, binary flags.',
    icon: '🛡️',
    accent: 'coral'
  }
];

const howItWorksSteps = [
  {
    id: 'share',
    label: 'Share',
    emoji: '🎤',
    headline: 'Tell the story in your own words',
    copy: 'Use text, voice, or guided prompts. No scripts, no clinical jargon.'
  },
  {
    id: 'analyze',
    label: 'Analyze',
    emoji: '🧠',
    headline: 'Let MR.CREAMS read the emotions underneath',
    copy: 'The system maps intensity, polarity, and patterns across both partners.'
  },
  {
    id: 'guide',
    label: 'Guide',
    emoji: '🧭',
    headline: 'Receive exercises that match your nervous systems',
    copy: 'From rupture repair rituals to micro-celebrations, tuned to your patterns.'
  },
  {
    id: 'grow',
    label: 'Grow',
    emoji: '🌱',
    headline: 'Watch the harmony curve bend upward',
    copy: 'See calm days, quick repairs, and trust markers increase over time.'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [heroStats, setHeroStats] = useState(heroStatsDefinition.map(() => 0));
  const [activeEmotion, setActiveEmotion] = useState('joy');
  const [heroCtaHover, setHeroCtaHover] = useState(null);

  useEffect(() => {
    const maxTarget = Math.max(...heroStatsDefinition.map((item) => item.target));
    const durationMs = 1600;
    const intervalMs = 32;
    const totalSteps = Math.ceil(durationMs / intervalMs);
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      setHeroStats((prev) =>
        prev.map((_, index) => {
          const target = heroStatsDefinition[index].target;
          const progress = Math.min(currentStep / totalSteps, 1);
          const eased = 1 - Math.pow(1 - progress, 2);
          return Math.round(target * eased);
        })
      );
      if (currentStep >= totalSteps) {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const emotions = ['joy', 'calm', 'curious', 'grounded'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % emotions.length;
      setActiveEmotion(emotions[index]);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const handleCouplesCta = () => {
    navigate('/register');
  };

  const handleTherapistsCta = () => {
    navigate('/professional-login');
  };

  const headerLink = (label, href) => (
    <button
      type="button"
      onClick={() => navigate(href)}
      className="text-xs md:text-sm font-medium tracking-tight text-slate-600 hover:text-slate-900 transition-colors"
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-100">
              <img src={logo} alt="Enum Technology" className="w-6 h-6" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                MR.CREAMS
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Enum Technology
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {headerLink('For couples', '/features')}
            {headerLink('For therapists', '/therapist/tools')}
            {headerLink('Pricing', '/pricing')}
            {headerLink('Resources', '/resources')}
          </nav>
          <div className="flex items-center gap-2">
            <BrandButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign in
            </BrandButton>
            <BrandButton
              size="sm"
              onClick={handleCouplesCta}
            >
              Start free trial
            </BrandButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-sky-50/60 to-slate-50">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-cyan-100 blur-3xl" />
            <div className="absolute -bottom-24 -left-6 w-72 h-72 rounded-full bg-rose-100 blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
            <div className="flex-1 flex flex-col gap-6">
              <BrandText variant="display">
                Let your emotions speak{' '}
                <span style={{ color: BRAND_COLORS.teal }}>before</span> the conflict does.
              </BrandText>
              <BrandText variant="body" tone="soft">
                MR.CREAMS turns messy, real-world relationship moments into a living emotional map
                for couples and therapists. No scripts, no forced positivity—just patterns you can
                finally see together.
              </BrandText>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                <BrandButton
                  onMouseEnter={() => setHeroCtaHover('couples')}
                  onMouseLeave={() => setHeroCtaHover(null)}
                  onClick={handleCouplesCta}
                >
                  For Couples
                </BrandButton>
                <BrandButton
                  variant="outline"
                  onMouseEnter={() => setHeroCtaHover('therapists')}
                  onMouseLeave={() => setHeroCtaHover(null)}
                  onClick={handleTherapistsCta}
                >
                  For Therapists
                </BrandButton>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroStatsDefinition.map((item, index) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2.5 shadow-sm"
                  >
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold text-slate-900">
                        {heroStats[index]}
                        {item.suffix}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-100 via-white to-rose-100 shadow-[0_18px_45px_rgba(15,23,42,0.18)]" />
                <div className="relative rounded-3xl p-5 bg-white/90 backdrop-blur flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <BrandText variant="h3">
                      Live emotion field
                    </BrandText>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      Session preview
                    </span>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-4 items-center">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <EmotionWheel />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{
                            rotate: activeEmotion === 'joy' ? 6 : activeEmotion === 'calm' ? -4 : 0,
                            scale: heroCtaHover === 'couples' ? 1.04 : 1
                          }}
                          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                        >
                          <div className="rounded-full bg-white shadow-md px-4 py-2 flex items-center gap-2">
                            {activeEmotion === 'joy' && <JoyIcon width={26} height={26} />}
                            {activeEmotion === 'calm' && <CalmIcon width={26} height={26} />}
                            {activeEmotion === 'curious' && <AnxiousIcon width={26} height={26} />}
                            {activeEmotion === 'grounded' && <LoveIcon width={26} height={26} />}
                            <span className="text-xs font-semibold text-slate-800">
                              {activeEmotion === 'joy' && 'Joy, warm and steady'}
                              {activeEmotion === 'calm' && 'Calm, grounded presence'}
                              {activeEmotion === 'curious' && 'Curiosity with gentle activation'}
                              {activeEmotion === 'grounded' && 'Grounded, securely attached'}
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <BrandCard
                        tone="surface"
                        interactive
                        header={{
                          title: 'Tonight’s emotional weather',
                          meta: 'Synthesized from your last 7 check-ins'
                        }}
                      >
                        <div className="flex flex-col gap-2 text-xs text-slate-600">
                          <div className="flex items-center justify-between">
                            <span>Harmony score</span>
                            <span className="font-semibold text-slate-900">78 / 100</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Escalation risk</span>
                            <span className="font-semibold text-amber-600">Low–moderate</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Recommended focus</span>
                            <span className="font-semibold text-emerald-600">
                              Repair after micro-ruptures
                            </span>
                          </div>
                        </div>
                      </BrandCard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-xl">
                <BrandText variant="h2">
                  For couples who want fewer blowups and more real connection.
                </BrandText>
                <BrandText variant="body" tone="muted">
                  Every interaction you log becomes part of a shared emotional history that you can
                  navigate together instead of arguing about who remembers it right.
                </BrandText>
              </div>
              <div className="w-full md:w-auto">
                <EmotionAnalysisIllustration />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {coupleFeatureCards.map((card) => (
                <BrandCard
                  key={card.title}
                  interactive
                  header={{
                    title: card.title,
                    meta: card.icon
                  }}
                >
                  <BrandText variant="body" tone="soft">
                    {card.body}
                  </BrandText>
                </BrandCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-xl">
                <BrandText variant="h2">
                  Built for therapists who think in nuance, not dashboards.
                </BrandText>
                <BrandText variant="body" tone="muted">
                  MR.CREAMS listens between the lines so you can stay relational in the room while
                  the system tracks what the nervous system is doing over time.
                </BrandText>
              </div>
              <div className="w-full md:w-auto">
                <ClientProgressIllustration />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {therapistFeatureCards.map((card) => (
                <BrandCard
                  key={card.title}
                  tone="surface"
                  interactive
                  header={{
                    title: card.title,
                    meta: card.icon
                  }}
                >
                  <BrandText variant="body" tone="soft">
                    {card.body}
                  </BrandText>
                </BrandCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <BrandText variant="h2">
                  What a session journey feels like inside MR.CREAMS.
                </BrandText>
                <BrandText variant="body" tone="muted">
                  Follow a single conflict from trigger to repair with a visual that makes sense to
                  both hearts and brains.
                </BrandText>
              </div>
              <div className="w-full md:w-[360px]">
                <HarmonyTimeline />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {howItWorksSteps.map((step, index) => (
                <BrandCard
                  key={step.id}
                  tone={index === 3 ? 'elevated' : 'surface'}
                  interactive
                  header={{
                    title: `${step.label}`,
                    meta: step.emoji
                  }}
                >
                  <BrandText variant="h4" tone={index === 3 ? 'inverted' : 'default'}>
                    {step.headline}
                  </BrandText>
                  <BrandText
                    variant="body"
                    tone={index === 3 ? 'inverted' : 'muted'}
                    style={{ marginTop: 8 }}
                  >
                    {step.copy}
                  </BrandText>
                </BrandCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <BrandText variant="h2">
                Real couples and therapists, not stock stories.
              </BrandText>
              <BrandText variant="body" tone="muted">
                MR.CREAMS lives inside the messy, beautiful middle—where relationships actually
                change one honest conversation at a time.
              </BrandText>
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div className="space-y-4">
                <TestimonialCard
                  avatar={<CoupleAvatarOne />}
                  tone="teal"
                  {...coupleTestimonials[0]}
                />
                <TestimonialCard
                  avatar={<CoupleAvatarTwo />}
                  tone="coral"
                  {...coupleTestimonials[1]}
                />
              </div>
              <div className="space-y-4">
                <TestimonialCard
                  avatar={<TherapistAvatarOne />}
                  tone="blue"
                  {...therapistTestimonials[0]}
                />
                <TestimonialCard
                  avatar={<TherapistAvatarTwo />}
                  tone="teal"
                  {...therapistTestimonials[1]}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gradient-to-br from-cyan-600 via-sky-700 to-slate-900 text-white border-b border-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <BrandText variant="h1" tone="inverted">
                Ready to see your relationship as a living system?
              </BrandText>
              <BrandText variant="body" tone="inverted">
                Start with a gentle, 10-minute emotional snapshot. No credit card, no commitment—
                just a clearer picture of where you are today.
              </BrandText>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <BrandButton onClick={handleCouplesCta}>
                  Start couples snapshot
                </BrandButton>
                <BrandButton
                  variant="outline"
                  onClick={handleTherapistsCta}
                >
                  Request therapist demo
                </BrandButton>
              </div>
              <p className="text-xs text-cyan-100/80">
                Private by design • Encrypted in transit and at rest • Built with clinicians
              </p>
            </div>
            <div className="flex-1">
              <ClientProgressIllustration />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-100 pt-10 pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800">
                <img src={logo} alt="MR.CREAMS" className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight">
                  MR.CREAMS
                </span>
                <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Emotional Relationship System
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live in secure cloud
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                HIPAA aligned
              </span>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">Product</p>
              <button
                type="button"
                onClick={() => navigate('/features')}
                className="block text-slate-400 hover:text-white"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="block text-slate-400 hover:text-white"
              >
                Pricing
              </button>
              <button
                type="button"
                onClick={() => navigate('/demo')}
                className="block text-slate-400 hover:text-white"
              >
                Live demo
              </button>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">For Couples</p>
              <button
                type="button"
                onClick={handleCouplesCta}
                className="block text-slate-400 hover:text-white"
              >
                Start free trial
              </button>
              <button
                type="button"
                onClick={() => navigate('/stories')}
                className="block text-slate-400 hover:text-white"
              >
                Stories
              </button>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">For Professionals</p>
              <button
                type="button"
                onClick={handleTherapistsCta}
                className="block text-slate-400 hover:text-white"
              >
                Therapist login
              </button>
              <button
                type="button"
                onClick={() => navigate('/integrations')}
                className="block text-slate-400 hover:text-white"
              >
                Integrations
              </button>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">Company</p>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="block text-slate-400 hover:text-white"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="block text-slate-400 hover:text-white"
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => navigate('/privacy')}
                className="block text-slate-400 hover:text-white"
              >
                Privacy
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-800 pt-4 text-xs text-slate-500">
            <span>© 2024 MR.CREAMS by Enum Technology. All rights reserved.</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                SOC 2–ready
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                GDPR aware
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
