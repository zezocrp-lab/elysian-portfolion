export type Lang = "en" | "ar";

/* ------------------------------------------------------------------
   HOW TO ADD A PROJECT
   --------------------------------------------------------------
   Each project is one object in the `projects` array below — once in
   `en`, once in `ar`, with the same `id` in both.
   image: a screenshot URL, or "" to show the brand mark instead.
   link:  the live site or demo, or "" to hide the button.
   Empty the array and the section shows a tidy empty state.
   ------------------------------------------------------------------ */

export type Project = {
  id: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  stack: string[];
  image: string;
  link: string;
};

export type Content = {
  dir: "ltr" | "rtl";
  nav: { work: string; practice: string; tools: string; contact: string };
  switchTo: string;
  switchLabel: string;
  menu: string;
  /** First stop for a keyboard or screen reader, ahead of the whole header. */
  skipToContent: string;
  hero: {
    label: string;
    lines: string[];
    body: string;
    primary: string;
    secondary: string;
    scroll: string;
  };
  work: {
    label: string;
    heading: string;
    lead: string;
    countLabel: (n: number) => string;
    visit: string;
    empty: string;
    emptyCta: string;
    projects: Project[];
  };
  practice: { label: string; heading: string; items: { title: string; body: string }[] };
  tools: { label: string; heading: string; groups: { label: string; items: string[] }[] };
  contact: {
    label: string;
    headingTop: string;
    headingBottom: string;
    body: string;
    rows: { email: string; whatsapp: string; github: string; linkedin: string };
    fields: { name: string; email: string; phone: string; message: string };
    placeholders: { name: string; email: string; phone: string; message: string };
    optional: string;
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    /** Shown when the message was handed to the visitor's mail app rather than sent. */
    handoffTitle: string;
    handoffBody: string;
    handoffFallback: string;
    again: string;
    errors: { name: string; email: string; emailFormat: string; message: string };
  };
  footer: string;
};

