import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadLocalEnv() {
  try {
    const contents = readFileSync(".env.local", "utf8");

    for (const line of contents.split("\n")) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*=/.test(line)) {
        continue;
      }

      const index = line.indexOf("=");
      const key = line.slice(0, index);
      const value = line
        .slice(index + 1)
        .trim()
        .replace(/^"/, "")
        .replace(/"$/, "");

      process.env[key] ??= value;
    }
  } catch {
    // Vercel injects env vars remotely; .env.local is only needed for local seeding.
  }
}

loadLocalEnv();

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL is required to seed activities.");
}

const sql = neon(connectionString);

const activityImages = {
  "חוג כדורגל יסודות": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  "נבחרת כדורסל צעירה": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
  "פארקור בטוח לילדים": "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=1200&q=80",
  "יוגה ותנועה לילדים": "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?auto=format&fit=crop&w=1200&q=80",
  "בלט יצירתי": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
  "היפ הופ לנוער": "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80",
  "רובוטיקה ולגו הנדסי": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
  "תכנות משחקים": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "סדנת קומיקס ואיור": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
  "קרמיקה צבעונית": "https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=1200&q=80",
  "תיאטרון ואימפרוביזציה": "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  "גיטרה למתחילים": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
  "פסנתר בקבוצות קטנות": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80",
  "בישול ואפייה צעירה": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
  "שחמט וחשיבה אסטרטגית": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
  "צילום בסמארטפון": "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80",
  "אנגלית דרך משחק": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  "ספרדית לילדים סקרנים": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
  "מדענים צעירים במעבדה": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  "סקייטבורד בסיסי": "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=1200&q=80",
  "כדורעף חופים לנוער": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
  "אקרובטיקה על מזרנים": "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80",
  "עיצוב אופנה לנוער": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  "פיתוח אפליקציות לנוער": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "פילאטיס ערב למבוגרים": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  "ציור אקריליק למתחילים": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
  "בישול ים תיכוני": "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
  "צילום אורבני למבוגרים": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
  "יוגה לנשים": "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1200&q=80",
  "ריצה מודרכת למתחילים": "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=1200&q=80",
  "גיטרה סביב המדורה": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
  "שחמט למבוגרים": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80"
};

const childBlueprints = [
  { title: "חוג כדורגל יסודות", genre: "ספורט", minAge: 6, maxAge: 10, price: 140, gender: "כולם" },
  { title: "נבחרת כדורסל צעירה", genre: "ספורט", minAge: 9, maxAge: 14, price: 165, gender: "כולם" },
  { title: "פארקור בטוח לילדים", genre: "ספורט", minAge: 8, maxAge: 13, price: 155, gender: "כולם" },
  { title: "יוגה ותנועה לילדים", genre: "תנועה", minAge: 5, maxAge: 9, price: 120, gender: "כולם" },
  { title: "בלט יצירתי", genre: "ריקוד", minAge: 5, maxAge: 8, price: 145, gender: "בנות" },
  { title: "היפ הופ לנוער", genre: "ריקוד", minAge: 11, maxAge: 17, price: 170, gender: "כולם" },
  { title: "רובוטיקה ולגו הנדסי", genre: "מדע וטכנולוגיה", minAge: 7, maxAge: 12, price: 210, gender: "כולם" },
  { title: "תכנות משחקים", genre: "מדע וטכנולוגיה", minAge: 10, maxAge: 15, price: 240, gender: "כולם" },
  { title: "סדנת קומיקס ואיור", genre: "אמנות", minAge: 8, maxAge: 14, price: 150, gender: "כולם" },
  { title: "קרמיקה צבעונית", genre: "אמנות", minAge: 6, maxAge: 12, price: 135, gender: "כולם" },
  { title: "תיאטרון ואימפרוביזציה", genre: "תיאטרון", minAge: 9, maxAge: 16, price: 160, gender: "כולם" },
  { title: "גיטרה למתחילים", genre: "מוזיקה", minAge: 9, maxAge: 18, price: 190, gender: "כולם" },
  { title: "פסנתר בקבוצות קטנות", genre: "מוזיקה", minAge: 7, maxAge: 13, price: 220, gender: "כולם" },
  { title: "בישול ואפייה צעירה", genre: "בישול", minAge: 7, maxAge: 13, price: 175, gender: "כולם" },
  { title: "שחמט וחשיבה אסטרטגית", genre: "חשיבה", minAge: 8, maxAge: 16, price: 125, gender: "כולם" },
  { title: "צילום בסמארטפון", genre: "צילום", minAge: 12, maxAge: 18, price: 155, gender: "כולם" },
  { title: "אנגלית דרך משחק", genre: "למידה", minAge: 6, maxAge: 10, price: 130, gender: "כולם" },
  { title: "ספרדית לילדים סקרנים", genre: "למידה", minAge: 9, maxAge: 14, price: 145, gender: "כולם" },
  { title: "מדענים צעירים במעבדה", genre: "מדע וטכנולוגיה", minAge: 8, maxAge: 13, price: 205, gender: "כולם" },
  { title: "סקייטבורד בסיסי", genre: "ספורט", minAge: 9, maxAge: 15, price: 150, gender: "בנים" },
  { title: "כדורעף חופים לנוער", genre: "ספורט", minAge: 12, maxAge: 18, price: 155, gender: "כולם" },
  { title: "אקרובטיקה על מזרנים", genre: "תנועה", minAge: 6, maxAge: 11, price: 150, gender: "כולם" },
  { title: "עיצוב אופנה לנוער", genre: "אמנות", minAge: 12, maxAge: 18, price: 185, gender: "בנות" },
  { title: "פיתוח אפליקציות לנוער", genre: "מדע וטכנולוגיה", minAge: 13, maxAge: 18, price: 260, gender: "כולם" }
];

