import { neon } from "@neondatabase/serverless";

export const PAGE_SIZE = 24;

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
  description: string;
};

export type ActivityFilters = {
  search?: string;
  genre?: string;
  location?: string;
  gender?: string;
  age?: number;
  maxPrice?: number;
  page: number;
  pageSize: number;
};

export type ActivityFacets = {
  genres: string[];
  locations: string[];
  genders: string[];
};

export type ActivityPage = {
  activities: Activity[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
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
  description: string;
};

type CountRow = {
  count: number | string;
};

type FacetRow = {
  genres: string[];
  locations: string[];
  genders: string[];
};

const selectFields = `
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
  image,
  description
`;

function getConnectionString() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
}

function getSql() {
  const connectionString = getConnectionString();

  if (!connectionString) {
    return null;
  }

  return neon(connectionString);
}

function normalizeText(value?: string) {
  const normalized = value?.trim();
  return normalized && normalized !== "all" ? normalized : undefined;
}

function buildWhere(filters: ActivityFilters) {
  const clauses: string[] = [];
  const params: Array<number | string> = [];

  function addParam(value: number | string) {
    params.push(value);
    return `$${params.length}`;
  }

  const search = normalizeText(filters.search);
  const genre = normalizeText(filters.genre);
  const location = normalizeText(filters.location);
  const gender = normalizeText(filters.gender);

  if (search) {
    const placeholder = addParam(`%${search}%`);
    clauses.push(`(
      name ILIKE ${placeholder}
      OR location ILIKE ${placeholder}
      OR genre ILIKE ${placeholder}
      OR instructor ILIKE ${placeholder}
      OR description ILIKE ${placeholder}
    )`);
  }

  if (genre) {
    clauses.push(`genre = ${addParam(genre)}`);
  }

  if (location) {
    clauses.push(`location = ${addParam(location)}`);
  }

  if (gender) {
    clauses.push(`gender = ${addParam(gender)}`);
  }

  if (typeof filters.age === "number") {
    const placeholder = addParam(filters.age);
    clauses.push(`min_age <= ${placeholder} AND max_age >= ${placeholder}`);
  }

  if (typeof filters.maxPrice === "number") {
    clauses.push(`price <= ${addParam(filters.maxPrice)}`);
  }

  return {
    params,
    where: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : ""
  };
}

function mapActivity(activity: ActivityRow): Activity {
  return {
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
    image: activity.image,
    description: activity.description
  };
}

export async function getActivityById(id: number): Promise<Activity | null> {
  const sql = getSql();

  if (!sql) {
    return null;
  }

  const rows = (await sql.query(
    `
      SELECT ${selectFields}
      FROM activities
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  )) as ActivityRow[];

  return rows[0] ? mapActivity(rows[0]) : null;
}

export async function getActivityFacets(): Promise<ActivityFacets> {
  const sql = getSql();

  if (!sql) {
    return { genres: [], locations: [], genders: [] };
  }

  const rows = (await sql`
    SELECT
      COALESCE(array_agg(DISTINCT genre ORDER BY genre), ARRAY[]::text[]) AS genres,
      COALESCE(array_agg(DISTINCT location ORDER BY location), ARRAY[]::text[]) AS locations,
      COALESCE(array_agg(DISTINCT gender ORDER BY gender), ARRAY[]::text[]) AS genders
    FROM activities
  `) as FacetRow[];

  return rows[0] ?? { genres: [], locations: [], genders: [] };
}

export async function getActivitiesPage(filters: ActivityFilters): Promise<ActivityPage> {
  const sql = getSql();
  const page = Math.max(1, filters.page);
  const pageSize = Math.max(1, filters.pageSize);

  if (!sql) {
    return { activities: [], total: 0, totalPages: 1, page, pageSize };
  }

  const { params, where } = buildWhere(filters);
  const countRows = (await sql.query(
    `SELECT count(*)::int AS count FROM activities ${where}`,
    params
  )) as CountRow[];
  const total = Number(countRows[0]?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const boundedPage = Math.min(page, totalPages);
  const limitPlaceholder = `$${params.length + 1}`;
  const offsetPlaceholder = `$${params.length + 2}`;
  const offset = (boundedPage - 1) * pageSize;

  const rows = (await sql.query(
    `
      SELECT ${selectFields}
      FROM activities
      ${where}
      ORDER BY activity_date ASC, id ASC
      LIMIT ${limitPlaceholder}
      OFFSET ${offsetPlaceholder}
    `,
    [...params, pageSize, offset]
  )) as ActivityRow[];

  return {
    activities: rows.map(mapActivity),
    total,
    totalPages,
    page: boundedPage,
    pageSize
  };
}
