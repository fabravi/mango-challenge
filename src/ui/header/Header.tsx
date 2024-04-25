"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.scss";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="/mango.svg"
          alt="Mango Logo"
          width={200}
          height={50}
          priority
        />
      </Link>

      <nav className={styles.menu}>
        <ul>
          <li>
            <Link
              href="/exercise1"
              className={isActive("/exercise1") ? styles.active : ""}
            >
              Exercise 1
            </Link>
          </li>
          <li>
            <Link
              href="/exercise2"
              className={isActive("/exercise2") ? styles.active : ""}
            >
              Exercise 2
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
