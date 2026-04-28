import { neon } from "@neondatabase/serverless";

export type Activity = {
  id: number;
  name: string;
  location: string;
  genre: string;
  date: string;
  instructor: string;
  price: number;
  minAge: number;
  maxAge: number;
  gender: string;
  image: string;
};

type ActivityRow = {
  id: number;
  name: string;
  location: string;
  genre: string;
  activity_date: string;
  instructor: string;
  price: number | string;
  min_age: number;
  max_age: number;
  gender: string;
  image: string;
};

function getConnectionString() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
}

export async function getActivities(): Promise<Activity[]> {
  const connectionString = getConnectionString();

  if (!connectionString) {
    return [];
  }

  const sql = neon(connectionString);
  const rows = (await sql`
    SELECT
      id,
      name,
      location,
      genre,
      to_char(activity_date, 'YYYY-MM-DD') AS activity_date,
      instructor,
      price::float AS price,
      min_age,
      max_age,
      gender,
      image
    FROM activities
    ORDER BY activity_date ASC, name ASC
  `) as ActivityRow[];

  return rows.map((activity) => ({
    id: activity.id,
    name: activity.name,
    location: activity.location,
    genre: activity.genre,
    date: activity.activity_date,
    instructor: activity.instructor,
    price: Number(activity.price),
    minAge: activity.min_age,
    maxAge: activity.max_age,
    gender: activity.gender,
    image: activity.image
  }));
}
