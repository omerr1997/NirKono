import { ActivityCatalogue } from "../components/activity-catalogue";
import {
  getActivitiesPage,
  getActivityFacets,
  PAGE_SIZE,
  type ActivityFilters
} from "../lib/activities";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStringParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function getNumberParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = getStringParam(searchParams, key);

  if (!value) {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Math.max(1, getNumberParam(resolvedSearchParams, "page") ?? 1);
  const filters: ActivityFilters = {
    search: getStringParam(resolvedSearchParams, "q"),
    genre: getStringParam(resolvedSearchParams, "genre"),
    location: getStringParam(resolvedSearchParams, "location"),
    gender: getStringParam(resolvedSearchParams, "gender"),
    age: getNumberParam(resolvedSearchParams, "age"),
    maxPrice: getNumberParam(resolvedSearchParams, "maxPrice"),
    page: requestedPage,
    pageSize: PAGE_SIZE
  };
  const [activityPage, facets] = await Promise.all([
    getActivitiesPage(filters),
    getActivityFacets()
  ]);
  const appliedFilters = {
    ...filters,
    page: activityPage.page
  };

  return (
    <main className="app-shell" dir="rtl">
      <section className="intro" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">פעילויות NirKono</p>
          <h1 id="page-title">מוצאים פעילות שמתאימה באמת.</h1>
        </div>
        <p className="intro-copy">
          קטלוג פעילויות לילדים, נוער ומבוגרים עם סינון לפי גיל, מיקום, תחום ומחיר.
        </p>
      </section>

      <ActivityCatalogue
        activities={activityPage.activities}
        facets={facets}
        filters={appliedFilters}
        total={activityPage.total}
        totalPages={activityPage.totalPages}
      />
    </main>
  );
}