export const content: Record<Lang, Content> = {
  en: {
    dir: "ltr",
    nav: { work: "Work", practice: "Practice", tools: "Tools", contact: "Contact" },
    switchTo: "العربية",
    switchLabel: "Switch to Arabic",
    menu: "Menu",
    skipToContent: "Skip to content",
    hero: {
      label: "Applications and websites",
      lines: ["Websites built", "with the same care", "as the work inside."],
      body:
        "ELYSIAN is an agency in Cairo. We build everything — websites, web applications, mobile-ready tools — in Arabic, in English, or both, from the first sketch to the last hairline of the interface.",
      primary: "View our work",
      secondary: "Get in touch",
      scroll: "Scroll",
    },
    work: {
      label: "Portfolio",
      heading: "Selected work",
      lead: "Each project below opens live, so you can use it rather than read about it.",
      countLabel: (n) => (n === 1 ? "1 project" : `${n} projects`),
      visit: "Open live",
      empty: "The first projects are being prepared for this page.",
      emptyCta: "Start a project with us",
      projects: [
        {
          id: "sample-1",
          title: "Project name",
          kind: "Website",
          year: "2026",
          summary: "One line about what this project is and who it was built for.",
          stack: ["React", "TypeScript", "Tailwind CSS"],
          image: "",
          link: "",
        },
        {
          id: "sample-2",
          title: "Project name",
          kind: "Web application",
          year: "2026",
          summary: "One line about what this project is and who it was built for.",
          stack: ["React", "TypeScript", "Vite"],
          image: "",
          link: "",
        },
        {
          id: "sample-3",
          title: "Project name",
          kind: "Landing page",
          year: "2025",
          summary: "One line about what this project is and who it was built for.",
          stack: ["React", "Tailwind CSS", "Motion"],
          image: "",
          link: "",
        },
        {
          id: "sample-4",
          title: "Project name",
          kind: "Dashboard",
          year: "2025",
          summary: "One line about what this project is and who it was built for.",
          stack: ["React", "TypeScript", "Charts"],
          image: "",
          link: "",
        },
      ],
    },
    practice: {
      label: "Practice",
      heading: "How we work",
      items: [
        {
          title: "Understand the business before the pixels",
          body:
            "A site is a tool, not a poster. We start with what the business does on its busiest day, then decide what the screen says first, second, and never.",
        },
        {
          title: "Find the cause, then make the smallest fix",
          body:
            "A patch that hides a symptom comes back later, usually in front of a client. We trace the behaviour to its root, say plainly what was wrong, and change only what the fix requires.",
        },
        {
          title: "Arabic first, not Arabic translated",
          body:
            "Right-to-left is a layout decision, not a stylesheet flip at the end. Numbers, dates, forms, and tables are laid out for the person reading them from the first sketch.",
        },
      ],
    },
    tools: {
      label: "Stack",
      heading: "Tools",
      groups: [
        { label: "Interface", items: ["React", "TypeScript", "Tailwind CSS", "Vite", "Zustand"] },
        { label: "Structure", items: ["Semantic HTML", "Responsive layout", "Design systems"] },
        { label: "Motion", items: ["CSS animation", "Scroll sequences", "Three.js"] },
        { label: "Craft", items: ["RTL and bilingual UI", "Performance", "Accessibility"] },
      ],
    },
    contact: {
      label: "Contact",
      headingTop: "Have a project",
      headingBottom: "in mind?",
      body:
        "Whether the idea is fully drawn or still a rough direction, leave your email and number with a few lines about it. We read everything and reply within a day.",
      rows: { email: "Email", whatsapp: "WhatsApp", github: "GitHub", linkedin: "LinkedIn" },
      fields: { name: "Your name", email: "Email address", phone: "Phone number", message: "Message" },
      placeholders: {
        name: "Alex Thompson",
        email: "you@company.com",
        phone: "+20 1XX XXX XXXX",
        message: "Tell us about your project…",
      },
      optional: "optional",
      submit: "Send message",
      sending: "Sending",
      successTitle: "Message sent.",
      successBody: "Thank you. We will reply to the email you left, usually within a day.",
      handoffTitle: "Almost there.",
      handoffBody:
        "Your mail app should have opened with the message already written. Press send there and it reaches us.",
      handoffFallback: "If nothing opened, write to",
      again: "Send another message",
      errors: {
        name: "Add your name so we know who we are replying to.",
        email: "Add an email address so we can reply.",
        emailFormat: "This email address does not look complete.",
        message: "Write a line or two about what you need.",
      },
    },
    footer: "Designed and built in Cairo.",
  },

  ar: {
    dir: "rtl",
    nav: { work: "الأعمال", practice: "أسلوب العمل", tools: "الأدوات", contact: "تواصل" },
    switchTo: "English",
    switchLabel: "التبديل إلى الإنجليزية",
    menu: "القائمة",
    skipToContent: "تخطَّ إلى المحتوى",
    hero: {
      label: "تطبيقات ومواقع",
      lines: ["مواقع مبنية", "بنفس العناية", "اللي جوّاها."],
      body:
        "إيليجيان وكالة في القاهرة. نبني كل شيء — مواقع وتطبيقات ويب وأدوات تعمل على الموبايل — بالعربية أو بالإنجليزية أو بالاثنتين، من أول رسم تخطيطي حتى آخر خط في الواجهة.",
      primary: "شاهد أعمالنا",
      secondary: "تواصل معنا",
      scroll: "مرّر",
    },
    work: {
      label: "الأعمال",
      heading: "مختارات من الشغل",
      lead: "كل مشروع بالأسفل يفتح مباشرة، فتجرّبه بنفسك بدل أن تقرأ عنه.",
      countLabel: (n) => (n === 1 ? "مشروع واحد" : n === 2 ? "مشروعان" : `${n} مشاريع`),
      visit: "افتح الموقع",
      empty: "المشاريع الأولى قيد التجهيز لهذه الصفحة.",
      emptyCta: "ابدأ مشروعًا معنا",
      projects: [
        {
          id: "sample-1",
          title: "اسم المشروع",
          kind: "موقع إلكتروني",
          year: "٢٠٢٦",
          summary: "سطر واحد يشرح ما هو هذا المشروع ولمن بُني.",
          stack: ["React", "TypeScript", "Tailwind CSS"],
          image: "",
          link: "",
        },
        {
          id: "sample-2",
          title: "اسم المشروع",
          kind: "تطبيق ويب",
          year: "٢٠٢٦",
          summary: "سطر واحد يشرح ما هو هذا المشروع ولمن بُني.",
          stack: ["React", "TypeScript", "Vite"],
          image: "",
          link: "",
        },
        {
          id: "sample-3",
          title: "اسم المشروع",
          kind: "صفحة هبوط",
          year: "٢٠٢٥",
          summary: "سطر واحد يشرح ما هو هذا المشروع ولمن بُني.",
          stack: ["React", "Tailwind CSS", "Motion"],
          image: "",
          link: "",
        },
        {
          id: "sample-4",
          title: "اسم المشروع",
          kind: "لوحة تحكم",
          year: "٢٠٢٥",
          summary: "سطر واحد يشرح ما هو هذا المشروع ولمن بُني.",
          stack: ["React", "TypeScript", "Charts"],
          image: "",
          link: "",
        },
      ],
    },
    practice: {
      label: "الأسلوب",
      heading: "طريقتنا في الشغل",
      items: [
        {
          title: "افهم العمل قبل البكسل",
          body:
            "الموقع أداة لا ملصق. نبدأ بما يحدث في العمل في أكثر أيامه ازدحامًا، ثم نقرّر ما الذي تقوله الشاشة أولًا، وثانيًا، وما الذي لا تقوله أبدًا.",
        },
        {
          title: "ابحث عن السبب، ثم أصلح بأقل تغيير",
          body:
            "الترقيع الذي يخفي العرض يعود لاحقًا، وغالبًا أمام العميل. نتتبع السلوك حتى جذره، ونقول بوضوح ما كان معطوبًا، ونغيّر بقدر ما يتطلبه الإصلاح فقط.",
        },
        {
          title: "عربي أولًا، لا عربي مُترجم",
          body:
            "الاتجاه من اليمين إلى اليسار قرار تخطيط لا انعكاس أنماط في النهاية. الأرقام والتواريخ والنماذج والجداول تُرتَّب لمن سيقرأها من أول رسم تخطيطي.",
        },
      ],
    },
    tools: {
      label: "الأدوات",
      heading: "ما أشتغل به",
      groups: [
        { label: "الواجهة", items: ["React", "TypeScript", "Tailwind CSS", "Vite", "Zustand"] },
        { label: "البناء", items: ["HTML دلالي", "تخطيط متجاوب", "أنظمة تصميم"] },
        { label: "الحركة", items: ["حركات CSS", "مشاهد التمرير", "Three.js"] },
        { label: "الحرفة", items: ["واجهات RTL وثنائية اللغة", "الأداء", "إتاحة الوصول"] },
      ],
    },
    contact: {
      label: "تواصل",
      headingTop: "عندك مشروع",
      headingBottom: "في بالك؟",
      body:
        "سواء كانت الفكرة مرسومة بالكامل أو ما زالت اتجاهًا عامًا، اترك بريدك ورقمك مع سطور قليلة عنها. نقرأ كل رسالة ونرد خلال يوم.",
      rows: { email: "البريد", whatsapp: "واتساب", github: "جيت هب", linkedin: "لينكدإن" },
      fields: { name: "اسمك", email: "البريد الإلكتروني", phone: "رقم الهاتف", message: "رسالتك" },
      placeholders: {
        name: "أحمد حسن",
        email: "you@company.com",
        phone: "٠١XX XXX XXXX",
        message: "احكِ لنا عن مشروعك…",
      },
      optional: "اختياري",
      submit: "أرسل الرسالة",
      sending: "جارٍ الإرسال",
      successTitle: "وصلت الرسالة.",
      successBody: "شكرًا لك. سنرد على البريد الذي تركته، خلال يوم غالبًا.",
      handoffTitle: "بقيت خطوة.",
      handoffBody:
        "من المفترض أن يكون تطبيق البريد قد فُتح والرسالة مكتوبة بالفعل. اضغط إرسال هناك لتصلنا.",
      handoffFallback: "إن لم يُفتح شيء، راسلني على",
      again: "أرسل رسالة أخرى",
      errors: {
        name: "اكتب اسمك حتى نعرف من نراسل.",
        email: "اكتب بريدًا إلكترونيًا حتى نستطيع الرد.",
        emailFormat: "هذا البريد لا يبدو مكتملًا.",
        message: "اكتب سطرًا أو سطرين عمّا تحتاجه.",
      },
    },
    footer: "صُمِّم وبُني في القاهرة.",
  },
};
