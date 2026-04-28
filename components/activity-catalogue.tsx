"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useTransition } from "react";
import type { Activity, ActivityFacets, ActivityFilters } from "../lib/activities";

type ActivityCatalogueProps = {
  activities: Activity[];
  facets: ActivityFacets;
  filters: ActivityFilters;
  total: number;
  totalPages: number;
};

const moneyFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

function getFilterValue(value: string | number | undefined) {
  return value === undefined ? "" : String(value);
}

export function ActivityCatalogue({
  activities,
  facets,
  filters,
  total,
  totalPages
}: ActivityCatalogueProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debouncedTimeout = useRef<number | null>(null);

  function createQuery(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (!("page" in updates)) {
      params.delete("page");
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function pushFilter(updates: Record<string, string>) {
    startTransition(() => {
      router.push(createQuery(updates));
    });
  }

  function updateDebounced(key: string, value: string) {
    if (debouncedTimeout.current) {
      window.clearTimeout(debouncedTimeout.current);
    }

    debouncedTimeout.current = window.setTimeout(() => {
      pushFilter({ [key]: value.trim() });
    }, 250);
  }

  const pagination = useMemo(() => {
    const pages = new Set<number>([1, totalPages, filters.page - 1, filters.page, filters.page + 1]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  }, [filters.page, totalPages]);
  const currentQuery = searchParams.toString();

  return (
    <section className="catalogue" aria-label="קטלוג פעילויות">
      <div
        className="filters"
        aria-label="מסנני פעילויות"
        aria-busy={isPending}
        key={currentQuery || "all-filters"}
      >
        <label className="filter-field filter-field-wide">
          <span>חיפוש</span>
          <input
            defaultValue={getFilterValue(filters.search)}
            name="q"
            onChange={(event) => updateDebounced("q", event.target.value)}
            placeholder="ריקוד, רובוטיקה, יעל..."
            type="search"
          />
        </label>

        <label className="filter-field">
          <span>תחום</span>
          <select
            defaultValue={filters.genre ?? "all"}
            name="genre"
            onChange={(event) => pushFilter({ genre: event.target.value })}
          >
            <option value="all">הכל</option>
            {facets.genres.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>מיקום</span>
          <select
            defaultValue={filters.location ?? "all"}
            name="location"
            onChange={(event) => pushFilter({ location: event.target.value })}
          >
            <option value="all">הכל</option>
            {facets.locations.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>קבוצה</span>
          <select
            defaultValue={filters.gender ?? "all"}
            name="gender"
            onChange={(event) => pushFilter({ gender: event.target.value })}
          >
            <option value="all">הכל</option>
            {facets.genders.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field compact-field">
          <span>גיל</span>
          <input
            defaultValue={getFilterValue(filters.age)}
            min="0"
            name="age"
            onChange={(event) => updateDebounced("age", event.target.value)}
            placeholder="-"
            type="number"
          />
        </label>

        <label className="filter-field compact-field">
          <span>מחיר עד</span>
          <input
            defaultValue={getFilterValue(filters.maxPrice)}
            min="0"
            name="maxPrice"
            onChange={(event) => updateDebounced("maxPrice", event.target.value)}
            placeholder="-"
            type="number"
          />
        </label>

        <Link className="reset-button" href={pathname}>
          איפוס
        </Link>
      </div>

      <div className="result-row">
        <p>
          מוצגות <strong>{activities.length}</strong> מתוך <strong>{total}</strong> פעילויות
        </p>
        <p>
          עמוד <strong>{filters.page}</strong> מתוך <strong>{totalPages}</strong>
        </p>
      </div>

      {activities.length > 0 ? (
        <>
          <div className="activity-grid">
            {activities.map((activity) => (
              <Link
                aria-label={`פתיחת הפעילות ${activity.name}`}
                className="activity-card"
                href={`/activities/${activity.id}${currentQuery ? `?${currentQuery}` : ""}`}
                key={activity.id}
              >
                <div className="activity-image-wrap">
                  <Image
                    src={activity.image}
                    alt=""
                    className="activity-image"
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
                  />
                  <span className="genre-chip">{activity.genre}</span>
                </div>
                <div className="activity-body">
                  <div className="activity-heading">
                    <h2>{activity.name}</h2>
                    <p>{moneyFormatter.format(activity.price)}</p>
                  </div>
                  <dl className="activity-details">
                    <div>
                      <dt>מיקום</dt>
                      <dd>{activity.location}</dd>
                    </div>
                    <div>
                      <dt>תאריך</dt>
                      <dd>{dateFormatter.format(new Date(`${activity.date}T12:00:00`))}</dd>
                    </div>
                    <div>
                      <dt>מדריך/ה</dt>
                      <dd>{activity.instructor}</dd>
                    </div>
                    <div>
                      <dt>גילאים</dt>
                      <dd>
                        {activity.minAge}-{activity.maxAge}
                      </dd>
                    </div>
                    <div>
                      <dt>קבוצה</dt>
                      <dd>{activity.gender}</dd>
                    </div>
                  </dl>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 ? (
            <nav className="pagination" aria-label="עמודי פעילויות">
              <Link
                aria-disabled={filters.page <= 1}
                className={filters.page <= 1 ? "page-link disabled" : "page-link"}
                href={createQuery({ page: String(Math.max(1, filters.page - 1)) })}
              >
                הקודם
              </Link>
              {pagination.map((page) => (
                <Link
                  aria-current={page === filters.page ? "page" : undefined}
                  className={page === filters.page ? "page-link current" : "page-link"}
                  href={createQuery({ page: String(page) })}
                  key={page}
                >
                  {page}
                </Link>
              ))}
              <Link
                aria-disabled={filters.page >= totalPages}
                className={filters.page >= totalPages ? "page-link disabled" : "page-link"}
                href={createQuery({ page: String(Math.min(totalPages, filters.page + 1)) })}
              >
                הבא
              </Link>
            </nav>
          ) : null}
        </>
      ) : (
        <div className="empty-state">
          <h2>לא נמצאו פעילויות למסננים שבחרת.</h2>
          <p>אפשר להרחיב גיל, מיקום או תקציב ולנסות שוב.</p>
          <Link href={pathname}>ניקוי מסננים</Link>
        </div>
      )}
    </section>
  );
}
