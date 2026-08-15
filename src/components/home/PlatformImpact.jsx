const impactStats = [
  {
    value: "1,000+",
    label: "Campaigns Supported",
    description: "Projects receiving support from our community.",
  },
  {
    value: "৳5M+",
    label: "Credits Raised",
    description: "Total credits contributed to meaningful campaigns.",
  },
  {
    value: "2,500+",
    label: "Active Supporters",
    description: "People helping ideas and communities grow.",
  },
  {
    value: "95%",
    label: "Success Rate",
    description: "Campaigns reaching their funding goals.",
  },
];

export default function PlatformImpact() {
  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border bg-background p-6 md:p-10">
          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Platform Impact</p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Together, We Can Make a Difference
            </h2>

            <p className="mt-3 text-sm leading-6 text-default-500 md:text-base">
              Every contribution helps turn meaningful ideas into real-world
              impact.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-default-50 p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </p>

                <h3 className="mt-3 font-semibold">{stat.label}</h3>

                <p className="mt-2 text-sm leading-6 text-default-500">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
