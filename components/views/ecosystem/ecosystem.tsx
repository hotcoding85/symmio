"use client";

import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { useTheme } from "next-themes";
import External from "@/components/icons/external";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { theme } = useTheme();

  const getIconUrl = (icon: string) => {
    if (theme === "light") {
      if (icon === "safe") {
        return `https://cdn.morpho.org/v2/communication/images/${icon.toLowerCase()}-logo-bw.svg`;
      } else if (["brahma", "vaultcraft", "ionic"].includes(icon)) {
        return `https://cdn.morpho.org/v2/communication/images/${icon.toLowerCase()}-logo-bw-dark.png`;
      } else if (icon === "moonwell") {
        return `https://cdn.morpho.org/v2/communication/images/${icon.toLowerCase()}-logo-bw-black.png`;
      }
      return `https://cdn.morpho.org/v2/communication/images/${icon.toLowerCase()}-logo-bw.png`;
    } else {
      if (icon === "ionic") {
        return `https://cdn.morpho.org/v2/communication/images/${icon.toLowerCase()}-logo-bw-light.png`;
      }
      return `https://cdn.morpho.org/v2/communication/images/${icon.toLowerCase()}-logo-bw-white.png`;
    }
  };

  return (
    <div
      className={cn(
        "bg-foreground rounded-lg p-5 flex h-[240px] transition-all hover:shadow-lg hover:scale-[1.02]",
        className
      )}
    >
      <div className="flex flex-col h-full justify-between w-full">
        <div className="mb-4 flex justify-between">
          <div className="bg-accent w-[60px] h-[60px] rounded-full flex items-center justify-center">
            {project.icon ? (
              <Image
                src={getIconUrl(project.icon)}
                width={24}
                height={24}
                alt={project.name}
                className="object-contain"
              />
            ) : (
              <div className="w-6 h-6 bg-muted rounded-full" />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-accent hover:bg-[#2470ff] cursor-pointer w-[31px] h-[31px]"
            asChild
          >
            <Link 
              href={`/ecosystem/${project.projectId || project.id}`} 
              className="block group"
              aria-label={`View ${project.name} details`}
            >
              <External className="h-[2px] w-[2px] text-primary" width="6px" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[20px] font-normal text-primary line-clamp-1">
            {project.name}
          </h3>
          <p className="text-[14px] text-muted leading-[16px] overflow-hidden text-ellipsis whitespace-normal line-clamp-4">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-foreground rounded-lg p-5 flex h-[240px]">
      <div className="flex flex-col h-full justify-between w-full">
        <div className="mb-4 flex justify-between">
          <Skeleton className="w-[60px] h-[60px] rounded-full" />
          <Skeleton className="w-[31px] h-[31px] rounded-full" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}