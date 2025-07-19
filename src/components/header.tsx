
"use client";
import * as React from "react";
import MegaMenu from "@/components/ui/mega-menu";
import type { MegaMenuItem } from "@/components/ui/mega-menu";
import {
  Cpu,
  Globe,
  Eye,
  Shield,
  Rocket,
  Box,
  Search,
  Palette,
  BookOpen,
  FileText,
  Newspaper,
  Aperture,
} from "lucide-react";

const NAV_ITEMS: MegaMenuItem[] = [
    {
      id: 1,
      label: "Products",
      subMenus: [
        {
          title: "DX Platform",
          items: [
            {
              label: "Previews",
              description: "Helping teams ship 6× faster",
              icon: Cpu,
            },
            {
              label: "AI",
              description: "Powering breakthroughs",
              icon: Search,
            },
          ],
        },
        {
          title: "Managed Infrastructure",
          items: [
            {
              label: "Rendering",
              description: "Fast, scalable, and reliable",
              icon: Globe,
            },
            {
              label: "Observability",
              description: "Trace every step",
              icon: Eye,
            },
            {
              label: "Security",
              description: "Scale without compromising",
              icon: Shield,
            },
          ],
        },
        {
          title: "Open Source",
          items: [
            {
              label: "Next.js",
              description: "The native Next.js platform",
              icon: Rocket,
            },
            {
              label: "Turborepo",
              description: "Speed with Enterprise scale",
              icon: Box,
            },
            {
              label: "AI SDK",
              description: "The AI Toolkit for TypeScript",
              icon: Palette,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      label: "Solutions",
      subMenus: [
        {
          title: "Use Cases",
          items: [
            {
              label: "AI Apps",
              description: "Deploy at the speed of AI",
              icon: Cpu,
            },
            {
              label: "Composable Commerce",
              description: "Power storefronts that convert",
              icon: Box,
            },
            {
              label: "Marketing Sites",
              description: "Launch campaigns fast",
              icon: Rocket,
            },
            {
              label: "Multi-tenant Platforms",
              description: "Scale apps with one codebase",
              icon: Globe,
            },
            {
              label: "Web Apps",
              description: "Ship features, not infrastructure",
              icon: Search,
            },
          ],
        },
        {
          title: "Users",
          items: [
            {
              label: "Platform Engineers",
              description: "Automate away repetition",
              icon: Cpu,
            },
            {
              label: "Design Engineers",
              description: "Deploy for every idea",
              icon: Palette,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      label: "Resources",
      subMenus: [
        {
          title: "Tools",
          items: [
            {
              label: "Resource Center",
              description: "Today's best practices",
              icon: BookOpen,
            },
            {
              label: "Marketplace",
              description: "Extend and automate workflows",
              icon: Search,
            },
            {
              label: "Templates",
              description: "Jumpstart app development",
              icon: FileText,
            },
            {
              label: "Guides",
              description: "Find help quickly",
              icon: BookOpen,
            },
            {
              label: "Partner Finder",
              description: "Get help from solution partners",
              icon: Search,
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "Customers",
              description: "Trusted by the best teams",
              icon: Newspaper,
            },
            {
              label: "Blog",
              description: "The latest posts and changes",
              icon: FileText,
            },
            {
              label: "Changelog",
              description: "See what shipped",
              icon: BookOpen,
            },
            {
              label: "Press",
              description: "Read the latest news",
              icon: Newspaper,
            },
          ],
        },
      ],
    },
    { id: 4, label: "Enterprise", link: "#" },
    { id: 5, label: "Docs", link: "#" },
    { id: 6, label: "Pricing", link: "#" },
  ];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-sm">
      <nav className="container mx-auto px-4 flex items-center justify-between py-2">
        <a href="/" className="flex items-center gap-2">
            <Aperture className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">Cosmic Sticker Studio</span>
        </a>
        <MegaMenu items={NAV_ITEMS} />
      </nav>
    </header>
  );
}
