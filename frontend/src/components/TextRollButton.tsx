'use client';

import { ArrowRight } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';

interface TextRollButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  variant?: 'dark' | 'orange' | 'white';
  size?: 'sm' | 'md' | 'lg';
  iconCircleClassName?: string;
  iconColor?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function TextRollButton({
  text,
  onClick,
  className,
  variant = 'orange',
  size = 'md',
  iconCircleClassName,
  iconColor,
  type = 'button',
  disabled = false,
}: TextRollButtonProps) {
  const bgClasses = {
    orange: 'bg-[#F26522] hover:bg-[#e05a1a] text-white',
    dark: 'bg-gray-900 hover:bg-gray-800 text-white',
    white: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
  }[variant];

  const circleBgClasses = {
    orange: 'bg-white text-[#F26522]',
    dark: 'bg-white text-gray-900',
    white: 'bg-gray-900 text-white',
  }[variant];

  const circleSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-7 h-7 sm:w-8 sm:h-8';
  const iconSize = size === 'sm' ? 12 : 14;
  const pyClass = size === 'sm' ? 'py-1.5 pl-4 pr-1.5' : 'py-2 pl-5 sm:pl-6 pr-2';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'group inline-flex items-center gap-3 rounded-full font-medium transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed shadow-xs',
        bgClasses,
        pyClass,
        className
      )}
    >
      <div className="flex flex-col overflow-hidden h-[20px] relative text-xs sm:text-sm">
        <span className="transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full inline-block">
          {text}
        </span>
        <span className="transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full inline-block absolute top-full left-0">
          {text}
        </span>
      </div>
      <div
        className={clsx(
          'rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45',
          circleBgClasses,
          circleSize,
          iconCircleClassName
        )}
      >
        <ArrowRight size={iconSize} className={iconColor} />
      </div>
    </button>
  );
}
