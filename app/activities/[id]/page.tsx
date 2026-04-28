import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActivityById } from "../../../lib/activities";

type ActivityDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const moneyFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

function buildBackHref(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default async function ActivityDetailPage({
  params,
  searchParams
}: ActivityDetailPageProps) {
  const { id } = await params;
  const activityId = Number(id);

  if (!Number.isInteger(activityId)) {
    notFound();
  }

  const [activity, resolvedSearchParams] = await Promise.all([
    getActivityById(activityId),
    searchParams ?? Promise.resolve({})
  ]);

  if (!activity) {
    notFound();
  }

  return (
    <main className="detail-shell" dir="rtl">
      <Link className="back-link" href={buildBackHref(resolvedSearchParams)}>
        חזרה לקטלוג
      </Link>

      <article className="detail-layout">
        <div className="detail-image-wrap">
          <Image
            src={activity.image}
            alt=""
            className="detail-image"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
          />
          <span className="genre-chip">{activity.genre}</span>
        </div>

        <section className="detail-panel">
          <p className="eyebrow">{activity.location}</p>
          <h1>{activity.name}</h1>
          <p className="detail-description">{activity.description}</p>

          <dl className="detail-facts">
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
            <div>
              <dt>מחיר</dt>
              <dd>{moneyFormatter.format(activity.price)}</dd>
            </div>
          </dl>

          <div className="detail-note">
            <h2>מה מצפה למשתתפים?</h2>
            <p>
              מפגש מובנה בקבוצה קטנה, התאמה לרמת המשתתפים, פתיחה רגועה, תרגול מעשי
              וסיכום קצר להורים או למשתתפים בסוף הפעילות.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
