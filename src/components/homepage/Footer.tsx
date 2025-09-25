import React from 'react';
import Link from 'next/link';
import { Dices, Twitter, Github, Linkedin } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Linear Algebra', href: '/modules/linear-algebra' },
    { name: 'Statistics', href: '/modules/statistics' },
    { name: 'Machine Learning', href: '/modules/machine-learning' },
    { name: 'Time Series', href: '/modules/time-series' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-card">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold font-headline"
            >
              <Dices className="h-7 w-7 text-primary" />
              StatSpark
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground">
              Your interactive engine for mastering quantitative concepts.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider text-foreground">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StatSpark, Inc. All rights
            reserved.
          </p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
