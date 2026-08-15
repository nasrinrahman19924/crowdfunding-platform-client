"use client";


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Mona",
    role: "Campaign Creator",
    quote:
      "This platform made it easy for me to share my campaign and receive support from the community.",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Rahim",
    role: "Supporter",
    quote:
      "I love how simple it is to discover meaningful campaigns and support projects I care about.",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Sarah",
    role: "Campaign Creator",
    quote:
      "Creating and managing a campaign was simple. The platform gave me a great way to reach supporters.",
    image: "https://i.pravatar.cc/150?img=32",
  },
];

export default function Testimonials() {
  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Testimonials</p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            What Our Users Say
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-default-500 md:text-base">
            Hear from people who are creating campaigns and supporting
            meaningful projects through our platform.
          </p>
        </div>

        {/* Swiper */}
        <div className="mt-10">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <div className="rounded-2xl border bg-background p-6 text-center shadow-sm md:p-10">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="mx-auto h-20 w-20 rounded-full object-cover"
                  />

                  <blockquote className="mx-auto mt-6 max-w-2xl text-lg leading-8 md:text-xl">
                    “{testimonial.quote}”
                  </blockquote>

                  <h3 className="mt-6 font-semibold">{testimonial.name}</h3>

                  <p className="mt-1 text-sm text-default-500">
                    {testimonial.role}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