const adultBlueprints = [
  { title: "פילאטיס ערב למבוגרים", genre: "תנועה", minAge: 18, maxAge: 65, price: 180, gender: "כולם" },
  { title: "ציור אקריליק למתחילים", genre: "אמנות", minAge: 18, maxAge: 65, price: 210, gender: "כולם" },
  { title: "בישול ים תיכוני", genre: "בישול", minAge: 18, maxAge: 65, price: 260, gender: "כולם" },
  { title: "צילום אורבני למבוגרים", genre: "צילום", minAge: 18, maxAge: 65, price: 220, gender: "כולם" },
  { title: "יוגה לנשים", genre: "תנועה", minAge: 18, maxAge: 65, price: 170, gender: "נשים" },
  { title: "ריצה מודרכת למתחילים", genre: "ספורט", minAge: 18, maxAge: 60, price: 130, gender: "כולם" },
  { title: "גיטרה סביב המדורה", genre: "מוזיקה", minAge: 18, maxAge: 65, price: 190, gender: "כולם" },
  { title: "שחמט למבוגרים", genre: "חשיבה", minAge: 18, maxAge: 65, price: 120, gender: "כולם" }
];

const locations = [
  "תל אביב - נמל",
  "תל אביב - פלורנטין",
  "יפו",
  "רמת גן",
  "גבעתיים",
  "הרצליה",
  "רעננה",
  "כפר סבא",
  "חולון",
  "בת ים",
  "ראשון לציון",
  "פתח תקווה",
  "רמת השרון",
  "מודיעין",
  "ירושלים",
  "חיפה"
];

const instructors = [
  "יעל כהן",
  "דניאל לוי",
  "נועה ברק",
  "איתי שקד",
  "מאיה מזרחי",
  "עומר אזולאי",
  "שירה טל",
  "רוני סלע",
  "תמר עזרא",
  "אורי וויס",
  "נטע אמיר",
  "ליאור רומנו",
  "איילת דרור",
  "יונתן פרץ",
  "מיכל סגל",
  "רועי אלון"
];

const groups = ["א", "ב", "ג", "ד", "ה"];

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function imageForActivity(title) {
  return (
    activityImages[title] ??
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  );
}

