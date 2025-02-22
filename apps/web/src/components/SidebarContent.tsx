import { motion } from "framer-motion";
import {
  Book,
  BookOpen,
  ExternalLink,
  Mic,
  Moon,
  Network,
  Package,
  Server,
} from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";

interface NavItemProps {
  href: string;
  icon: ElementType;
  label: string;
  external?: boolean;
}

interface NavSection {
  title: string;
  items: NavItemProps[];
}

const navigationSections: NavSection[] = [
  {
    title: "Core Concepts",
    items: [
      { href: "#", icon: BookOpen, label: "Introduction" },
      { href: "#", icon: Book, label: "Commands" },
      { href: "#", icon: Book, label: "Events" },
    ],
  },
  {
    title: "Packages",
    items: [
      { href: "#", icon: Package, label: "Core" },
      { href: "#", icon: Network, label: "Gateway" },
      { href: "#", icon: Moon, label: "Nyx.js" },
      { href: "#", icon: Server, label: "Rest" },
      { href: "#", icon: Mic, label: "Voice" },
    ],
  },
  {
    title: "Quick Links",
    items: [
      {
        href: "https://discord.gg/your-discord",
        icon: ExternalLink,
        label: "Join Discord",
        external: true,
      },
      {
        href: "https://github.com/3tatsu/nyx.js/issues",
        icon: ExternalLink,
        label: "Report Issue",
        external: true,
      },
    ],
  },
];

function NavItem({ href, icon: Icon, label, external }: NavItemProps) {
  const commonProps = {
    className:
      "flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-neutral-700 rounded-lg p-2 transition-all duration-200",
    ...(external && {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  };

  return external ? (
    <a href={href} {...commonProps}>
      <Icon size={18} />
      <span>{label}</span>
    </a>
  ) : (
    <Link href={href} {...commonProps}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export function SidebarContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {navigationSections.map((section, index) => (
        <div
          key={section.title}
          className={`${index !== navigationSections.length - 1 ? "mb-6" : ""}`}
        >
          <h2 className="mb-4 font-semibold text-gray-300 text-xl">
            {section.title}
          </h2>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item.label}>
                <NavItem {...item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </motion.div>
  );
}
