import { useEffect, useState } from "react";
import { PiArrowUpRightBold } from "react-icons/pi";
import { HiArrowUpRight } from "react-icons/hi2";

interface ButtonProps {
    text: any;
    className?: string | null;
    hasArrow?: boolean;
    onMouseEnter?: () => void,
    onMouseLeave?: () => void,
    onClick?: () => void;
}

const defaultProps: Partial<ButtonProps> = {
    hasArrow: true,
};

export default function Button({ text, className, hasArrow = defaultProps.hasArrow, onMouseEnter, onMouseLeave, onClick }: ButtonProps) {
    return (
        <div className={`inline-flex items-center h-10 bg-[#00e5ff]  rounded-full text-black cursor-pointer ${hasArrow ? 'pl-5 pr-1' : 'px-5'} ${className ? className : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}>
            {text}
            {hasArrow &&
                <div className="inline-flex items-center justify-center w-auto h-[88%] aspect-square ml-3 rounded-full bg-[#171717]">
                    <HiArrowUpRight className="w-4 h-4 text-white stroke-1" />
                </div>
            }
        </div>
    )
}