function descriptionForActivity(blueprint, location, instructor) {
  const ageText =
    blueprint.minAge >= 18
      ? "הפעילות מיועדת למבוגרים ומתקדמת בקצב רגוע שמתאים גם למתחילים."
      : `הפעילות מיועדת לגילאי ${blueprint.minAge}-${blueprint.maxAge}, עם חלוקה למשימות קצרות והרבה מקום להתנסות.`;

  return `${blueprint.title} ב${location} בהובלת ${instructor}. ${ageText} במהלך המפגש המשתתפים ילמדו יסודות, יתרגלו בקבוצה קטנה, יקבלו משוב אישי ויסיימו עם תחושת הצלחה ברורה. מתאים למי שרוצה להכיר תחום חדש וגם למי שכבר התנסה ורוצה להתקדם.`;
}

function buildActivities() {
  const activities = [];
  const startDate = new Date("2026-05-03T00:00:00.000Z");

  for (let index = 0; index < 96; index += 1) {
    const blueprint = childBlueprints[index % childBlueprints.length];
    const location = locations[index % locations.length];
    const instructor = instructors[index % instructors.length];
    activities.push({
      name: `${blueprint.title} - קבוצה ${groups[index % groups.length]}`,
      location,
      genre: blueprint.genre,
      date: addDays(startDate, index * 2),
      instructor,
      price: blueprint.price + (index % 5) * 10,
      minAge: blueprint.minAge,
      maxAge: blueprint.maxAge,
      gender: blueprint.gender,
      image: imageForActivity(blueprint.title),
      description: descriptionForActivity(blueprint, location, instructor)
    });
  }

  for (let index = 0; index < 24; index += 1) {
    const blueprint = adultBlueprints[index % adultBlueprints.length];
    const location = locations[(index * 3) % locations.length];
    const instructor = instructors[(index * 2) % instructors.length];
    activities.push({
      name: `${blueprint.title} - מחזור ${groups[index % groups.length]}`,
      location,
      genre: blueprint.genre,
      date: addDays(startDate, 7 + index * 4),
      instructor,
      price: blueprint.price + (index % 4) * 15,
      minAge: blueprint.minAge,
      maxAge: blueprint.maxAge,
      gender: blueprint.gender,
      image: imageForActivity(blueprint.title),
      description: descriptionForActivity(blueprint, location, instructor)
    });
  }

  return activities;
}

const activities = buildActivities();

await sql`
  CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    genre TEXT NOT NULL,
    activity_date DATE NOT NULL,
    instructor TEXT NOT NULL,
    price NUMERIC(8, 2) NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT ''
  )
`;

await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT ''`;
await sql`TRUNCATE TABLE activities RESTART IDENTITY`;

for (const activity of activities) {
  await sql`
    INSERT INTO activities (
      name,
      location,
      genre,
      activity_date,
      instructor,
      price,
      min_age,
      max_age,
      gender,
      image,
      description
    )
    VALUES (
      ${activity.name},
      ${activity.location},
      ${activity.genre},
      ${activity.date},
      ${activity.instructor},
      ${activity.price},
      ${activity.minAge},
      ${activity.maxAge},
      ${activity.gender},
      ${activity.image},
      ${activity.description}
    )
  `;
}

await sql`CREATE INDEX IF NOT EXISTS activities_genre_idx ON activities (genre)`;
await sql`CREATE INDEX IF NOT EXISTS activities_location_idx ON activities (location)`;
await sql`CREATE INDEX IF NOT EXISTS activities_gender_idx ON activities (gender)`;
await sql`CREATE INDEX IF NOT EXISTS activities_price_idx ON activities (price)`;
await sql`CREATE INDEX IF NOT EXISTS activities_date_idx ON activities (activity_date)`;
await sql`CREATE INDEX IF NOT EXISTS activities_age_range_idx ON activities (min_age, max_age)`;
await sql`CREATE INDEX IF NOT EXISTS activities_filter_combo_idx ON activities (genre, location, gender)`;

console.log(`Seeded ${activities.length} Hebrew activities.`);
