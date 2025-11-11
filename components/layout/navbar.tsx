"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const WalletButton = dynamic(
  async () => (await import("../wallet-button")).WalletButton,
  { ssr: false }
);

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/bounties", label: "Bounties" },
    { href: "/my-bounties", label: "My Bounties" },
    { href: "/profile", label: "Profile" },
    { href: "/agents", label: "Agents" },
    { href: "/reputation", label: "Reputation" },
  ];

  const paymentItems = [
    {
      href: "/payments/overview",
      label: "Overview",
      description: "All payment methods",
    },
    {
      href: "/payments/x402",
      label: "x402 Autonomous",
      description: "Agent-to-agent payments",
    },
    {
      href: "/payments/cash",
      label: "Phantom CASH",
      description: "Ultra-low fee payments",
    },
    {
      href: "/payments/agentpay",
      label: "AgentPay",
      description: "API micropayments",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Forge</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link
                    href={item.href}
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      pathname === item.href ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}

              {/* Payments Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none ${
                    pathname.startsWith("/payments")
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  Payments
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {paymentItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
                              pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : ""
                            }`}
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.label}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
