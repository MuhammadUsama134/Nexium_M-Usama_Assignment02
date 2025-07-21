// Import the translation library using ES6 module syntax
import translate from "google-translate-api-x";

// Enhanced Urdu translation with a more comprehensive dictionary
const englishToUrduDict: Record<string, string> = {

  // Basic words
  the: "یہ",
  and: "اور",
  is: "ہے",
  in: "میں",
  to: "کو",
  of: "کا",
  a: "ایک",
  that: "کہ",
  it: "یہ",
  with: "کے ساتھ",
  for: "کے لیے",
  as: "جیسا",
  was: "تھا",
  on: "پر",
  are: "ہیں",
  you: "آپ",
  this: "یہ",
  be: "ہونا",
  at: "پر",
  by: "کی طرف سے",
  not: "نہیں",
  or: "یا",
  have: "ہے",
  from: "سے",
  they: "وہ",
  we: "ہم",
  can: "کر سکتے ہیں",
  will: "گا",
  would: "گا",
  there: "وہاں",
  been: "گیا",
  more: "زیادہ",
  if: "اگر",
  who: "کون",
  what: "کیا",
  time: "وقت",

  // Technology & Business
  technology: "ٹیکنالوجی",
  business: "کاروبار",
  development: "ترقی",
  important: "اہم",
  information: "معلومات",
  system: "نظام",
  company: "کمپنی",
  service: "خدمت",
  management: "انتظام",
  process: "عمل",
  project: "منصوبہ",
  team: "ٹیم",
  experience: "تجربہ",
  solution: "حل",
  customer: "گاہک",
  market: "بازار",
  product: "پروڈکٹ",
  quality: "معیار",
  support: "مدد",
  training: "تربیت",

  // Education & Research
  education: "تعلیم",
  research: "تحقیق",
  analysis: "تجزیہ",
  design: "ڈیزائن",
  strategy: "حکمت عملی",
  planning: "منصوبہ بندی",
  implementation: "نفاذ",
  success: "کامیابی",
  growth: "ترقی",
  innovation: "جدت",
  communication: "رابطہ",
  collaboration: "تعاون",
  leadership: "قیادت",
  performance: "کارکردگی",

  // Digital & Online
  digital: "ڈیجیٹل",
  online: "آن لائن",
  internet: "انٹرنیٹ",
  website: "ویب سائٹ",
  software: "سافٹ ویئر",
  application: "ایپلیکیشن",
  platform: "پلیٹ فارم",
  network: "نیٹ ورک",
  data: "ڈیٹا",
  security: "سیکیورٹی",
  privacy: "رازداری",

  // Common adjectives
  good: "اچھا",
  bad: "برا",
  best: "بہترین",
  better: "بہتر",
  great: "عظیم",
  excellent: "بہترین",
  amazing: "حیرت انگیز",
  wonderful: "شاندار",
  perfect: "کامل",
  beautiful: "خوبصورت",
  new: "نیا",
  old: "پرانا",
  big: "بڑا",
  small: "چھوٹا",
  significant: "اہم",
  major: "بڑا",
  minor: "چھوٹا",
  effective: "مؤثر",
  efficient: "موثر",
  successful: "کامیاب",
  popular: "مقبول",

  // Action words
  create: "بنانا",
  develop: "ترقی دینا",
  build: "تعمیر کرنا",
  make: "بنانا",
  provide: "فراہم کرنا",
  offer: "پیش کرنا",
  help: "مدد کرنا",
  improve: "بہتر بنانا",
  increase: "بڑھانا",
  reduce: "کم کرنا",
  change: "تبدیل کرنا",
  work: "کام کرنا",
  use: "استعمال کرنا",
  learn: "سیکھنا",
  understand: "سمجھنا",

  // Time & Place
  today: "آج",
  tomorrow: "کل",
  yesterday: "گزرا ہوا کل",
  now: "اب",
  then: "پھر",
  here: "یہاں",
  where: "کہاں",
  when: "کب",
  how: "کیسے",
  why: "کیوں",
  before: "پہلے",
  after: "بعد میں",
  during: "دوران",

  // Numbers
  one: "ایک",
  two: "دو",
  three: "تین",
  four: "چار",
  five: "پانچ",
  first: "پہلا",
  second: "دوسرا",
  third: "تیسرا",
  last: "آخری",

  // Common phrases
  "according to": "کے مطابق",
  "in order to": "کے لیے",
  "as well as": "کے ساتھ ساتھ",
  "such as": "جیسے کہ",
  "for example": "مثال کے طور پر",
  "in addition": "اس کے علاوہ",
  however: "تاہم",
  therefore: "لہذا",
  because: "کیونکہ",
  although: "اگرچہ",

  // Blog-specific terms
  article: "مضمون",
  blog: "بلاگ",
  post: "پوسٹ",
  content: "مواد",
  text: "متن",
  summary: "خلاصہ",
  conclusion: "نتیجہ",
  introduction: "تعارف",
  topic: "موضوع",
  subject: "مضمون",
  theme: "خیالیہ",
  point: "نکتہ",
  idea: "خیال",
  concept: "تصور",

  // Social & Community
  people: "لوگ",
  person: "شخص",
  community: "برادری",
  society: "معاشرہ",
  family: "خاندان",
  friend: "دوست",
  group: "گروپ",
  organization: "تنظیم",

  // Health & Life
  health: "صحت",
  life: "زندگی",
  world: "دنیا",
  environment: "ماحول",
  nature: "فطرت",
  future: "مستقبل",
  past: "ماضی",
  present: "حال",

  // Economy & Finance
  money: "پیسہ",
  cost: "لاگت",
  price: "قیمت",
  value: "قدر",
  investment: "سرمایہ کاری",
  economy: "معیشت",
  finance: "مالیات",
  budget: "بجٹ",
  profit: "منافع",

  // Government & Politics
  government: "حکومت",
  policy: "پالیسی",
  law: "قانون",
  rule: "اصول",
  regulation: "ضابطہ",
  authority: "اتھارٹی",
  public: "عوامی",
  private: "نجی",

  // Connectors & Conjunctions
  also: "بھی",
  but: "لیکن",
  so: "تو",
  while: "جبکہ",
  until: "جب تک",
  unless: "جب تک کہ",
  since: "چونکہ",
  about: "کے بارے میں",
  above: "اوپر",
  below: "نیچے",
  between: "درمیان",
  among: "کے درمیان",
  through: "کے ذریعے",
  over: "اوپر",
  under: "نیچے",

  // Feelings & Emotions
  happy: "خوش",
  sad: "اداس",
  angry: "ناراض",
  love: "محبت",
  hate: "نفرت",
  fear: "خوف",
  joy: "خوشی",
  hope: "امید",
  feeling: "احساس",
  emotion: "جذبہ",

  // Verbs (General Actions)
  go: "جانا",
  come: "آنا",
  see: "دیکھنا",
  look: "دیکھنا",
  say: "کہنا",
  tell: "بتانا",
  ask: "پوچھنا",
  answer: "جواب دینا",
  give: "دینا",
  take: "لینا",
  find: "تلاش کرنا",
  know: "جاننا",
  think: "سوچنا",
  want: "چاہنا",
  need: "ضرورت ہونا",
  try: "کوشش کرنا",
  start: "شروع کرنا",
  stop: "روکنا",
  continue: "جاری رکھنا",
  finish: "ختم کرنا",
  
  // Science & Nature
  science: "سائنس",
  water: "پانی",
  air: "ہوا",
  fire: "آگ",
  earth: "زمین",
  sun: "سورج",
  moon: "چاند",
  star: "ستارہ",
  plant: "پودا",
  animal: "جانور",
  human: "انسان",

  // Food & Drink
  food: "کھانا",
  drink: "مشروب",
  eat: "کھانا",
  tea: "چائے",
  coffee: "کافی",
  fruit: "پھل",
  vegetable: "سبزی",

  // Travel & Places
  travel: "سفر",
  city: "شہر",
  country: "ملک",
  home: "گھر",
  office: "دفتر",
  school: "اسکول",
  university: "یونیورسٹی",
  road: "سڑک",
  street: "گلی",
};

