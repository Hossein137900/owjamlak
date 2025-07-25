export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  contentHtml?: string; // New field for HTML content
  tableOfContents?: { id: string; title: string }[]; // For navigation
}

interface ApproachStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}
interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  project: string;
}
export interface WorkItem {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  category: "residential" | "commercial" | "rental" | "consultation";
  location: string;
  completionDate: string;
  clientName?: string;
  testimonial?: string;
}
export const blogs: Blog[] = [
  {
    id: "buying-first-apartment",
    title: "راهنمای خرید اولین آپارتمان: نکات طلایی برای خریداران",
    excerpt:
      "خرید اولین آپارتمان می‌تواند یکی از مهم‌ترین تصمیمات مالی زندگی شما باشد. در این مقاله، نکات کلیدی برای اطمینان از یک خرید موفق را بررسی می‌کنیم.",
    coverImage: "/assets/images/hero4.jpg",
    author: "علی محمدی",
    date: "۱۵ مرداد ۱۴۰۲",
    readTime: "۸ دقیقه",
    category: "خرید ملک",
    tableOfContents: [
      { id: "introduction", title: "مقدمه" },
      { id: "main-points", title: "نکات اصلی" },
      { id: "tips", title: "توصیه‌های کاربردی" },
      { id: "conclusion", title: "نتیجه‌گیری" },
    ],
    contentHtml: `
      <section id="introduction" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">مقدمه</h2>
        <p>خرید اولین آپارتمان یکی از هیجان‌انگیزترین و در عین حال استرس‌زاترین تجربه‌های زندگی است. این تصمیم نه تنها بر وضعیت مالی شما تأثیر می‌گذارد، بلکه کیفیت زندگی شما را نیز برای سال‌های آینده تعیین می‌کند.</p>
        <p>در دنیای امروز، داشتن اطلاعات کافی قبل از هرگونه تصمیم‌گیری در حوزه املاک بسیار ضروری است. این مقاله به شما کمک می‌کند تا با دیدی روشن‌تر و آگاهانه‌تر در این مسیر قدم بردارید. ما در این مقاله سعی کرده‌ایم تمامی جوانب مهم را بررسی کنیم تا شما بتوانید بهترین تصمیم را بگیرید.</p>
      </section>

      <section id="main-points" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">نکات اصلی</h2>
        <p>در این بخش به بررسی مهم‌ترین نکاتی می‌پردازیم که باید در نظر داشته باشید:</p>
        <ul class="list-disc pr-6 mt-4">
          <li class="mb-2">
            <strong>بررسی موقعیت جغرافیایی:</strong> موقعیت ملک یکی از مهم‌ترین فاکتورهای تأثیرگذار بر ارزش آن است. دسترسی به مراکز خرید، مدارس، بیمارستان‌ها و وسایل حمل و نقل عمومی را در نظر بگیرید.
          </li>
          <li class="mb-2">
            <strong>بررسی وضعیت حقوقی ملک:</strong> اطمینان از صحت اسناد مالکیت و نداشتن مشکلات حقوقی از ضروریات خرید ملک است.
          </li>
          <li class="mb-2">
            <strong>توجه به کیفیت ساخت:</strong> بررسی کیفیت مصالح به کار رفته، عمر ساختمان و استانداردهای ایمنی بسیار مهم است.
          </li>
          <li class="mb-2">
            <strong>برنامه‌ریزی مالی:</strong> تعیین بودجه مناسب و بررسی شرایط وام‌های مسکن می‌تواند به شما در تصمیم‌گیری بهتر کمک کند.
          </li>
        </ul>
      </section>

      <section id="tips" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">توصیه‌های کاربردی</h2>
        <p>برای موفقیت در این حوزه، توصیه‌های زیر می‌تواند راهگشا باشد:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 class="font-bold text-lg mb-2">قبل از خرید</h3>
            <p>حتماً از چندین ملک بازدید کنید و آنها را با هم مقایسه کنید. از مشاوران املاک معتبر کمک بگیرید و تحقیقات کافی درباره محله مورد نظر انجام دهید.</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 class="font-bold text-lg mb-2">هنگام معامله</h3>
            <p>تمامی جزئیات قرارداد را با دقت مطالعه کنید و در صورت نیاز از مشاوره حقوقی بهره ببرید. از پرداخت وجه قبل از اطمینان از صحت اسناد خودداری کنید.</p>
          </div>
        </div>
      </section>

      <section id="conclusion" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">نتیجه‌گیری</h2>
        <p>با رعایت نکات ذکر شده در این مقاله، می‌توانید با اطمینان بیشتری در بازار املاک فعالیت کنید. به یاد داشته باشید که خرید ملک یک سرمایه‌گذاری بلندمدت است و باید با دقت و حوصله کافی انجام شود.</p>
        <p>امیدواریم این مقاله توانسته باشد اطلاعات مفیدی در اختیار شما قرار دهد و به شما در تصمیم‌گیری بهتر کمک کند.</p>
      </section>
    `,
  },
  {
    id: "real-estate-investment-2023",
    title: "بهترین استراتژی‌های سرمایه‌گذاری در املاک در سال ۱۴۰۲",
    excerpt:
      "با توجه به نوسانات بازار مسکن، سرمایه‌گذاری هوشمندانه در املاک نیازمند استراتژی‌های به‌روز است. در این مقاله، روش‌های موفق سرمایه‌گذاری در سال جاری را بررسی می‌کنیم.",
    coverImage: "/assets/images/hero4.jpg",
    author: "سارا رضایی",
    date: "۲۳ تیر ۱۴۰۲",
    readTime: "۱۰ دقیقه",
    category: "سرمایه‌گذاری",
    tableOfContents: [
      { id: "introduction", title: "مقدمه" },
      { id: "main-points", title: "استراتژی‌های کلیدی" },
      { id: "tips", title: "نکات مهم" },
      { id: "conclusion", title: "جمع‌بندی" },
    ],
    contentHtml: `
      <section id="introduction" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">مقدمه</h2>
        <p>در سال ۱۴۰۲، بازار املاک ایران همچنان یکی از گزینه‌های جذاب برای سرمایه‌گذاری است، اما نوسانات اقتصادی و تغییرات قیمت‌ها، انتخاب استراتژی مناسب را ضروری کرده است.</p>
        <p>در این مقاله، به بررسی بهترین روش‌های سرمایه‌گذاری در بازار املاک با توجه به شرایط فعلی اقتصاد ایران می‌پردازیم و راهکارهایی برای کاهش ریسک و افزایش بازدهی ارائه می‌دهیم.</p>
      </section>

      <section id="main-points" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">استراتژی‌های کلیدی</h2>
        <p>استراتژی‌های زیر می‌توانند به شما در سرمایه‌گذاری موفق در بازار املاک کمک کنند:</p>
        <ul class="list-disc pr-6 mt-4">
          <li class="mb-2">
            <strong>سرمایه‌گذاری در مناطق در حال توسعه:</strong> مناطقی که طرح‌های توسعه شهری در آنها در حال اجراست، پتانسیل رشد قیمت بالایی دارند.
          </li>
          <li class="mb-2">
            <strong>خرید املاک تجاری با بازدهی اجاره بالا:</strong> املاک تجاری معمولاً بازدهی اجاره بالاتری نسبت به املاک مسکونی دارند.
          </li>
          <li class="mb-2">
            <strong>بازسازی و فروش املاک قدیمی (فلیپینگ):</strong> خرید املاک قدیمی، بازسازی و فروش آنها می‌تواند سود قابل توجهی به همراه داشته باشد.
          </li>
          <li class="mb-2">
            <strong>سرمایه‌گذاری در پروژه‌های ساخت و ساز مشارکتی:</strong> مشارکت در ساخت می‌تواند ریسک سرمایه‌گذاری را کاهش دهد.
          </li>
        </ul>
      </section>

      <section id="tips" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">نکات مهم</h2>
        <div class="bg-yellow-50 p-5 rounded-lg border border-yellow-200 mb-4">
          <h3 class="font-bold text-lg mb-2">تحلیل بازار</h3>
          <p>قبل از هر سرمایه‌گذاری، تحلیل دقیقی از بازار منطقه مورد نظر انجام دهید. روند قیمت‌ها در سال‌های گذشته، طرح‌های توسعه شهری و پروژه‌های زیرساختی آینده را بررسی کنید.</p>
        </div>
        <div class="bg-blue-50 p-5 rounded-lg border border-blue-200">
          <h3 class="font-bold text-lg mb-2">تنوع‌بخشی به سرمایه‌گذاری</h3>
          <p>تمام سرمایه خود را در یک پروژه یا یک منطقه متمرکز نکنید. تنوع‌بخشی به سبد سرمایه‌گذاری می‌تواند ریسک را کاهش دهد.</p>
        </div>
      </section>

      <section id="conclusion" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">جمع‌بندی</h2>
        <p>سرمایه‌گذاری در املاک همچنان یکی از روش‌های مطمئن برای حفظ ارزش سرمایه در برابر تورم است، اما موفقیت در این بازار نیازمند دانش، تحقیق و استراتژی مناسب است.</p>
        <p>با به‌کارگیری نکات ذکر شده در این مقاله، می‌توانید ریسک سرمایه‌گذاری خود را کاهش داده و بازدهی مناسبی کسب کنید. به یاد داشته باشید که بازار املاک یک بازار بلندمدت است و نباید انتظار سود سریع داشته باشید.</p>
      </section>
    `,
  },
];

