import { ActivityCatalogue } from "../components/activity-catalogue";
import { getActivities } from "../lib/activities";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activities = await getActivities();

  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">NirKono Activities</p>
          <h1 id="page-title">Find the next class, club, or weekend spark.</h1>
        </div>
        <p className="intro-copy">
          Browse age-friendly activities by style, location, instructor, price, and fit.
        </p>
      </section>

      <ActivityCatalogue activities={activities} />
    </main>
  );
}
