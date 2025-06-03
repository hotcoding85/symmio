"use client";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="fixed flex w-full flex-row gap-4 bottom-0 h-[40px] md:h-[40px] pt-0 shrink-0 items-center border-b border-transparent bg-foreground px-[11px] lg:px-[20px]">
      <Link
        className={cn(
          "flex items-center gap-3 rounded-sm py-[6px] font-[500] transition-colors ",
          "justify-center px-0",
          "bg-transparent hover:underline text-primary text-[12px]"
          // className,
          // active
          //   ? "bg-foreground hover:bg-accent text-primary"
          //   : " hover:bg-accent hover:text-muted"
        )}
        href={"/connect"}
      >
        <Home className="text-primary hover:underline text-[12px] w-4 h-4" />
      </Link>
      <span className="text-primary text-[12px]">/</span>
      <Link
        className={cn(
          "flex items-center gap-3 rounded-sm py-[6px] font-[500] transition-colors ",
          "justify-center px-0",
          "bg-transparent hover:underline text-primary text-[12px]"
          // className,
          // active
          //   ? "bg-foreground hover:bg-accent text-primary"
          //   : " hover:bg-accent hover:text-muted"
        )}
        href={"/connect"}
      >
        {t("common.connect")}
      </Link>
      <span className="text-primary text-[12px]">/</span>
      <Link
        className={cn(
          "flex items-center gap-3 rounded-sm py-[6px] font-[500] transition-colors ",
          "justify-center px-0",
          "bg-transparent hover:underline text-primary text-[12px]"
          // className,
          // active
          //   ? "bg-foreground hover:bg-accent text-primary"
          //   : " hover:bg-accent hover:text-muted"
        )}
        href={"/subscribe"}
      >
        {t("common.subscribe")}
      </Link>
      <span className="text-primary text-[12px]">/</span>
      <Link
        className={cn(
          "flex items-center gap-3 rounded-sm py-[6px] font-[500] transition-colors ",
          "justify-center px-0",
          "bg-foreground hover:underline text-primary text-[12px]"
          // className,
          // active
          //   ? "bg-foreground hover:bg-accent text-primary"
          //   : " hover:bg-accent hover:text-muted"
        )}
        href={"/buy"}
      >
        {t("common.buy")}
      </Link>
    </footer>
  );
}
