"use client";

import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "info";
export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps {
  /** Content to display inside the badge */
  children: ReactNode;
  /** Style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Optional icon to display */
  icon?: ReactElement;
  /** Additional class names */
  className?: string;
  /** Whether to animate the badge entry */
  animated?: boolean;
  /** Whether to use pill styling (rounded corners) */
  pill?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  icon,
  className = "",
  animated = false,
  pill = true,
  onClick,
}: BadgeProps) {
  // Define variant styles
  const variantStyles: Record<BadgeVariant, string> = {
    primary: "border-primary-500/20 bg-primary-500/10 text-primary-400",
    success: "border-success-500/20 bg-success-500/10 text-success-400",
    warning: "border-warning-500/20 bg-warning-500/10 text-warning-400",
    danger: "border-danger-500/20 bg-danger-500/10 text-danger-400",
    neutral: "border-slate-500/20 bg-slate-500/10 text-slate-400",
    info: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  };

  // Define size styles
  const sizeStyles: Record<BadgeSize, string> = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-sm",
  };

  // Get the appropriate icon size based on badge size
  function getIconSize(size: BadgeSize): number {
    switch (size) {
      case "xs":
        return 12;
      case "sm":
        return 14;
      case "md":
        return 16;
      case "lg":
        return 18;
      default:
        return 14;
    }
  }

  // Prepare the icon element if provided
  const iconElement =
    icon && isValidElement(icon)
      ? cloneElement(icon, {
          // @ts-ignore
          size: getIconSize(size),
          className: "mr-1",
        })
      : null;

  // Create the base badge styles
  const baseStyles = `
    inline-flex items-center
    border font-medium
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${pill ? "rounded-full" : "rounded-md"}
    ${onClick ? "cursor-pointer hover:opacity-80" : ""}
    ${className}
  `;

  // Define animation variants for framer-motion
  const animationVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  // Return animated or static badge based on props
  if (animated) {
    return (
      <motion.span
        className={baseStyles}
        initial="initial"
        animate="animate"
        whileHover={onClick ? "hover" : undefined}
        whileTap={onClick ? "tap" : undefined}
        variants={animationVariants}
        onClick={onClick}
      >
        {iconElement}
        {children}
      </motion.span>
    );
  }

  return (
    <span
      className={baseStyles}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {iconElement}
      {children}
    </span>
  );
}
