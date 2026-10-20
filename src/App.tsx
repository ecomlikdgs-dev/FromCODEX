import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  CircleCheck,
  Clock3,
  FileText,
  Globe2,
  GraduationCap,
  LayoutTemplate,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  Menu,
  MessageCircle,
  MonitorPlay,
  MousePointer2,
  PackageOpen,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Youtube,
} from 'lucide-react';
import { business, curriculum, faqs } from './content';
import {
  defaultPublicConfig,
  loadPublicConfig,
  netlifyFormName,
  submitEnquiry,
  usesNetlifyForms,
} from './lead-client';
import {
  consentKey,
  initializeAnalytics,
  setAnalyticsConsent,
  track,
  type PublicConfig,
} from './tracking';

function LeadLink({
  children = 'بغيت نعرف تفاصيل التكوين',
  className = 'button button-primary',
  location,
}: {
  children?: ReactNode;
  className?: string;
  location: string;
}) {
  return (
    <a className={className} href="#join" onClick={() => track('cta_click', { location })}>
      {children}
      <ArrowLeft size={18} aria-hidden="true" />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        <div className="container">
          <span>
            <span className="tiny-star">✦</span> البداية ديال مشروعك الرقمي، بخطوات واضحة وبالدارجة
          </span>
          <a href={business.channelUrl} target="_blank" rel="noreferrer">
            تعرّف علينا فـ يوتيوب <Youtube size={16} />
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home" aria-label="Ecomlik، الصفحة الرئيسية">
            <img src="/brand/logo.svg" alt="Ecomlik" width="157" height="43" />
          </a>
          <button
            className="menu-toggle"
            aria-label={open ? 'سدّ القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-nav"
            className={open ? 'main-nav is-open' : 'main-nav'}
            aria-label="القائمة الرئيسية"
            onClick={() => setOpen(false)}
          >
            <a href="#why">علاش المنتجات الرقمية؟</a>
            <a href="#program">شنو غادي تتعلّم</a>
            <a href="#faq">الأسئلة الشائعة</a>
          </nav>
          <LeadLink className="button button-small nav-cta" location="navigation">
            نبدا الرحلة ديالي
          </LeadLink>
        </div>
      </header>
    </>
  );
}

function CourseArtwork() {
  return (
    <div className="course-art" aria-label="رسم توضيحي لمسار إنشاء منتج رقمي">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-spark spark-one">✦</div>
      <div className="art-spark spark-two">✧</div>
      <div className="art-note note-product">
        <span className="note-icon">
          <PackageOpen size={22} />
        </span>
        <span>
          <strong>منتج واحد</strong>
          <small>تقدر تبيعو أكثر من مرة</small>
        </span>
        <CheckCheck size={19} className="teal" />
      </div>
      <div className="back-sheet">
        <div className="sheet-top">
          <i />
          <i />
          <i />
        </div>
        <div className="sheet-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="course-book">
        <div className="book-top">
          <span>دليلك العملي</span>
          <img src="/brand/icon.svg" alt="" />
        </div>
        <div className="book-copy">
          <small>من الفكرة للتطبيق</small>
          <h2>
            منتجك
            <br />
            الرقمي
            <br />
            الأول<span>.</span>
          </h2>
        </div>
        <div className="book-art">
          <div className="book-circle">
            <MousePointer2 size={60} strokeWidth={1.2} />
          </div>
          <span className="book-cross">+</span>
          <div className="book-lines" />
        </div>
        <div className="book-bottom">
          <span dir="ltr">ecomlik</span>
          <span>تعلّم. طبّق. طوّر.</span>
        </div>
      </div>
      <div className="art-note note-path">
        <span className="note-icon yellow">
          <Lightbulb size={24} />
        </span>
        <div>
          <strong>كل مشروع كيبدا بفكرة</strong>
          <div className="path-dots">
            <span>فكرة</span>
            <ChevronLeft size={12} />
            <span>منتج</span>
            <ChevronLeft size={12} />
            <span>عرض</span>
          </div>
        </div>
      </div>
      <div className="art-file">
        <FileText size={22} />
        <span>جاهز للتعلّم</span>
        <span className="file-tag">PDF</span>
      </div>
      <div className="art-caption">
        <span /> تصوّر تعليمي لمسارك مع Ecomlik
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-tag">
            <span className="tag-line" /> تعلّم اليوم، وابني مشروعك على مهل
          </div>
          <h1>
            المعرفة ديالك،
            <br />
            تقدر تولّي
            <br />
            <span className="headline-highlight">
              منتج رقمي كيتباع
              <svg viewBox="0 0 470 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 10C130 0 306 0 467 7" />
              </svg>
            </span>
            <span className="pink-dot">.</span>
          </h1>
          <p className="hero-description">
            مع Ecomlik Academy، تعلّم كيفاش تصاوب منتج رقمي من خبرتك، أو تختار منتج مرخّص لإعادة
            البيع. دروس مسجّلة ولقاءات مباشرة، بالدارجة المغربية.
          </p>
          <div className="hero-actions">
            <LeadLink location="hero" />
            <a className="text-action" href="#program">
              <span className="play-circle">
                <Play size={12} fill="currentColor" />
              </span>{' '}
              اكتشف المسار
            </a>
          </div>
          <div className="hero-reassurance">
            <span>
              <Check size={15} /> مناسب للبداية من الصفر
            </span>
            <span>
              <Check size={15} /> للمغاربة فكل بلاصة
            </span>
          </div>
        </div>
        <CourseArtwork />
      </div>
      <div className="hero-bottom container">
        <span className="small-label">منتجات رقمية. فرص بأشكال مختلفة.</span>
        <div className="formats">
          <span>
            <FileText /> كتب وأدلّة
          </span>
          <span>
            <LayoutTemplate /> قوالب جاهزة
          </span>
          <span>
            <MonitorPlay /> دورات مصوّرة
          </span>
          <span>
            <ListChecks /> أدوات تنظيم
          </span>
        </div>
        <a href="#products" aria-label="اكتشف أنواع المنتجات">
          <ArrowDown size={19} />
        </a>
      </div>
    </section>
  );
}

const benefits = [
  {
    icon: PackageOpen,
    title: 'كتصاوبو مرة، وكتطوّرو مع الوقت',
    text: 'نفس الملف يقدر يوصل لأكثر من زبون. ركّز على الجودة والتحسين، مع احترام الحقوق ديال المحتوى.',
  },
  {
    icon: Globe2,
    title: 'مشروع يقدر يوصل لبعيد',
    text: 'تختار السوق اللي كتناسبو خبرتك، فالمغرب أو برا. اللغة، الدفع والقوانين كتدخل فاختيارك.',
  },
  {
    icon: Lightbulb,
    title: 'تبدا من شي حاجة كتعرفها',
    text: 'تجربة فالخدمة، مهارة، أو حل لمشكل كتفهمو. البداية كتكون أقرب ليك مما كتتصوّر.',
  },
];
function Why() {
  return (
    <section id="why" className="section why-section">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">مشروع كيبدا بالقيمة اللي كتقدّم</span>
            <h2>
              علاش تختار
              <br />
              المنتجات الرقمية؟
            </h2>
          </div>
          <p>
            كتاب، قالب، دليل عملي أو دورة... منتج كيتوصل به الزبون أونلاين، وكيساعدو يحل مشكل محدّد.
            القيمة ديالو فالفائدة اللي كيقدّم.
          </p>
        </div>
        <div className="benefit-grid">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <article className="benefit" key={title}>
              <span className={`benefit-icon color-${i}`}>
                <Icon size={27} strokeWidth={1.5} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="honest-note">
          <ShieldCheck size={17} /> منتج رقمي مزيان كيحتاج خدمة وتسويق. الربح كيبقى مرتبط بالسوق
          وبالتطبيق ديالك.
        </p>
      </div>
    </section>
  );
}

const products = [
  {
    category: 'templates',
    name: 'قالب لتنظيم الميزانية',
    type: 'قالب قابل للتعبئة',
    icon: LayoutTemplate,
    style: 'budget',
    headline: 'فلوسك،\nبوضوح.',
    subtitle: 'خطّط لمصاريفك خطوة بخطوة',
    format: 'جدول عملي',
    color: 'teal',
  },
  {
    category: 'guides',
    name: 'دليل من تجربة أو مهارة',
    type: 'كتاب إلكتروني',
    icon: BookOpen,
    style: 'guide',
    headline: 'خبرتك\nكتستاهل\nتتشارك.',
    subtitle: 'حوّل اللي كتعرف لدليل مفيد',
    format: 'PDF',
    color: 'yellow',
  },
  {
    category: 'courses',
    name: 'دورة لتعليم مهارة محدّدة',
    type: 'دروس مصوّرة',
    icon: MonitorPlay,
    style: 'course',
    headline: 'علّم مهارة.\nخلّي أثر.',
    subtitle: 'شرح واضح، وتطبيق عملي',
    format: 'فيديو',
    color: 'pink',
  },
];
function Products() {
  const [filter, setFilter] = useState('all');
  const filters = [
    ['all', 'كل الأفكار'],
    ['templates', 'قوالب'],
    ['guides', 'كتب وأدلّة'],
    ['courses', 'دورات'],
  ];
  return (
    <section id="products" className="section products-section">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow">الفكرة المناسبة كتبدأ من حاجة بسيطة</span>
          <h2>شنو يقدر يكون أول منتج ديالك؟</h2>
          <p>هادي أمثلة باش تتصوّر الإمكانيات. اختار الفكرة حسب المهارة ديالك وحاجة السوق.</p>
        </div>
        <div className="filter-tabs" role="group" aria-label="تصفية أمثلة المنتجات">
          {filters.map(([value, title]) => (
            <button
              key={value}
              aria-pressed={filter === value}
              className={filter === value ? 'selected' : ''}
              onClick={() => setFilter(value)}
            >
              {title}
            </button>
          ))}
        </div>
        <div className={`product-grid ${filter !== 'all' ? 'filtered' : ''}`}>
          {products
            .filter((p) => filter === 'all' || p.category === filter)
            .map((p) => (
              <article className="product-card" key={p.name}>
                <div className={`product-preview ${p.style}`} aria-hidden="true">
                  <span className="preview-format">{p.format}</span>
                  <div className="mini-cover">
                    <p>
                      ecomlik <span>✦</span>
                    </p>
                    <h3>{p.headline}</h3>
                    <small>{p.subtitle}</small>
                    {p.style === 'budget' ? (
                      <div className="mini-chart">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    ) : p.style === 'guide' ? (
                      <div className="mini-sun">✳</div>
                    ) : (
                      <div className="mini-play">
                        <Play fill="currentColor" />
                      </div>
                    )}
                    <span className="mini-cover-bottom">فكرة قابلة للتطوير</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className={`product-type ${p.color}`}>{p.type}</span>
                  <h3>{p.name}</h3>
                  <a
                    href="#join"
                    onClick={() => track('product_interest', { category: p.category })}
                  >
                    نكتشف كيفاش نبدا <ArrowUpLeft size={18} />
                  </a>
                </div>
              </article>
            ))}
        </div>
        <p className="example-note">
          نماذج توضيحية للأفكار، ماشي منتجات معروضة للبيع أو نتائج مضمونة.
        </p>
      </div>
    </section>
  );
}

function Program() {
  const [filter, setFilter] = useState('all');
  const icons = {
    target: Target,
    chart: TrendingUp,
    file: FileText,
    package: PackageOpen,
    message: MessageCircle,
    sparkles: Sparkles,
  };
  return (
    <section id="program" className="section academy-section">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow">داخل Ecomlik Academy</span>
          <h2>من الفكرة، لمنتج واجد للسوق.</h2>
          <p>
            دروس مسجّلة ولقاءات مباشرة. مسار كيجمع البحث، الصناعة، البيع والتحسين، مع استعمال الذكاء
            الاصطناعي بطريقة واعية.
          </p>
        </div>
        <div className="academy-format">
          <span>
            <MonitorPlay size={16} /> دروس مسجّلة
          </span>
          <span>
            <Users size={16} /> لقاءات مباشرة
          </span>
          <span>
            <GraduationCap size={17} /> بالدارجة المغربية
          </span>
        </div>
        <div className="academy-tabs" role="group" aria-label="تصفية محتوى التكوين">
          {[
            ['all', 'المسار كامل'],
            ['research', 'البحث على الفكرة'],
            ['creation', 'صناعة المنتج'],
            ['sales', 'البيع والتسويق'],
            ['ai', 'مساعدة AI'],
          ].map(([value, title]) => (
            <button
              key={value}
              className={filter === value ? 'selected' : ''}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="curriculum-grid">
          {curriculum
            .filter((c) => filter === 'all' || c.category === filter)
            .map((c) => {
              const Icon = icons[c.icon as keyof typeof icons];
              return (
                <article
                  className={`curriculum-card ${c.category === 'ai' ? 'ai-card' : ''}`}
                  key={c.title}
                >
                  <div className="curriculum-card-top">
                    <span className="curriculum-icon">
                      <Icon size={25} strokeWidth={1.6} />
                    </span>
                    <span>{c.label}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <div className="curriculum-outcome">{c.outcome}</div>
                </article>
              );
            })}
        </div>
        <div className="academy-bottom">
          <p>
            <Clock3 size={16} /> شوف التفاصيل ومواعيد اللقاءات قبل ما تقرّر الالتحاق.
          </p>
          <LeadLink location="curriculum">نسول على Ecomlik Academy</LeadLink>
        </div>
      </div>
    </section>
  );
}

const comparisons = [
  [
    'المنتجات الرقمية',
    'ملف، قالب أو محتوى تعليمي',
    'تسليم رقمي',
    'نفس المنتج يقدر يتباع مرات',
    'الجودة، الحقوق والتسويق',
  ],
  [
    'الدفع عند الاستلام',
    'غالباً منتج مادي',
    'شحن وتحصيل',
    'كل طلب محتاج توصيل',
    'المخزون، المرتجعات والتحصيل',
  ],
  [
    'الدروبشيبينغ',
    'منتج مادي من مورّد',
    'المورّد كيشحن',
    'كل طلب مرتبط بالمورّد',
    'جودة المورّد وآجال الشحن',
  ],
  [
    'الخدمات الرقمية',
    'خدمة أو وقت عمل',
    'إنجاز للزبون',
    'غالباً خدمة لكل زبون',
    'الوقت، التنفيذ وتوقعات الزبون',
  ],
  [
    'التداول',
    'شراء وبيع أصول مالية',
    'ما كاينش منتج للزبون',
    'مرتبط بحركة السوق',
    'مخاطر خسارة رأس المال',
  ],
];
function Comparison() {
  return (
    <section id="compare" className="section comparison-section">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow">اختار المجال وأنت فاهم الفرق</span>
          <h2>كل مجال عندو طريقة خدمتو.</h2>
          <p>قارن شنو كتبيع، كيفاش كتوصل القيمة، وشنو خاصّك تدبّر فكل نموذج.</p>
        </div>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="مقارنة نماذج العمل، يمكن تمرير الجدول أفقياً"
        >
          <table>
            <caption className="sr-only">
              مقارنة المنتجات الرقمية مع الدفع عند الاستلام والدروبشيبينغ والخدمات والتداول
            </caption>
            <thead>
              <tr>
                {['المجال', 'شنو كتبيع', 'التسليم', 'قابلية التكرار', 'شنو خاصّك تدبّر'].map(
                  (h) => (
                    <th scope="col" key={h}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={row[0]} className={i === 0 ? 'featured-row' : ''}>
                  <th scope="row">
                    {i === 0 && <span className="table-star">✦</span>}
                    {row[0]}
                  </th>
                  {row.slice(1).map((c) => (
                    <td key={c}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="comparison-note">
          <MessageCircle size={21} />
          <p>
            <strong>والتسويق بالإيميل؟</strong> هادي وسيلة للتواصل مع الجمهور وبيع المنتجات أو
            الخدمات. تقدر تكون جزء من مشروع المنتجات الرقمية ديالك.
          </p>
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section id="about" className="section community-section">
      <div className="container community-grid">
        <div className="channel-visual">
          <div className="channel-card">
            <div className="channel-brand">
              <img src="/brand/logo.svg" width="155" height="42" alt="Ecomlik" />
              <span>
                <Youtube size={23} /> YouTube
              </span>
            </div>
            <div className="channel-poster">
              <span className="poster-label">المعرفة هي البداية</span>
              <h3>
                تعلّم بالدارجة.
                <br />
                طبّق بطريقتك.
              </h3>
              <a
                href={business.channelUrl}
                target="_blank"
                rel="noreferrer"
                className="channel-play"
                aria-label="فتح قناة Ecomlik على يوتيوب"
              >
                <Play size={24} fill="currentColor" />
              </a>
              <span className="poster-star">✦</span>
              <span className="poster-bottom">المنتجات الرقمية مع Ecomlik</span>
            </div>
            <a className="channel-link" href={business.channelUrl} target="_blank" rel="noreferrer">
              خذ فكرة من المحتوى ديالنا <ArrowUpLeft size={19} />
            </a>
          </div>
          <div className="channel-sticker">
            <BookOpen size={19} />
            <span>الفهم قبل أي قرار</span>
          </div>
        </div>
        <div className="community-copy">
          <span className="eyebrow">من المحتوى للتطبيق</span>
          <h2>
            مرحبا بيك،
            <br />
            فين ما وصلتي
            <br />
            فالمسار ديالك.
          </h2>
          <p>
            خدام وباغي تطوّر مشروع بجانب الخدمة؟ عندك خبرة وباغي تحوّلها لمنتج؟ أو مازال كتقلّب على
            البداية؟ خذ الوقت ديالك باش تفهم المجال وتشوف واش مناسب ليك.
          </p>
          <ul className="check-list">
            <li>
              <CircleCheck /> محتوى بالدارجة قريب للسياق المغربي
            </li>
            <li>
              <CircleCheck /> تركيز على المنتجات الرقمية وحقوق إعادة البيع
            </li>
            <li>
              <CircleCheck /> للمغاربة فالمغرب وخارج المغرب
            </li>
          </ul>
          <a className="text-action" href={business.channelUrl} target="_blank" rel="noreferrer">
            <Youtube size={20} /> زور القناة وتعرّف على المحتوى <ArrowUpLeft size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

const countries = [
  ['MA', 'المغرب', '+212'],
  ['FR', 'فرنسا', '+33'],
  ['ES', 'إسبانيا', '+34'],
  ['BE', 'بلجيكا', '+32'],
  ['NL', 'هولندا', '+31'],
  ['DE', 'ألمانيا', '+49'],
  ['GB', 'بريطانيا', '+44'],
  ['CA', 'كندا', '+1'],
  ['US', 'أمريكا', '+1'],
  ['OTHER', 'بلد آخر', ''],
];
function LeadForm({ config, openPrivacy }: { config: PublicConfig; openPrivacy: () => void }) {
  const [country, setCountry] = useState('MA');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const submissionId = useRef(crypto.randomUUID());
  const formStarted = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const rawPhone = String(data.get('phone') || '')
      .replace(/[\s().-]/g, '')
      .replace(/^00/, '+');
    const dialCode = countries.find((c) => c[0] === country)?.[2] || '';
    const phone = rawPhone.startsWith('+') ? rawPhone : dialCode + rawPhone.replace(/^0/, '');
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setPhoneError('دخل رقم صحيح، ومعاه رمز البلد إلا كنت مختار «بلد آخر».');
      form.querySelector<HTMLInputElement>('[name="phone"]')?.focus();
      return;
    }
    const name = String(data.get('name') || '').trim();
    if (!/^[\p{L}\p{M}\s.'’-]{2,80}$/u.test(name)) {
      setError('المرجو تدخل اسم صحيح بالحروف، من جوج حتى 80 حرف.');
      setStatus('error');
      return;
    }
    setPhoneError('');
    setError('');
    setStatus('sending');
    const params = new URLSearchParams(location.search);
    try {
      await submitEnquiry({
        submissionId: submissionId.current,
        name,
        phone,
        country,
        experience: String(data.get('experience') || 'beginner'),
        interest: String(data.get('interest') || 'unsure'),
        consent: data.get('consent') === 'on',
        website: String(data.get('website') || ''),
        attribution: {
          source: (params.get('utm_source') || '').slice(0, 120),
          medium: (params.get('utm_medium') || '').slice(0, 120),
          campaign: (params.get('utm_campaign') || '').slice(0, 120),
        },
      });
      setWhatsappMessage(
        `سلام Ecomlik، بغيت نعرف تفاصيل ${business.courseName} (${business.price} درهم / ${business.priceUsd} دولار).\nالاسم: ${name}\nالهاتف: ${phone}\nبلد الإقامة: ${countries.find((c) => c[0] === country)?.[1]}\nالمرحلة: ${form.querySelector<HTMLSelectElement>('[name="experience"]')?.selectedOptions[0]?.text}\nالاهتمام: ${form.querySelector<HTMLSelectElement>('[name="interest"]')?.selectedOptions[0]?.text}`,
      );
      setStatus('success');
      track('lead_submit_success', { form: 'training_enquiry' });
    } catch (e) {
      setError(
        e instanceof Error && e.name !== 'TimeoutError' && e.name !== 'TypeError'
          ? e.message
          : 'الطلب ما تأكّدش. شوف الاتصال بالإنترنت وعاود جرّب؛ معلوماتك باقية فالفورم.',
      );
      setStatus('error');
      track('lead_submit_error', { form: 'training_enquiry' });
    }
  }

  if (status === 'success')
    return (
      <div className="form-success" ref={successRef} tabIndex={-1}>
        <span className="success-icon">
          <Check size={34} />
        </span>
        <h3>
          حفظنا طلبك.
          <br />
          كمل التواصل فواتساب.
        </h3>
        <p>
          ضغط على الزر باش تفتح واتساب وترسل رسالة الطلب لفريق Ecomlik. تقدر تراجع الرسالة قبل ما
          ترسلها.
        </p>
        <span className="success-note">
          <ShieldCheck size={16} /> ما درتي حتى أداء، وما عندك حتى التزام بالشراء.
        </span>
        {config.whatsappNumber && (
          <a
            className="button button-primary"
            href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            onClick={() => track('whatsapp_click', { location: 'form_success' })}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} /> نرسل رسالتي على واتساب
          </a>
        )}
        <a className="text-action" href={business.channelUrl} target="_blank" rel="noreferrer">
          اكتشف المحتوى ديالنا <ArrowUpLeft size={17} />
        </a>
      </div>
    );
  return (
    <form
      className="lead-form"
      name={usesNetlifyForms ? netlifyFormName : undefined}
      method="POST"
      action={usesNetlifyForms ? '/' : '/api/leads'}
      onSubmit={submit}
      onFocus={() => {
        if (!formStarted.current) {
          formStarted.current = true;
          track('lead_form_start', { form: 'training_enquiry' });
        }
      }}
      onBlur={(e) => {
        const target = e.target;
        if (
          (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) &&
          target.name &&
          target.value &&
          !['website', 'consent'].includes(target.name)
        )
          track('lead_field_completed', { field: target.name });
      }}
    >
      {usesNetlifyForms && <input type="hidden" name="form-name" value={netlifyFormName} />}
      <div className="form-heading">
        <span className="form-icon">
          <Send size={21} />
        </span>
        <div>
          <h3>خلّي لينا وسيلة التواصل</h3>
          <p>باش توصلك تفاصيل التكوين اللي كتحتاج.</p>
        </div>
      </div>
      {status === 'error' && (
        <div className="form-error" role="alert" ref={errorRef} tabIndex={-1}>
          {error}
        </div>
      )}
      <label htmlFor="name">
        الاسم ديالك <span aria-hidden="true">*</span>
      </label>
      <input
        id="name"
        name="name"
        autoComplete="name"
        placeholder="كيفاش نناديك؟"
        required
        minLength={2}
        maxLength={80}
      />
      <div className="form-row">
        <div>
          <label htmlFor="country">
            بلد الإقامة <span aria-hidden="true">*</span>
          </label>
          <div className="select-wrap">
            <select
              id="country"
              name="country"
              autoComplete="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option value={c[0]} key={c[0]}>
                  {c[1]}
                </option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
        <div>
          <label htmlFor="phone">
            رقم الهاتف / واتساب <span aria-hidden="true">*</span>
          </label>
          <div className={`phone-wrap ${phoneError ? 'invalid' : ''}`}>
            <span dir="ltr">{countries.find((c) => c[0] === country)?.[2] || '+'}</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              dir="ltr"
              autoComplete="tel-national"
              placeholder="06 12 34 56 78"
              required
              maxLength={24}
              aria-invalid={Boolean(phoneError)}
              aria-describedby={phoneError ? 'phone-error' : 'phone-hint'}
              onChange={() => setPhoneError('')}
            />
          </div>
        </div>
      </div>
      {phoneError ? (
        <p id="phone-error" className="field-error">
          {phoneError}
        </p>
      ) : (
        <p className="field-hint" id="phone-hint">
          تقدر تدخل حتى الرقم الدولي كامل، بحال ‎+212612345678.
        </p>
      )}
      <div className="form-row">
        <div>
          <label htmlFor="experience">فين وصلتي دابا؟</label>
          <div className="select-wrap">
            <select id="experience" name="experience" defaultValue="beginner">
              <option value="beginner">باغي نبدا من الصفر</option>
              <option value="exploring">كنقلّب على الفكرة</option>
              <option value="started">عندي منتج وباغي نطوّرو</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
        <div>
          <label htmlFor="interest">شنو اللي كيهّمك؟</label>
          <div className="select-wrap">
            <select id="interest" name="interest" defaultValue="unsure">
              <option value="unsure">باغي نفهم ونختار</option>
              <option value="create">نصاوب منتج ديالي</option>
              <option value="resell">إعادة البيع بترخيص</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent-label">
        <input type="checkbox" name="consent" required />
        <span>
          موافق يتواصل معايا فريق Ecomlik بخصوص هاد الطلب، وقريت{' '}
          <button type="button" className="inline-link" onClick={openPrivacy}>
            سياسة الخصوصية
          </button>
          .
        </span>
      </label>
      <button
        type="submit"
        className="button button-primary form-submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? (
          <>
            <LoaderCircle className="spin" size={19} /> كنحفظو الطلب...
          </>
        ) : (
          <>
            نحفظ الطلب ونكمل فواتساب <ArrowLeft size={19} />
          </>
        )}
      </button>
      <p className="form-reassurance">
        <LockKeyhole size={14} /> معلوماتك للتواصل على طلبك. بلا أداء وبلا التزام.
      </p>
    </form>
  );
}

function Join({ config, openPrivacy }: { config: PublicConfig; openPrivacy: () => void }) {
  const [currency, setCurrency] = useState<'MAD' | 'USD'>('MAD');
  return (
    <section id="join" className="section join-section">
      <div className="container join-grid">
        <div className="join-copy">
          <span className="eyebrow">الخطوة الجاية ديالك</span>
          <h2>
            فكرتك كتستاهل
            <br />
            تعطيها فرصة.
          </h2>
          <p>
            تعرّف على Ecomlik Academy، وخذ التفاصيل اللي كتحتاج باش تشوف واش هاد التكوين مناسب للهدف
            والمرحلة ديالك.
          </p>
          <div className="offer-name">
            <span>
              <GraduationCap size={28} />
            </span>
            <div>
              <small>دروس مسجّلة + لقاءات مباشرة</small>
              <h3 dir="ltr">{business.courseName}</h3>
            </div>
          </div>
          <div className="offer-price">
            <div className="currency-switch" role="group" aria-label="اختيار عملة الثمن">
              <button aria-pressed={currency === 'MAD'} onClick={() => setCurrency('MAD')}>
                درهم
              </button>
              <button aria-pressed={currency === 'USD'} onClick={() => setCurrency('USD')}>
                دولار
              </button>
            </div>
            <strong>
              {(currency === 'MAD' ? business.price : business.priceUsd).toLocaleString('en-US')}
              <span>{currency === 'MAD' ? 'درهم' : 'دولار'}</span>
            </strong>
            <p>استمارة طلب معلومات فقط. ما فيها حتى أداء.</p>
          </div>
          <ul className="join-steps">
            <li>
              <span>1</span>
              <div>
                <strong>كتعمّر الطلب</strong>
                <p>بالاسم ووسيلة التواصل ديالك.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>كتكمل فواتساب</strong>
                <p>كتراجع الرسالة وكترسلها للفريق.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>كتختار على بيّنة</strong>
                <p>كتتأكد من المحتوى والمواعيد والشروط قبل الأداء.</p>
              </div>
            </li>
          </ul>
          <div className="join-footnote">
            <MessageCircle size={20} />
            <a
              href={`https://wa.me/${config.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('whatsapp_click', { location: 'offer' })}
            >
              عندك سؤال؟ تواصل معانا مباشرة على واتساب.
            </a>
          </div>
        </div>
        <div className="form-card">
          <LeadForm config={config} openPrivacy={openPrivacy} />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="section faq-section">
      <div className="container faq-grid">
        <div className="faq-intro">
          <span className="eyebrow">باش تكون الصورة واضحة</span>
          <h2>
            أسئلة كتجي
            <br />
            فبالك؟
          </h2>
          <p>هادي أجوبة على أكثر النقط اللي تقدر تحتاج تفهم قبل ما تبدا.</p>
          <a href="#join" className="text-action">
            باقي عندي سؤال <ArrowLeft size={17} />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={19} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function LegalDialog({ kind, onClose }: { kind: 'privacy' | 'terms' | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (kind && !ref.current?.open) ref.current?.showModal();
    if (!kind && ref.current?.open) ref.current.close();
  }, [kind]);
  return (
    <dialog
      ref={ref}
      className="legal-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="legal-title"
    >
      <div className="legal-content">
        <button className="dialog-close" aria-label="إغلاق" onClick={onClose}>
          <X />
        </button>
        <h2 id="legal-title">{kind === 'privacy' ? 'سياسة الخصوصية' : 'شروط الاستعمال'}</h2>
        {kind === 'privacy' ? (
          <>
            <p>
              ملي كتعمّر استمارة الاهتمام، كنحتافظو بالاسم، رقم الهاتف، بلد الإقامة، المرحلة اللي
              نتا فيها واهتمامك بالتكوين، مع وقت الموافقة ومصدر الحملة إلا كان موجود. الهدف هو
              متابعة طلبك والتواصل معاك بخصوص التكوين.
            </p>
            <p>
              {usesNetlifyForms
                ? 'المعلومات كتتحفظ فخدمة Netlify Forms اللي كنستعملوها لاستقبال ومتابعة الطلبات. الفريق كيقدر يشوفها من لوحة التحكم الخاصة بالموقع.'
                : 'المعلومات كتتحفظ فقاعدة بيانات الموقع. إلا كان نظام متابعة الزبناء مربوط، كتوصّل ليه نفس المعلومات باش يتابع الفريق الطلب.'}{' '}
              ما كنعرضوش معلوماتك للعموم وما كنبيعوهاش.
            </p>
            <p>
              تقدر تطلب تصحيح أو حذف معلوماتك أو توقف التواصل عن طريق نفس وسيلة التواصل اللي
              استعملها الفريق معاك. هاد الموافقة ما كتشملكش تلقائياً فلائحة إشهارية.
            </p>
            <p>
              تتبّع التحليلات اختياري. ملي كتوافق عليه، نقدر نقيسو زيارة الصفحة، الضغط على الأزرار،
              بداية الاستمارة، اسم الخانة اللي تكملات ونجاح الإرسال. الأسماء، أرقام الهاتف ومحتوى
              الخانات ما كيتصيفطوش لأدوات التحليلات.
            </p>
            <p>
              تقدر تبدّل اختيار التحليلات من «إعدادات الخصوصية» فأسفل الصفحة. سحب الموافقة كيوقف
              التتبّع فالموقع وكيعاود يحمّل الصفحة. حذف الكوكيز اللي سبق تخزنو ممكن من إعدادات
              المتصفح.
            </p>
            <p>إلا ضغطتي على يوتيوب أو واتساب، كتنتاقل لخدمة خارجية بسياسة خصوصية ديالها.</p>
          </>
        ) : (
          <>
            <p>
              هاد الموقع كيقدّم معلومات على تعلّم إنشاء المنتجات الرقمية وإعادة بيع المنتجات اللي
              كتسمح تراخيصها بذلك. المحتوى التعليمي ما كيشكّلش وعد بالأرباح ولا استشارة قانونية أو
              ضريبية.
            </p>
            <p>
              استمارة الاهتمام هي طلب معلومات، وماشي شراء أو عقد تسجيل. الثمن، صيغة التكوين، المحتوى
              النهائي وشروط الشراء والاسترجاع خاصها تتوضّح ليك قبل أي أداء.
            </p>
            <p>
              حقوق أي منتج كتخضع لترخيص صاحب الحقوق. ماشي أي ملف كتلقاه فالإنترنت مسموح تعاود تبيعو.
              النتائج كتختلف حسب السوق، التطبيق، الوقت والمجهود.
            </p>
            <p>روابط المواقع الخارجية كتخضع للشروط ديال الجهات اللي كتسيّرها.</p>
          </>
        )}
      </div>
    </dialog>
  );
}

function CookieNotice({
  open,
  setOpen,
  config,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  config: PublicConfig;
}) {
  function choose(accepted: boolean) {
    setAnalyticsConsent(accepted);
    setOpen(false);
    if (accepted) initializeAnalytics(config);
    else if (document.getElementById('ecomlik-ga') || document.getElementById('ecomlik-meta'))
      location.reload();
  }
  if (!open) return null;
  return (
    <aside className="cookie-notice" aria-label="اختيار الخصوصية">
      <ShieldCheck size={23} />
      <div>
        <strong>الخصوصية ديالك مهمة.</strong>
        <p>
          واش تسمح لينا بقياس استعمال الصفحة باش نحسّنوها؟ محتوى الاستمارة ما كيتشاركش مع أدوات
          التحليلات.
        </p>
        <div className="cookie-actions">
          <button onClick={() => choose(true)}>نوافق على التحليلات</button>
          <button onClick={() => choose(false)}>غير الضروري</button>
        </div>
      </div>
    </aside>
  );
}

function Footer({
  onLegal,
  onCookies,
}: {
  onLegal: (k: 'privacy' | 'terms') => void;
  onCookies: () => void;
}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/brand/logo.svg" alt="Ecomlik" width="173" height="47" />
            </div>
            <p>
              من فكرة واضحة،
              <br />
              لمنتج كيقدّم قيمة.
            </p>
          </div>
          <div>
            <h3>اكتشف Ecomlik</h3>
            <a href="#why">علاش المنتجات الرقمية؟</a>
            <a href="#program">المسار التعليمي</a>
            <a href="#compare">قارن المجالات</a>
          </div>
          <div>
            <h3>نبقاو على تواصل</h3>
            <a href={business.channelUrl} target="_blank" rel="noreferrer">
              <Youtube size={17} /> قناة يوتيوب <ArrowUpLeft size={15} />
            </a>
            <a href="#join">طلب معلومات على التكوين</a>
            <a href="#faq">الأسئلة الشائعة</a>
          </div>
          <div className="footer-message">
            <Globe2 size={25} />
            <p>
              من المغرب،
              <br />
              للمغاربة فكل بلاصة.
            </p>
            <span>تعلّم بطريقتك، وفالوقت المناسب ليك.</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ecomlik. جميع الحقوق محفوظة.</span>
          <div>
            <button onClick={() => onLegal('privacy')}>الخصوصية</button>
            <button onClick={() => onLegal('terms')}>شروط الاستعمال</button>
            <button onClick={onCookies}>إعدادات الخصوصية</button>
          </div>
        </div>
        <p className="footer-disclaimer">
          التكوين تعليمي. النتائج كتختلف حسب التطبيق والسوق، وما كاين حتى ضمان للدخل.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [config, setConfig] = useState<PublicConfig>(defaultPublicConfig);
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);
  const [cookies, setCookies] = useState(() => {
    try {
      return localStorage.getItem(consentKey) === null;
    } catch {
      return true;
    }
  });
  useEffect(() => {
    let alive = true;
    loadPublicConfig()
      .then((c: PublicConfig) => {
        if (alive) {
          setConfig(c);
          initializeAnalytics(c);
        }
      })
      .catch(() => {
        /* Lead capture does not depend on optional tracking configuration. */
      });
    return () => {
      alive = false;
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        تجاوز القائمة للمحتوى
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Why />
        <Products />
        <Program />
        <Comparison />
        <Community />
        <Join config={config} openPrivacy={() => setLegal('privacy')} />
        <FAQ />
        <section className="final-cta">
          <div className="container">
            <div>
              <span>البداية ما خاصّهاش تكون معقّدة.</span>
              <h2>فكرة واحدة. وخطوة واضحة لقدّام.</h2>
            </div>
            <LeadLink location="final">ناخذ الخطوة الأولى</LeadLink>
          </div>
        </section>
      </main>
      <Footer onLegal={setLegal} onCookies={() => setCookies(true)} />
      <div className="mobile-cta">
        <span>بدا مشروعك الرقمي على أساس واضح</span>
        <LeadLink location="mobile">نعرف تفاصيل التكوين</LeadLink>
      </div>
      <LegalDialog kind={legal} onClose={() => setLegal(null)} />
      <CookieNotice open={cookies} setOpen={setCookies} config={config} />
    </>
  );
}