export const worksData: WorkItem[] = [
  {
    id: "1",
    title: "مجتمع مسکونی پارسیان",
    description:
      "این پروژه شامل طراحی و ساخت یک مجتمع مسکونی لوکس با 24 واحد آپارتمان در منطقه شمال تهران است. این مجتمع دارای امکانات رفاهی متنوعی از جمله استخر، سالن ورزشی و فضای سبز اختصاصی می‌باشد. پروژه با رعایت استانداردهای روز ساختمان و با استفاده از مصالح مرغوب اجرا شده است.",
    imagePath: "/assets/images/hero3.png",
    category: "residential",
    location: "تهران، زعفرانیه",
    completionDate: "1402/03/15",
    clientName: "شرکت سرمایه‌گذاری آینده",
    testimonial:
      "همکاری با تیم املاک شما تجربه بسیار خوبی بود. از کیفیت کار و تعهد به زمان‌بندی پروژه بسیار راضی هستیم.",
  },
  {
    id: "2",
    title: "مجتمع تجاری نگین",
    description:
      "طراحی و اجرای مجتمع تجاری نگین با مساحت 5000 مترمربع در مرکز شهر. این مجتمع شامل 40 واحد تجاری، رستوران و کافی‌شاپ، پارکینگ طبقاتی و سیستم هوشمند مدیریت ساختمان می‌باشد. این پروژه با هدف ایجاد فضایی مدرن برای کسب و کارهای مختلف طراحی و اجرا شده است.",
    imagePath: "/assets/images/hero3.png",
    category: "commercial",
    location: "اصفهان، خیابان چهارباغ",
    completionDate: "1401/11/20",
    clientName: "هلدینگ توسعه تجارت نوین",
    testimonial:
      "پروژه مجتمع تجاری ما با کیفیت عالی و در زمان مقرر تحویل داده شد. مشاوره‌های تخصصی شما در طول پروژه بسیار ارزشمند بود.",
  },
  {
    id: "3",
    title: "مشاوره خرید ویلای ساحلی",
    description:
      "ارائه خدمات مشاوره تخصصی برای خرید ویلای ساحلی لوکس. این پروژه شامل بررسی موقعیت‌های مختلف، تحلیل قیمت، مذاکره با فروشندگان و انجام امور حقوقی و ثبتی بود. با کمک تیم ما، مشتری توانست بهترین گزینه را با قیمتی مناسب خریداری کند.",
    imagePath: "/assets/images/hero4.jpg",
    category: "consultation",
    location: "شمال ایران، منطقه ساحلی نوشهر",
    completionDate: "1402/05/10",
    clientName: "جناب آقای محمدی",
    testimonial:
      "از مشاوره‌های دقیق و تخصصی شما بسیار سپاسگزارم. بدون کمک شما، یافتن ویلای مناسب با این شرایط برایم غیرممکن بود.",
  },
  {
    id: "4",
    title: "اجاره مجموعه اداری سپهر",
    description:
      "مدیریت اجاره یک مجموعه اداری 1200 متری به یک شرکت بزرگ IT. این پروژه شامل بازاریابی، مذاکره با مستاجران بالقوه، تنظیم قرارداد اجاره و مدیریت تحویل ملک بود. با تلاش تیم ما، این مجموعه با شرایط مطلوب برای هر دو طرف به اجاره رفت.",
    imagePath: "/assets/images/hero3.png",
    category: "rental",
    location: "تهران، خیابان ولیعصر",
    completionDate: "1402/02/25",
    clientName: "شرکت فناوری اطلاعات پیشرو",
    testimonial:
      "فرآیند اجاره با کمک شما بسیار روان و حرفه‌ای پیش رفت. از پیگیری‌های مستمر و دقت در تنظیم قرارداد بسیار راضی هستیم.",
  },
  {
    id: "5",
    title: "مجتمع مسکونی آسمان",
    description:
      "طراحی و ساخت مجتمع مسکونی آسمان با 18 واحد لوکس در منطقه‌ای خوش آب و هوا. این مجتمع با معماری مدرن و استفاده از متریال درجه یک ساخته شده و دارای امکاناتی نظیر لابی مجلل، سیستم امنیتی پیشرفته و فضای بازی کودکان است.",
    imagePath: "/assets/images/hero4.jpg",
    category: "residential",
    location: "شیراز، منطقه صدرا",
    completionDate: "1401/09/15",
    clientName: "تعاونی مسکن فرهنگیان",
  },
  {
    id: "6",
    title: "مرکز خرید ستاره",
    description:
      "بازسازی و نوسازی یک مرکز خرید قدیمی با مساحت 3500 مترمربع. این پروژه شامل طراحی نمای جدید، بهینه‌سازی فضاهای داخلی، نصب آسانسور و پله برقی، و ارتقای سیستم‌های تاسیساتی بود. نتیجه کار، تبدیل یک ساختمان قدیمی به یک مرکز خرید مدرن و جذاب است.",
    imagePath: "/assets/images/hero3.png",
    category: "commercial",
    location: "مشهد، خیابان احمدآباد",
    completionDate: "1402/04/20",
  },
  {
    id: "7",
    title: "مشاوره سرمایه‌گذاری ملکی",
    description:
      "ارائه خدمات مشاوره برای سرمایه‌گذاری در بازار املاک تجاری. این پروژه شامل تحلیل بازار، شناسایی فرصت‌های سرمایه‌گذاری، محاسبه نرخ بازگشت سرمایه و ارائه گزارش‌های تخصصی بود. با راهنمایی‌های ما، مشتری توانست سرمایه خود را در بهترین موقعیت‌های ممکن سرمایه‌گذاری کند.",
    imagePath: "/assets/images/hero2.png",
    category: "consultation",
    location: "سراسر ایران",
    completionDate: "1402/01/15",
    clientName: "گروه سرمایه‌گذاری امید",
    testimonial:
      "تحلیل‌های دقیق و مشاوره‌های تخصصی شما باعث شد تصمیمات بهتری برای سرمایه‌گذاری بگیریم. از همکاری با شما بسیار خرسندیم.",
  },
  {
    id: "8",
    title: "اجاره ویلاهای گردشگری",
    description:
      "مدیریت اجاره مجموعه‌ای از ویلاهای گردشگری در شمال کشور. این پروژه شامل بازاریابی، رزرواسیون، تنظیم قراردادها، و مدیریت خدمات اقامتی بود. با تلاش تیم ما، این ویلاها با ضریب اشغال بالایی به گردشگران اجاره داده شدند.",
    imagePath: "/assets/images/hero4.jpg",
    category: "rental",
    location: "گیلان، منطقه ساحلی انزلی",
    completionDate: "1401/12/20",
    clientName: "شرکت گردشگری نگین خزر",
  },
  {
    id: "9",
    title: "برج مسکونی الماس",
    description:
      "مشارکت در ساخت برج مسکونی 15 طبقه با 60 واحد لوکس. این پروژه با استانداردهای بالای مهندسی و با استفاده از تکنولوژی‌های نوین ساختمانی اجرا شده است. طراحی داخلی واحدها با توجه به اصول زیبایی‌شناسی و کاربردی بودن انجام شده است.",
    imagePath: "/assets/images/hero3.png",
    category: "residential",
    location: "تبریز، ولیعصر",
    completionDate: "1401/08/10",
  },
];

