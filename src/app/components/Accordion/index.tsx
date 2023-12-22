import { useState, useEffect } from "react";

interface AccordionProps {
  question: string;
  answer: any;
  isShow: boolean;
  isLast: boolean;
  onClick: () => void;
}

export default function Accordion({
  question,
  answer,
  isShow,
  isLast,
  onClick,
}: AccordionProps) {
  const createMarkup = () => {
    return { __html: answer };
  };

  return (
    <div
      className={`py-5 cursor-pointer ${isLast ? "" : "border-b border-gray-600"
        }`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <h3>{question}</h3>
        <h3>+</h3>
      </div>
      {isShow && <div className="mt-6" dangerouslySetInnerHTML={createMarkup()} />}
    </div>
  );
}
