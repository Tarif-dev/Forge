"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
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
    { href: "/agents", label: "Agents" },
    { href: "/payments", label: "Payments" },
    { href: "/reputation", label: "Reputation" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