export const steps: ApproachStep[] = [
  {
    id: 1,
    title: "مشاوره تخصصی",
    description: "ارائه مشاوره تخصصی با توجه به نیازها و خواسته‌های شما",
    icon: "fas fa-comments",
  },
  {
    id: 2,
    title: "بررسی بازار",
    description: "تحلیل دقیق بازار و شناسایی بهترین فرصت‌ها",
    icon: "fas fa-search",
  },
  {
    id: 3,
    title: "ارائه گزینه‌ها",
    description: "معرفی بهترین گزینه‌های موجود متناسب با بودجه و نیاز شما",
    icon: "fas fa-list-check",
  },
  {
    id: 4,
    title: "مذاکره حرفه‌ای",
    description: "مذاکره حرفه‌ای برای دستیابی به بهترین شرایط و قیمت",
    icon: "fas fa-handshake",
  },
  {
    id: 5,
    title: "پشتیبانی حقوقی",
    description: "انجام تمامی امور حقوقی و قانونی با دقت و تخصص",
    icon: "fas fa-gavel",
  },
  {
    id: 6,
    title: "تحویل و پشتیبانی",
    description: "تحویل ملک و ارائه خدمات پشتیبانی پس از معامله",
    icon: "fas fa-house-circle-check",
  },
];
export const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "علی محمدی",
    role: "سرمایه‌گذار ملکی",
    content:
      "همکاری با تیم املاک شما تجربه بسیار خوبی بود. مشاوره‌های تخصصی و دقیق شما به من کمک کرد تا بهترین تصمیم را برای سرمایه‌گذاری بگیرم. از تعهد و پیگیری مستمر شما در طول پروژه بسیار سپاسگزارم.",
    avatar: "/images/testimonials/person1.jpg",
    rating: 5,
    project: "مشاوره سرمایه‌گذاری ملکی",
  },
  {
    id: "2",
    name: "مریم رضایی",
    role: "مدیرعامل شرکت توسعه تجارت",
    content:
      "پروژه مجتمع تجاری ما با کیفیت عالی و در زمان مقرر تحویل داده شد. تیم حرفه‌ای شما در تمام مراحل از طراحی تا اجرا، با دقت و تخصص کار را پیش بردند. مشاوره‌های تخصصی شما در طول پروژه بسیار ارزشمند بود.",
    avatar: "/images/testimonials/person2.jpg",
    rating: 5,
    project: "مجتمع تجاری نگین",
  },
  {
    id: "3",
    name: "محمد احمدی",
    role: "مدیر تعاونی مسکن",
    content:
      "از همکاری با مجموعه شما برای ساخت مجتمع مسکونی بسیار راضی هستیم. کیفیت کار، تعهد به زمان‌بندی و شفافیت در تمام مراحل، از ویژگی‌های بارز همکاری با شماست. قطعاً در پروژه‌های آینده نیز با شما همکاری خواهیم کرد.",
    avatar: "/images/testimonials/person3.jpg",
    rating: 4,
    project: "مجتمع مسکونی آسمان",
  },
  {
    id: "4",
    name: "سارا کریمی",
    role: "مدیر بازاریابی",
    content:
      "فرآیند اجاره دفتر کار با کمک شما بسیار روان و حرفه‌ای پیش رفت. از پیگیری‌های مستمر و دقت در تنظیم قرارداد بسیار راضی هستیم. مشاوره‌های شما برای انتخاب بهترین موقعیت برای دفتر کار ما بسیار کارآمد بود.",
    avatar: "/images/testimonials/person4.jpg",
    rating: 5,
    project: "اجاره مجموعه اداری سپهر",
  },
];


