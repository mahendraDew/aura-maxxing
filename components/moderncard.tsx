"use client"

import { cn } from "@/lib/utils"
import { ReactNode} from "react"
import React from "react"


interface ModernCardProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  onSubscribe?: (email: string) => Promise<{ success: boolean; error?: string }>
  backgroundEffect?: boolean
}

export function ModernCard({
  children,
  backgroundEffect = true,
  className,
  ...props
}: ModernCardProps) {
 


  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="dark relative overflow-hidden rounded-xl bg-zinc-900 px-4 py-10 sm:px-8">
        {backgroundEffect && <BackgroundEffect />}
        {/* <h2 className="mb-6 text-xl/[1.1] font-extrabold tracking-tight text-foreground md:text-2xl/[1.1]">
          {title}
        </h2> */}
        {children}
      </div>
    </section>
  )
}

function BackgroundEffect() {
  return (
    <div
      className="pointer-events-none absolute -right-64 -top-48"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="856"
        height="745"
        fill="none"
      >
        <g filter="url(#ill-a)">
          <path
            fill="url(#ill-b)"
            fillRule="evenodd"
            d="m56 88 344 212-166 188L56 88Z"
            clipRule="evenodd"
          />
        </g>
        <g filter="url(#ill-c)">
          <path
            fill="url(#ill-d)"
            fillRule="evenodd"
            d="m424 257 344 212-166 188-178-400Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <linearGradient
            id="ill-b"
            x1="210.5"
            x2="210.5"
            y1="88"
            y2="467"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.64" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="ill-d"
            x1="578.5"
            x2="578.5"
            y1="257"
            y2="636"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.64" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter
            id="ill-a"
            width="520"
            height="576"
            x="-32"
            y="0"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_244_5"
              stdDeviation="44"
            />
          </filter>
          <filter
            id="ill-c"
            width="520"
            height="576"
            x="336"
            y="169"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_244_5"
              stdDeviation="44"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