export async function translateToUrdu(text: string): Promise<string> {
  try {
    // Try Google Translate API if the feature is enabled via environment variables

   // if (process.env.GOOGLE_TRANSLATE_API_KEY) {

      // The 'google-translate-api-x' library does not require an API key (for now atleast).
      // So Enable the 'if' condition if it changes in the future or for moderate to high usage 
      const result = await translate(text, {
        to: "ur",
      });
      return result.text;

   // }
  } catch (error) {
    console.error("Google Translate API failed, falling back to dictionary:", error);
  }

  // Fallback to the enhanced dictionary-based translation
  return translateWithEnhancedDictionary(text);
}

function translateWithEnhancedDictionary(text: string): string {
  // Split text into sentences for better context handling
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  const translatedSentences = sentences.map((sentence) => {
    const words = sentence.trim().toLowerCase().split(/\s+/);
    const translatedWords: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      // Clean the word of punctuation for dictionary lookup
      const cleanWord = word.replace(/[^\w\s-]/g, "");

      // Check for multi-word phrases first (longest match first)
      if (i < words.length - 2) {
        const threeWordPhrase = `${cleanWord} ${words[i + 1]?.replace(/[^\w\s-]/g, "")} ${words[i + 2]?.replace(/[^\w\s-]/g, "")}`;
        if (englishToUrduDict[threeWordPhrase]) {
          translatedWords.push(englishToUrduDict[threeWordPhrase]);
          i += 2; // Skip the next two words
          continue;
        }
      }

      if (i < words.length - 1) {
        const twoWordPhrase = `${cleanWord} ${words[i + 1]?.replace(/[^\w\s-]/g, "")}`;
        if (englishToUrduDict[twoWordPhrase]) {
          translatedWords.push(englishToUrduDict[twoWordPhrase]);
          i += 1; // Skip the next word
          continue;
        }
      }

      // Single word translation
      const translation = englishToUrduDict[cleanWord];
      if (translation) {
        translatedWords.push(translation);
      } else {
        // Keep the original word if no translation is found
        translatedWords.push(word);
      }
    }

    return translatedWords.join(" ");
  });

  // Join the translated sentences with the Urdu full stop character
  return translatedSentences.join("۔ ") + "۔";
}