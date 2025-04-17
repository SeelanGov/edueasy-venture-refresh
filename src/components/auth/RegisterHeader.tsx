
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from "@/components/Logo";

export const RegisterHeader = () => {
  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          height: "180px",
        }}
      />
      <div className="relative z-10 pt-6 flex justify-center">
        <Link to="/">
          <Logo />
        </Link>
      </div>
    </div>
  );
};
