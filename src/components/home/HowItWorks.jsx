const steps = [
  {
    number: "01",
    title: "Create a Campaign",
    description:
      "Create your campaign with a title, description, goal amount, image, and deadline.",
  },
  {
    number: "02",
    title: "Share Your Campaign",
    description:
      "Share your campaign with your community and let people discover your project.",
  },
  {
    number: "03",
    title: "Receive Support",
    description:
      "Supporters can use their available credits to contribute to your campaign.",
  },
  {
    number: "04",
    title: "Make an Impact",
    description:
      "Use the raised credits to bring your idea to life and create a positive impact.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">How It Works</p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Start Making an Impact
          </h2>

          <p className="mt-3 text-sm leading-6 text-default-500 md:text-base">
            Our crowdfunding platform makes it simple to create campaigns,
            support meaningful projects, and make a difference.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border bg-background p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Number */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-default-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
