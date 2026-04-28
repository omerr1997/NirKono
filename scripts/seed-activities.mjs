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

const activities = [
  {
    name: "Junior Parkour Lab",
    location: "Tel Aviv Port",
    genre: "Sport",
    date: "2026-05-10",
    instructor: "Noam Levi",
    price: 42,
    minAge: 8,
    maxAge: 13,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Clay Studio Morning",
    location: "Florentin",
    genre: "Art",
    date: "2026-05-12",
    instructor: "Maya Cohen",
    price: 55,
    minAge: 6,
    maxAge: 12,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Robotics Builders Club",
    location: "Ramat Gan",
    genre: "STEM",
    date: "2026-05-18",
    instructor: "Daniel Barak",
    price: 72,
    minAge: 10,
    maxAge: 15,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Contemporary Dance Flow",
    location: "Jaffa",
    genre: "Dance",
    date: "2026-05-20",
    instructor: "Tamar Ezra",
    price: 48,
    minAge: 9,
    maxAge: 16,
    gender: "Girls",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Beach Volleyball Skills",
    location: "Herzliya Beach",
    genre: "Sport",
    date: "2026-05-24",
    instructor: "Ari Shaked",
    price: 38,
    minAge: 11,
    maxAge: 17,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Kids Cooking Market",
    location: "Sarona",
    genre: "Cooking",
    date: "2026-06-02",
    instructor: "Lior Mizrahi",
    price: 64,
    minAge: 7,
    maxAge: 13,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Digital Illustration Jam",
    location: "Givatayim",
    genre: "Art",
    date: "2026-06-06",
    instructor: "Shira Tal",
    price: 58,
    minAge: 12,
    maxAge: 18,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Chess Strategy Sprint",
    location: "Dizengoff Center",
    genre: "Mind",
    date: "2026-06-11",
    instructor: "Eitan Weiss",
    price: 35,
    minAge: 8,
    maxAge: 14,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Skateboard Basics",
    location: "Yarkon Park",
    genre: "Sport",
    date: "2026-06-16",
    instructor: "Omer Azulay",
    price: 46,
    minAge: 9,
    maxAge: 15,
    gender: "Boys",
    image:
      "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Theatre Improv Circle",
    location: "Habima",
    genre: "Theatre",
    date: "2026-06-22",
    instructor: "Yael Romano",
    price: 52,
    minAge: 10,
    maxAge: 17,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Beginner Guitar Camp",
    location: "North Tel Aviv",
    genre: "Music",
    date: "2026-07-01",
    instructor: "Ronen Sela",
    price: 68,
    minAge: 9,
    maxAge: 16,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Nature Photography Walk",
    location: "Ramat HaSharon",
    genre: "Photography",
    date: "2026-07-08",
    instructor: "Neta Amir",
    price: 44,
    minAge: 12,
    maxAge: 18,
    gender: "All",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80"
  }
];

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
    image TEXT NOT NULL
  )
`;

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
      image
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
      ${activity.image}
    )
  `;
}

console.log(`Seeded ${activities.length} activities.`);
