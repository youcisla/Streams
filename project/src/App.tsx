import {
    ArrowRight,
    BadgeCheck,
    BarChart3,
    BellRing,
    CalendarClock,
    CheckCircle2,
    Layers,
    LineChart,
    Link2,
    LucideIcon,
    Megaphone,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Store,
    Users2,
    Zap
} from 'lucide-react';
import {
    type FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
};

type JourneyStep = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
};

const FeatureCard = ({ icon: Icon, title, description, highlights }: Feature) => (
  <article className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-8 transition-colors duration-300 hover:border-cyan-400/40 hover:bg-slate-900/80">
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition group-hover:bg-cyan-500/15">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-slate-300">{description}</p>
    <ul className="mt-6 space-y-2 text-sm text-slate-300">
      {highlights.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </article>
);

const JourneyStepCard = ({ title, subtitle, duration, id }: JourneyStep) => (
  <div
    className="relative flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/40 hover:bg-slate-900/80"
    data-testid={`journey-step-${id}`}
  >
    <div className="flex items-center justify-between">
      <h4 className="text-base font-semibold text-slate-100">{title}</h4>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{duration}</span>
    </div>
    <p className="text-sm leading-relaxed text-slate-300">{subtitle}</p>
  </div>
);

function App() {
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const insightsRef = useRef<HTMLDivElement | null>(null);
  const journeyRef = useRef<HTMLDivElement | null>(null);
  const marketplaceRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);

  const [activeSection, setActiveSection] = useState('overview');
  const [isContactOpen, setContactOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sections = useMemo(
    () => [
      { id: 'overview', label: 'Overview', ref: overviewRef },
      { id: 'insights', label: 'Insights', ref: insightsRef },
      { id: 'journey', label: 'User Journey', ref: journeyRef },
      { id: 'marketplace', label: 'Platform Suite', ref: marketplaceRef },
      { id: 'pricing', label: 'Plans', ref: pricingRef }
    ],
    []
  );

  const features: Feature[] = useMemo(
    () => [
      {
        id: 'identity',
        title: 'Unified Identity',
        description:
          'Single sign-on for streamers and viewers with OAuth for Twitch, YouTube, Kick, Instagram, TikTok, and X. Manage every channel with one secure profile.',
        icon: Users2,
        highlights: [
          'OAuth linking with granular scopes',
          'Role-based profiles for viewers and streamers',
          'Automated token refresh and rotation'
        ]
      },
      {
        id: 'analytics',
        title: 'Cross-Platform Analytics',
        description:
          'Daily snapshots, leaderboards, and growth charts compiled from every connected platform. Keep insights actionable with real-time alerts.',
        icon: LineChart,
        highlights: [
          'Live dashboards with comparative cards',
          'Automated insights delivered in-product',
          'Export-ready reports with one click'
        ]
      },
      {
        id: 'engagement',
        title: 'Engagement Engine',
        description:
          'Launch polls, trivia, predictions, and loyalty rewards from a single control center. Viewers participate from any device with instant feedback.',
        icon: Megaphone,
        highlights: [
          'Configurable point logic and tiers',
          'Mini-game templates with real-time scoring',
          'Reward redemption workflows with audit trail'
        ]
      },
      {
        id: 'marketplace',
        title: 'Creator Marketplace',
        description:
          'Monetize with packages, merch drops, or consultations. Stripe powers secure checkout while StreamLink reconciles every order.',
        icon: Store,
        highlights: [
          'Stripe Checkout with webhook reconciliation',
          'Tax-inclusive pricing and localized currency support',
          'Fulfillment pipeline with status updates'
        ]
      }
    ],
    []
  );

  const journeySteps: JourneyStep[] = useMemo(
    () => [
      {
        id: 'connect',
        title: 'Connect your platforms',
        subtitle:
          'Authenticate with Twitch, YouTube, Kick, Instagram, TikTok, and X. StreamLink syncs profiles, permissions, and content history in under five minutes.',
        duration: '5 min setup'
      },
      {
        id: 'activate',
        title: 'Activate engagement automations',
        subtitle:
          'Pick from ready-made polls, predictions, and reward catalogs—or build your own templates. Every interaction is tracked for insights and compliance.',
        duration: '10 min to launch'
      },
      {
        id: 'grow',
        title: 'Monitor growth and revenue',
        subtitle:
          'Dashboards pulse with live metrics, retention curves, and monetization summaries. Alerts and playbooks recommend your next best action.',
        duration: 'Continuous optimization'
      }
    ],
    []
  );

  const scrollToSection = useCallback(
    (id: string) => {
      const target = sections.find((section) => section.id === id)?.ref.current;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [sections]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const prioritized = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (prioritized?.target) {
          const sectionId = prioritized.target.getAttribute('data-section-id');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleContactSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError(null);

      if (!formState.name.trim() || !formState.email.trim()) {
        setFormError('Name and email are required to continue.');
        return;
      }

      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/u.test(formState.email)) {
        setFormError('Please enter a valid business email.');
        return;
      }

      setIsSubmitting(true);

      window.setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState({ name: '', email: '', company: '', role: '', message: '' });
      }, 600);
    },
    [formState]
  );

  const closeContact = useCallback(() => {
    setContactOpen(false);
    setIsSubmitted(false);
    setFormError(null);
  }, []);

  const openContact = useCallback(() => {
    setContactOpen(true);
    setIsSubmitted(false);
    setFormError(null);
  }, []);

  const openDocs = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.open('https://docs.streamlink.app', '_blank', 'noreferrer');
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_55%)]" aria-hidden />

      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-wide text-slate-100">StreamLink</p>
              <p className="text-xs text-slate-400">Creators, data, and communities in sync</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`relative text-sm font-medium transition hover:text-cyan-300 ${
                  activeSection === section.id ? 'text-cyan-300' : 'text-slate-300'
                }`}
              >
                {section.label}
                {activeSection === section.id && (
                  <span className="absolute -bottom-2 left-0 right-0 mx-auto h-0.5 w-8 rounded-full bg-cyan-300" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden rounded-full border border-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400/70 hover:text-cyan-200 md:inline-flex"
              onClick={() => scrollToSection('pricing')}
            >
              View plans
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={openContact}
            >
              Talk to us
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto border-t border-slate-900/70 px-6 py-3 md:hidden" aria-label="Mobile">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeSection === section.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="relative">
        <section
          ref={overviewRef}
          data-section-id="overview"
          className="border-b border-slate-900/70"
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-[minmax(0,_1fr)_380px] lg:pb-28 lg:pt-24">
            <div className="flex flex-col gap-8">
              <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Enterprise-grade security
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
                  Stream smarter with unified identity, engagement, and growth tools.
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-slate-300">
                  StreamLink centralizes every platform connection, campaign, and transaction. Give your team a control room that surfaces actionable insights while automating the busywork that slows you down.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  onClick={() => scrollToSection('journey')}
                >
                  Explore the onboarding journey
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                  onClick={openDocs}
                >
                  Browse product docs
                </button>
              </div>
              <dl className="grid gap-6 sm:grid-cols-3">
                {[{ label: 'Creator accounts synced', value: '18,400+' }, { label: 'Average revenue lift', value: '32%' }, { label: 'Support satisfaction', value: '98%' }].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{stat.label}</dt>
                    <dd className="mt-2 text-2xl font-semibold text-slate-100">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_65%)] opacity-80" aria-hidden />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                    <BarChart3 className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-cyan-200">Live insight feed</p>
                    <p className="text-xs text-slate-400">Every platform, one console</p>
                  </div>
                </div>
                <ul className="relative mt-6 space-y-4 text-sm text-slate-200">
                  <li className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <Layers className="mt-0.5 h-5 w-5 text-cyan-300" aria-hidden />
                    <div>
                      <p className="font-semibold text-slate-100">Aggregated dashboards</p>
                      <p className="mt-1 text-slate-400">Compare platform KPIs in real time with anomaly alerts and proactive recommendations.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <BellRing className="mt-0.5 h-5 w-5 text-cyan-300" aria-hidden />
                    <div>
                      <p className="font-semibold text-slate-100">Audience intelligence</p>
                      <p className="mt-1 text-slate-400">Identify superfans, track loyalty, and celebrate milestones automatically.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <Zap className="mt-0.5 h-5 w-5 text-cyan-300" aria-hidden />
                    <div>
                      <p className="font-semibold text-slate-100">Workflow automations</p>
                      <p className="mt-1 text-slate-400">Launch retention plays, notify fans, and reconcile payouts without lifting a finger.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section
          ref={insightsRef}
          data-section-id="insights"
          className="border-b border-slate-900/70 bg-slate-950/40"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
            <div className="flex flex-col gap-6 text-center">
              <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                <Link2 className="h-4 w-4 text-cyan-300" aria-hidden />
                Unified control center
              </span>
              <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">Every capability your studio needs—without juggling tabs.</h2>
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300">
                StreamLink synchronizes data, automations, and monetization so your team can focus on what matters most: storytelling, community, and sustainable growth.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.id} {...feature} />
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80 px-6 py-8 text-center lg:flex-row lg:text-left">
              <div>
                <h3 className="text-xl font-semibold text-slate-100">Ready to see StreamLink in action?</h3>
                <p className="mt-2 text-sm text-slate-300">Book a guided tour with a product specialist and build a roadmap tailored to your creators.</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  onClick={openContact}
                >
                  Schedule a tour
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                  onClick={() => scrollToSection('marketplace')}
                >
                  Explore the platform suite
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={journeyRef}
          data-section-id="journey"
          className="border-b border-slate-900/70"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,_1fr)]">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <CalendarClock className="h-4 w-4 text-cyan-300" aria-hidden />
                  Guided onboarding
                </span>
                <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">Launch StreamLink without disrupting your production calendar.</h2>
                <p className="text-base leading-relaxed text-slate-300">
                  Every subscription includes a dedicated implementation manager, migration tooling, and playbooks for your community leads. We partner with your legal, finance, and security teams to ensure compliance from day one.
                </p>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-cyan-300" aria-hidden />
                    SOC 2 Type II reports and regional data residency options.
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-cyan-300" aria-hidden />
                    Token vault with salted encryption plus automatic key rotation.
                  </li>
                  <li className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-cyan-300" aria-hidden />
                    Weekly office hours, onboarding workshops, and success checkpoints.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                {journeySteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-200">
                      {index + 1}
                    </div>
                    <JourneyStepCard {...step} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          ref={marketplaceRef}
          data-section-id="marketplace"
          className="border-b border-slate-900/70 bg-slate-950/40"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,_1fr)_400px] lg:gap-16">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <Layers className="h-4 w-4 text-cyan-300" aria-hidden />
                  Platform suite
                </span>
                <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">Bring storefronts, campaigns, and automation into one workspace.</h2>
                <p className="text-base leading-relaxed text-slate-300">
                  StreamLink orchestrates the entire customer journey—from discovering a streamer to redeeming a loyalty reward. No more duct-taped spreadsheets or context switching.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: 'Campaign Hub',
                      description: 'Launch polls, mini-games, and announcements with reusable templates and role-based approvals.',
                      icon: Megaphone
                    },
                    {
                      title: 'Commerce Toolkit',
                      description: 'Manage products, Stripe payouts, and fulfillment handoffs with status visibility for your whole team.',
                      icon: Store
                    },
                    {
                      title: 'Audience CRM',
                      description: 'Segment superfans, track lifetime value, and sync updates to Discord or email in real time.',
                      icon: Users2
                    },
                    {
                      title: 'Insights API',
                      description: 'Export metrics and events into your data warehouse through our fully documented GraphQL and REST endpoints.',
                      icon: LineChart
                    }
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-cyan-400/50 hover:bg-slate-900/80"
                    >
                      <item.icon className="h-5 w-5 text-cyan-300" aria-hidden />
                      <h3 className="text-base font-semibold text-slate-100">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Weekly sync summary</p>
                    <p className="text-xs text-slate-400">Auto-generated insights</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-200">Beta</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <BarChart3 className="mt-0.5 h-5 w-5 text-cyan-300" aria-hidden />
                    <div>
                      <p className="font-semibold text-slate-100">Cross-platform health score</p>
                      <p className="mt-1 text-slate-400">Surface risks before they trend—StreamLink calculates consistency, growth velocity, and engagement depth.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <Megaphone className="mt-0.5 h-5 w-5 text-cyan-300" aria-hidden />
                    <div>
                      <p className="font-semibold text-slate-100">Automated winback plays</p>
                      <p className="mt-1 text-slate-400">Trigger customized campaigns when VIP viewers churn, with built-in experiment tracking.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <MessageCircle className="mt-0.5 h-5 w-5 text-cyan-300" aria-hidden />
                    <div>
                      <p className="font-semibold text-slate-100">Community sentiment trends</p>
                      <p className="mt-1 text-slate-400">Combine chat transcripts, poll results, and reward redemptions into a single temperature view.</p>
                    </div>
                  </li>
                </ul>
                <button
                  type="button"
                  className="w-full rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                  onClick={openContact}
                >
                  Request access to weekly summaries
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={pricingRef}
          data-section-id="pricing"
          className="border-b border-slate-900/70"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                <BarChart3 className="h-4 w-4 text-cyan-300" aria-hidden />
                Pricing designed for scale
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl">Pick the plan that matches your studio footprint.</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-300">
                Every plan includes dedicated onboarding, platform integrations, and premium support. Upgrade or downgrade anytime as your roster evolves.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {[
                {
                  name: 'Creator Collective',
                  price: '$399/mo',
                  description: 'For emerging teams aligning creators and community managers.',
                  highlights: [
                    'Up to 5 creator workspaces',
                    'Engagement automations & loyalty',
                    'Stripe Checkout integration'
                  ]
                },
                {
                  name: 'Studio Growth',
                  price: '$899/mo',
                  description: 'For agencies and studios managing multi-platform lineups.',
                  highlights: [
                    'Unlimited creator profiles',
                    'Audience CRM and segmentation',
                    'Insights API + webhook delivery'
                  ],
                  featured: true
                },
                {
                  name: 'Enterprise Alliance',
                  price: 'Let’s collaborate',
                  description: 'For global media networks, esports franchises, and platforms.',
                  highlights: [
                    'Custom data residency & SSO',
                    'Guaranteed SLAs and white-glove success',
                    'Co-marketing and roadmap partnership'
                  ]
                }
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`flex flex-col gap-6 rounded-3xl border bg-slate-900/70 p-8 transition ${
                    plan.featured
                      ? 'border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.15)]'
                      : 'border-slate-800/80 hover:border-cyan-400/40'
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">{plan.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{plan.description}</p>
                  </div>
                  <p className="text-3xl font-bold text-cyan-300">{plan.price}</p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {plan.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" aria-hidden />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                      plan.featured
                        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                        : 'border border-slate-800 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    }`}
                    onClick={openContact}
                  >
                    {plan.featured ? 'Start onboarding' : 'Talk with sales'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900/70 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-100">StreamLink</p>
            <p className="mt-1 text-sm text-slate-400">The companion platform creators trust to centralize identity, engagement, and growth.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <button
              type="button"
              className="rounded-full border border-slate-800 px-4 py-2 transition hover:border-cyan-400/60 hover:text-cyan-200"
              onClick={() => scrollToSection('overview')}
            >
              Back to top
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-800 px-4 py-2 transition hover:border-cyan-400/60 hover:text-cyan-200"
              onClick={openDocs}
            >
              Platform documentation
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-800 px-4 py-2 transition hover:border-cyan-400/60 hover:text-cyan-200"
              onClick={openContact}
            >
              Contact success team
            </button>
          </div>
        </div>
      </footer>

      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-slate-800 px-2 py-1 text-xs text-slate-400 transition hover:border-cyan-400/60 hover:text-cyan-200"
              onClick={closeContact}
              aria-label="Close contact form"
            >
              Close
            </button>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-100">Talk with our success team</h3>
                <p className="text-sm text-slate-400">We respond within one business day.</p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleContactSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Full name
                  <input
                    className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:bg-slate-900"
                    value={formState.name}
                    onChange={(event) => handleFormChange('name', event.target.value)}
                    placeholder="Riley Thompson"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Work email
                  <input
                    className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:bg-slate-900"
                    value={formState.email}
                    onChange={(event) => handleFormChange('email', event.target.value)}
                    placeholder="you@studio.com"
                    type="email"
                    required
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Company or studio
                  <input
                    className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:bg-slate-900"
                    value={formState.company}
                    onChange={(event) => handleFormChange('company', event.target.value)}
                    placeholder="Orbital Studios"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Role
                  <input
                    className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:bg-slate-900"
                    value={formState.role}
                    onChange={(event) => handleFormChange('role', event.target.value)}
                    placeholder="Head of Community"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                How can we help?
                <textarea
                  className="min-h-[120px] rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:bg-slate-900"
                  value={formState.message}
                  onChange={(event) => handleFormChange('message', event.target.value)}
                  placeholder="Tell us about your creators, goals, and timeline..."
                />
              </label>

              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              {isSubmitted && !formError && (
                <p className="flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Thanks! We just sent a confirmation email and will follow up shortly.
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-800 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-200"
                  onClick={closeContact}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : 'Submit' }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
