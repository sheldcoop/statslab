
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

const testimonials = [
  {
    name: 'Sarah L.',
    title: 'Quantitative Analyst, Hedge Fund',
    avatar: 'SL',
    quote:
      "StatSpark's interactive modules on time series analysis were a game-changer for my model development. The visual approach solidified concepts I've only read about.",
  },
  {
    name: 'David C.',
    title: 'Data Science Lead, FinTech Startup',
    avatar: 'DC',
    quote:
      "I recommend StatSpark to all my junior analysts. It bridges the gap between academic theory and real-world application faster than any other resource I've seen.",
  },
  {
    name: 'Michael B.',
    title: 'Portfolio Manager, Asset Management',
    avatar: 'MB',
    quote:
      "The mental math trainers are surprisingly effective. My speed and accuracy in meetings have noticeably improved. It's an essential tool for any quant.",
  },
  {
    name: 'Jennifer A.',
    title: 'PhD Student, Computational Finance',
    avatar: 'JA',
    quote:
      'Finally, a platform that respects the depth of the material while making it accessible. The linear algebra visualizations are second to none. A must-have for students.',
  },
];

export default function Testimonials() {
  const imagePlaceholders = placeholderImages.testimonials;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full text-center"
    >
      <h2 className="font-headline text-4xl font-bold md:text-5xl">
        Trusted by Quants & Data Scientists
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
        See why professionals and academics are making StatSpark their go-to
        platform for quantitative mastery.
      </p>
      <div className="relative mt-12">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => {
              const placeholder = imagePlaceholders[index];
              const imageUrl = `https://picsum.photos/seed/${placeholder.seed}/${placeholder.width}/${placeholder.height}`;

              return (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="h-full border-2 border-border bg-card/50">
                      <CardContent className="flex h-full flex-col justify-between p-6 text-left">
                        <div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="mt-4 text-base italic text-foreground/80">
                            "{testimonial.quote}"
                          </p>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                          <Avatar>
                            <AvatarImage asChild>
                              <Image
                                src={imageUrl}
                                alt={testimonial.name}
                                width={placeholder.width}
                                height={placeholder.height}
                                data-ai-hint={placeholder.hint}
                                loading="lazy"
                              />
                            </AvatarImage>
                            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.title}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </motion.div>
  );
}
