import Link from "next/link";

const categories = [
  {
    name: "Education",
    description: "Support students, schools, and educational projects.",
  },
  {
    name: "Medical",
    description: "Help people with important medical and healthcare needs.",
  },
  {
    name: "Community",
    description: "Support projects that make local communities better.",
  },
  {
    name: "Technology",
    description: "Help innovative technology projects grow.",
  },
];

export default function ExploreCategories() {
  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Explore Categories</p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Find a Cause You Care About
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-default-500 md:text-base">
            Explore different categories and discover campaigns that need your
            support.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/campaigns?category=${category.name.toLowerCase()}`}
              className="rounded-2xl border bg-background p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {category.name.charAt(0)}
              </div>

              <h3 className="mt-5 text-lg font-semibold">{category.name}</h3>

              <p className="mt-2 text-sm leading-6 text-default-500">
                {category.description}
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-primary">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
