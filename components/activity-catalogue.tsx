"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Activity } from "../lib/activities";

type ActivityCatalogueProps = {
  activities: Activity[];
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

function uniqueValues(activities: Activity[], key: keyof Activity) {
  return Array.from(new Set(activities.map((activity) => String(activity[key])))).sort();
}

export function ActivityCatalogue({ activities }: ActivityCatalogueProps) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [location, setLocation] = useState("All");
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const genres = useMemo(() => uniqueValues(activities, "genre"), [activities]);
  const locations = useMemo(() => uniqueValues(activities, "location"), [activities]);
  const genders = useMemo(() => uniqueValues(activities, "gender"), [activities]);

  const filteredActivities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const requestedAge = age === "" ? null : Number(age);
    const requestedMaxPrice = maxPrice === "" ? null : Number(maxPrice);

    return activities.filter((activity) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [activity.name, activity.location, activity.genre, activity.instructor]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesGenre = genre === "All" || activity.genre === genre;
      const matchesLocation = location === "All" || activity.location === location;
      const matchesGender = gender === "All" || activity.gender === gender;
      const matchesAge =
        requestedAge === null ||
        (activity.minAge <= requestedAge && requestedAge <= activity.maxAge);
      const matchesPrice = requestedMaxPrice === null || activity.price <= requestedMaxPrice;

      return (
        matchesSearch &&
        matchesGenre &&
        matchesLocation &&
        matchesGender &&
        matchesAge &&
        matchesPrice
      );
    });
  }, [activities, age, gender, genre, location, maxPrice, search]);

  function resetFilters() {
    setSearch("");
    setGenre("All");
    setLocation("All");
    setGender("All");
    setAge("");
    setMaxPrice("");
  }

  return (
    <section className="catalogue" aria-label="Activities catalogue">
      <div className="filters" aria-label="Activity filters">
        <label className="filter-field filter-field-wide">
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Dance, coding, Maya..."
            type="search"
          />
        </label>

        <label className="filter-field">
          <span>Genre</span>
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            <option>All</option>
            {genres.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Location</span>
          <select value={location} onChange={(event) => setLocation(event.target.value)}>
            <option>All</option>
            {locations.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Gender</span>
          <select value={gender} onChange={(event) => setGender(event.target.value)}>
            <option>All</option>
            {genders.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>

        <label className="filter-field compact-field">
          <span>Age</span>
          <input
            min="0"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="10"
            type="number"
          />
        </label>

        <label className="filter-field compact-field">
          <span>Max price</span>
          <input
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="80"
            type="number"
          />
        </label>

        <button className="reset-button" type="button" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div className="result-row">
        <p>
          Showing <strong>{filteredActivities.length}</strong> of{" "}
          <strong>{activities.length}</strong> activities
        </p>
      </div>

      {filteredActivities.length > 0 ? (
        <div className="activity-grid">
          {filteredActivities.map((activity) => (
            <article className="activity-card" key={activity.id}>
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
                    <dt>Location</dt>
                    <dd>{activity.location}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{dateFormatter.format(new Date(`${activity.date}T12:00:00`))}</dd>
                  </div>
                  <div>
                    <dt>Instructor</dt>
                    <dd>{activity.instructor}</dd>
                  </div>
                  <div>
                    <dt>Ages</dt>
                    <dd>
                      {activity.minAge}-{activity.maxAge}
                    </dd>
                  </div>
                  <div>
                    <dt>Gender</dt>
                    <dd>{activity.gender}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No activities match these filters.</h2>
          <p>Try widening the age range, location, or budget.</p>
          <button type="button" onClick={resetFilters}>
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