[
  {
    coordinates: { lat: 35.71035232346718, lng: 51.49653768552526 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "Shura",
      district: "District 13",
      neighborhood: "Tehran",
      fullAddress:
        "Hafez, Shura, District 13, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 17419-93111, Iran",
    },
    _id: null,
    title: "test2222",
    description: "tyjtyjtyjtyj",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/984ec860-93d9-4d06-9db2-3ff8244d941a",
        mainImage: true,
        _id: "68826e15a1bcbbf4baf5089a",
      },
    ],
    buildingDate: 4444,
    area: 4,
    rooms: 4444444,
    parentType: "residentialRent",
    tradeType: "Villa",
    depositRent: 5555555555,
    convertible: true,
    rentPrice: 444,
    location:
      "Hafez, Shura, District 13, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 17419-93111, Iran",
    contact: "03125252456",
    storage: true,
    floor: 55,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "pending",
    views: 0,
    createdAt: "2025-07-24T17:32:05.290Z",
    updatedAt: "2025-07-24T17:32:05.290Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.692684217147075, lng: 51.49128055585607 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "Abuzar",
      district: "District 14",
      neighborhood: "Tehran",
      fullAddress: "inja payini",
    },
    _id: null,
    title: "newtwst",
    description: "fef effefeefewfewf",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/c6ad06ec-9e26-42ae-994c-1fa867b0350c",
        mainImage: true,
        _id: "68826c84a1bcbbf4baf50874",
      },
    ],
    buildingDate: 1234,
    area: 44,
    rooms: 2,
    parentType: "commercialRent",
    tradeType: "Villa",
    depositRent: 12000000000,
    convertible: true,
    rentPrice: 15000000,
    location: "inja balayi",
    contact: "03125252456",
    storage: true,
    floor: 3,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "pending",
    views: 1,
    createdAt: "2025-07-24T17:25:24.166Z",
    updatedAt: "2025-07-24T17:31:25.173Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.70402974355948, lng: 51.35311889753213 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "Teymuri",
      district: "District 2",
      neighborhood: "Tehran",
      fullAddress:
        "Diba Dead End, Teymuri, District 2, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 84717-13874, Iran",
    },
    _id: null,
    title: "rgregergergerg",
    description: "gergergerg",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/b2dd86ff-c792-48db-bed4-c26d757dff55",
        mainImage: true,
        _id: "687cf493381c364149c2b553",
      },
    ],
    buildingDate: 1265,
    area: 555,
    rooms: 1,
    parentType: "residentialRent",
    tradeType: "partnerShip",
    depositRent: 5.554444444444445e21,
    convertible: false,
    rentPrice: 4444444444,
    location:
      "Diba Dead End, Teymuri, District 2, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 84717-13874, Iran",
    contact: "03125252456",
    storage: false,
    floor: 5,
    parking: false,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "sold",
    views: 8,
    createdAt: "2025-07-20T13:52:19.076Z",
    updatedAt: "2025-07-24T12:09:10.370Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.70347222283496, lng: 51.366117954385125 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "Towhid",
      district: "District 2",
      neighborhood: "Tehran",
      fullAddress:
        "Qiyasi Fard Dead End, Towhid, District 2, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 13456-97360, Iran",
    },
    _id: null,
    title: "7uu7u7u",
    description: "7iii76i76i76i76i",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/a5857c0c-b0a6-4cf1-9b58-da0b8b73f5d1",
        mainImage: true,
        _id: "687cf3c0d7dfc09d1fa1c55e",
      },
    ],
    buildingDate: 1695,
    area: 55,
    rooms: 5,
    parentType: "residentialRent",
    tradeType: "preSale",
    depositRent: 5555555555555555,
    convertible: false,
    rentPrice: 666,
    location:
      "Qiyasi Fard Dead End, Towhid, District 2, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 13456-97360, Iran",
    contact: "03125252456",
    storage: false,
    floor: 5,
    parking: false,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "pending",
    views: 7,
    createdAt: "2025-07-20T13:48:48.156Z",
    updatedAt: "2025-07-24T11:39:55.434Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.705324467405816, lng: 51.38653922087543 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "جمال‌زاده",
      district: "شهرداری منطقه شش ناحیه یک",
      neighborhood: "District 6",
      fullAddress:
        "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    },
    _id: null,
    title: "مسکونییی",
    description: " برچسب برچسب برچسب برچسب برچسب برچسب ",
    images: [],
    buildingDate: 1753315200000,
    area: 44,
    rooms: 55,
    parentType: "residentialSale",
    tradeType: "Old",
    totalPrice: 44242424242,
    pricePerMeter: 5888,
    depositRent: 6666666,
    convertible: true,
    rentPrice: 66456,
    location:
      "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    contact: "09121234567",
    storage: false,
    floor: 555,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "investment",
    status: "pending",
    views: 0,
    createdAt: "2025-07-20T12:54:33.851Z",
    updatedAt: "2025-07-20T12:54:33.851Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.705324467405816, lng: 51.38653922087543 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "جمال‌زاده",
      district: "شهرداری منطقه شش ناحیه یک",
      neighborhood: "District 6",
      fullAddress:
        "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    },
    _id: null,
    title: "مسکونییی",
    description: " برچسب برچسب برچسب برچسب برچسب برچسب ",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/6ad232cf-6c0e-4582-ac2e-a4782cf1651c",
        mainImage: true,
        _id: "687ce704d7dfc09d1fa1c00a",
      },
    ],
    buildingDate: 1753315200000,
    area: 44,
    rooms: 55,
    parentType: "residentialSale",
    tradeType: "Villa",
    totalPrice: 44242424242,
    pricePerMeter: 5888,
    depositRent: 6666666,
    convertible: true,
    rentPrice: 66456,
    location:
      "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    contact: "09121234567",
    storage: false,
    floor: 555,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "investment",
    status: "pending",
    views: 0,
    createdAt: "2025-07-20T12:54:28.127Z",
    updatedAt: "2025-07-20T12:54:28.127Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.705324467405816, lng: 51.38653922087543 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "جمال‌زاده",
      district: "شهرداری منطقه شش ناحیه یک",
      neighborhood: "District 6",
      fullAddress:
        "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    },
    _id: null,
    title: "اپارتمانخانه داری",
    description: " برچسب برچسب برچسب برچسب برچسب برچسب ",
    images: [],
    buildingDate: 1753315200000,
    area: 44,
    rooms: 55,
    parentType: "residentialSale",
    tradeType: "partnerShip",
    totalPrice: 44242424242,
    pricePerMeter: 5888,
    depositRent: 6666666,
    convertible: true,
    rentPrice: 66456,
    location:
      "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    contact: "09121234567",
    storage: false,
    floor: 555,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "investment",
    status: "pending",
    views: 11,
    createdAt: "2025-07-20T12:54:08.501Z",
    updatedAt: "2025-07-20T21:32:48.812Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.705324467405816, lng: 51.38653922087543 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "جمال‌زاده",
      district: "شهرداری منطقه شش ناحیه یک",
      neighborhood: "District 6",
      fullAddress:
        "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    },
    _id: null,
    title: "اپارتمان انباری شماره 2",
    description: " برچسب برچسب برچسب برچسب برچسب برچسب ",
    images: [],
    buildingDate: 1753315200000,
    area: 44,
    rooms: 55,
    parentType: "commercialRent",
    tradeType: "partnerShip",
    depositRent: 6666666,
    convertible: true,
    rentPrice: 66456,
    location:
      "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    contact: "09121234567",
    storage: false,
    floor: 555,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "investment",
    status: "pending",
    views: 2,
    createdAt: "2025-07-20T12:53:50.526Z",
    updatedAt: "2025-07-20T13:04:15.507Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.705324467405816, lng: 51.38653922087543 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "جمال‌زاده",
      district: "شهرداری منطقه شش ناحیه یک",
      neighborhood: "District 6",
      fullAddress:
        "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    },
    _id: null,
    title: "اپارتمان انباری",
    description: " برچسب برچسب برچسب برچسب برچسب برچسب ",
    images: [],
    buildingDate: 1753315200000,
    area: 44,
    rooms: 55,
    parentType: "commercialRent",
    tradeType: "partnerShip",
    depositRent: 6666666,
    convertible: true,
    rentPrice: 66456,
    location:
      "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    contact: "09121234567",
    storage: false,
    floor: 555,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "investment",
    status: "pending",
    views: 0,
    createdAt: "2025-07-20T12:53:41.165Z",
    updatedAt: "2025-07-20T12:53:41.165Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.705324467405816, lng: 51.38653922087543 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "جمال‌زاده",
      district: "شهرداری منطقه شش ناحیه یک",
      neighborhood: "District 6",
      fullAddress:
        "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    },
    _id: null,
    title: "دتتتتلاتلات",
    description: " برچسب برچسب برچسب برچسب برچسب برچسب ",
    images: [],
    buildingDate: 1753315200000,
    area: 44,
    rooms: 55,
    parentType: "commercialRent",
    tradeType: "partnerShip",
    depositRent: 6666666,
    convertible: true,
    rentPrice: 66456,
    location:
      "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    contact: "09121234567",
    storage: false,
    floor: 555,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "investment",
    status: "pending",
    views: 0,
    createdAt: "2025-07-20T12:53:27.381Z",
    updatedAt: "2025-07-20T12:53:27.381Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.705324467405816, lng: 51.38653922087543 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "جمال‌زاده",
      district: "شهرداری منطقه شش ناحیه یک",
      neighborhood: "District 6",
      fullAddress:
        "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    },
    _id: null,
    title: "ثبثصب ثصب ثصب فق ا",
    description: " برچسب برچسب برچسب برچسب برچسب برچسب ",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/9b9c86b9-9879-4923-9a9e-45b423c76bbd",
        mainImage: true,
        _id: "687ce6b6d7dfc09d1fa1bff1",
      },
    ],
    buildingDate: 1753315200000,
    area: 44,
    rooms: 55,
    parentType: "commercialRent",
    tradeType: "partnerShip",
    depositRent: 6666666,
    convertible: true,
    rentPrice: 66456,
    location:
      "Jamalzadeh, جمال‌زاده, ناحیه ۲, District 6, شهرداری منطقه شش ناحیه یک, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14188-93841, Iran",
    contact: "09121234567",
    storage: false,
    floor: 555,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "rented",
    views: 0,
    createdAt: "2025-07-20T12:53:10.314Z",
    updatedAt: "2025-07-24T12:03:46.101Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.73328636333678, lng: 51.3093795781606 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "Shahrak Parvaz",
      district: "District 5",
      neighborhood: "Tehran",
      fullAddress:
        "بزرگراه آیت الله حکیم, Shahrak Parvaz, District 5, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14818-16394, Iran",
    },
    _id: null,
    title: "اپارتمان کلنگی بهر",
    description: "ایجاد آگهی جدید\n",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/f82e2235-795c-4a81-804a-cf8df3467727",
        mainImage: true,
        _id: "687ce66ad7dfc09d1fa1bfee",
      },
    ],
    buildingDate: 1753315200000,
    area: 123,
    rooms: 3,
    parentType: "shortTermRent",
    tradeType: "Shop",
    depositRent: 230000000003,
    convertible: false,
    rentPrice: 3424,
    location:
      "بزرگراه آیت الله حکیم, Shahrak Parvaz, District 5, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14818-16394, Iran",
    contact: "03125252456",
    storage: false,
    floor: 2,
    parking: true,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "pending",
    views: 15,
    createdAt: "2025-07-20T12:51:54.709Z",
    updatedAt: "2025-07-24T11:45:08.605Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.7173458613837, lng: 51.33886241916117 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "Chub Tarash",
      district: "District 2",
      neighborhood: "Tehran",
      fullAddress:
        "Saeed Golab Boulevard, Chub Tarash, District 2, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14516-83831, Iran",
    },
    _id: null,
    title: "اپارتمان اندرزگو",
    description: "این یک متن تستی است",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/8b889434-c561-42d0-8ed3-3d5bccd310c5",
        mainImage: true,
        _id: "687ce5ffd7dfc09d1fa1bfd5",
      },
    ],
    buildingDate: 1752537600000,
    area: 444,
    rooms: 2,
    parentType: "residentialSale",
    tradeType: "House",
    totalPrice: 7000000000,
    pricePerMeter: 150000000,
    convertible: false,
    location:
      "Saeed Golab Boulevard, Chub Tarash, District 2, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 14516-83831, Iran",
    contact: "03125252456",
    storage: false,
    floor: 1,
    parking: false,
    lift: true,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "pending",
    views: 3,
    createdAt: "2025-07-20T12:50:07.905Z",
    updatedAt: "2025-07-20T12:50:30.198Z",
    __v: 0,
  },
  {
    coordinates: { lat: 35.699291997579564, lng: 51.37423324689736 },
    locationDetails: {
      province: "بخش مرکزی شهرستان تهران",
      city: "North Salsabil",
      district: "District 10",
      neighborhood: "Tehran",
      fullAddress: "صیصیصی ی صی صی صی صی ",
    },
    _id: null,
    title: "اپارتمان نارمک",
    description: "این یک متن تستی است",
    images: [
      {
        alt: "تصویر 1",
        url: "blob:http://localhost:3000/2b61569d-03e0-43bb-9cd2-6c0ae432f1e6",
        mainImage: true,
        _id: "687ce53dd7dfc09d1fa1bfa5",
      },
    ],
    buildingDate: 1752105600000,
    area: 444,
    rooms: 3,
    parentType: "residentialRent",
    tradeType: "Shop",
    depositRent: 2000000000,
    convertible: true,
    rentPrice: 12000000,
    location:
      "تیموری, North Salsabil, District 10, Tehran, بخش مرکزی شهرستان تهران, Tehran County, Tehran Province, 13456-85941, Iran",
    contact: "09350655062",
    storage: true,
    floor: 2,
    parking: true,
    lift: false,
    user: "683838a637d65797392334f5",
    type: "normal",
    status: "pending",
    views: 12,
    createdAt: "2025-07-20T12:46:53.932Z",
    updatedAt: "2025-07-24T11:31:40.620Z",
    __v: 0,
  },
];
