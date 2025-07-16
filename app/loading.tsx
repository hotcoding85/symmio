"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import { motion } from "framer-motion";
import Logo from "@/components/icons/logo";

const logo = "/frames/frame52.png";

const desktopImages = [
  "/frames/frame24.png",
  "/frames/frame27.png",
  "/frames/frame30.png",
  "/frames/frame31.png",
  "/frames/frame26.png",
  "/frames/frame25.png",
];

const mobileImages = [
  "/frames/frame30.png",
  "/frames/frame27.png",
  "/frames/frame24.png",
  "/frames/frame25.png",
];

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const images = isMobile ? mobileImages : desktopImages;
  const [startExit, setStartExit] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStartExit(true), 1600); // Start exit at 1.6s
    const finish = setTimeout(() => onFinish(), 2000); // End at 2s
    return () => {
      clearTimeout(timeout);
      clearTimeout(finish);
    };
  }, [onFinish]);

  const imageVariants: any = (i: number) => ({
    hidden: {
      opacity: 0,
      scale: 0.3,
      x: Math.cos((i / images.length) * 2 * Math.PI) * 400,
      y: Math.sin((i / images.length) * 2 * Math.PI) * 400,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: i * 0.1, // faster stagger
      },
    },
  });

  const logoVariants = {
    enter: {
      opacity: 0,
      scale: 0.8,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: { delay: images.length * 0.1 + 0.2 }, // shorter delay
    },
    exit: {
      opacity: 0,
      scale: 0.1,
      rotate: 180,
      transition: { duration: 0.4, ease: "easeInOut" }, // quicker exit
    },
  };

  return (
    <div className="w-screen h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
      {isMobile ? (
        <div className="relative w-screen h-screen bg-background overflow-hidden">
          {/* Top row: full width, natural height */}
          <div className="absolute top-0 w-screen grid grid-cols-2">
            {images.slice(0, 2).map((src, i) => (
              <motion.div
                key={i}
                className="relative w-full aspect-[1/1]" // or use specific ratio like 3/2
                variants={imageVariants(i)}
                initial="hidden"
                animate="visible"
              >
                <Image
                  src={src}
                  alt={`img-top-${i}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom row: full width, natural height */}
          <div className="absolute bottom-0 w-screen grid grid-cols-2">
            {images.slice(2, 4).map((src, i) => (
              <motion.div
                key={i + 2}
                className="relative w-full aspect-[1/1]" // or adjust as needed
                variants={imageVariants(i + 2)}
                initial="hidden"
                animate="visible"
              >
                <Image
                  src={src}
                  alt={`img-bottom-${i}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Centered logo */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            variants={logoVariants as any}
            initial="enter"
            animate={startExit ? "exit" : "center"}
          >
            <Image src={logo} alt="Logo" width={220} height={160} />
          </motion.div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 grid-rows-2 w-[80vw] max-w-[720px] aspect-[3/2]">
            {images.map((src, i) => (
              <motion.div
                key={i}
                className="relative w-full h-full"
                variants={imageVariants(i)}
                initial="hidden"
                animate="visible"
              >
                <Image
                  src={src}
                  alt={`img-${i}`}
                  fill
                  className="object-cover rounded-md"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-6"
            variants={logoVariants as any}
            initial="enter"
            animate={"center"}
          >
            <Image src={logo} width={400} height={300} alt="Logo" />
          </motion.div>
        </>
      )}
    </div>
  );
}
