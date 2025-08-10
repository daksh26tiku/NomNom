import LoginForm from "@/components/LoginForm";
import React from "react";

export default function Page() {
  return (
    <section className="min-h-screen w-full relative">
      <div className="absolute inset-0 w-full">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="absolute top-0 left-0 right-0 w-full h-full -z-10"
        >
          <rect x="0" y="0" width="960" height="540" fill="#ffd6a8"></rect>
          <defs>
            <linearGradient id="grad1_0" x1="43.8%" y1="100%" x2="100%" y2="0%">
              <stop
                offset="14.444444444444446%"
                stopColor="#ffd6a8"
                stopOpacity="1"
              ></stop>
              <stop
                offset="85.55555555555554%"
                stopColor="#ffd6a8"
                stopOpacity="1"
              ></stop>
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="grad2_0" x1="0%" y1="100%" x2="56.3%" y2="0%">
              <stop
                offset="14.444444444444446%"
                stopColor="#ffd6a8"
                stopOpacity="1"
              ></stop>
              <stop
                offset="85.55555555555554%"
                stopColor="#ffd6a8"
                stopOpacity="1"
              ></stop>
            </linearGradient>
          </defs>
          <g transform="translate(960, 540)">
            <path
              d="M-459 0C-421.1 -33.2 -383.2 -66.4 -364.2 -97.6C-345.1 -128.7 -344.8 -157.8 -345.5 -199.5C-346.3 -241.2 -348 -295.5 -324.6 -324.6C-301.1 -353.6 -252.4 -357.4 -214 -370.7C-175.6 -383.9 -147.3 -406.8 -113.4 -423.1C-79.4 -439.4 -39.7 -449.2 0 -459L0 0Z"
              fill="#ff8733"
            ></path>
          </g>
          <g transform="translate(0, 0)">
            <path
              d="M459 0C460.7 42.1 462.5 84.2 443.4 118.8C424.2 153.4 384.3 180.5 352.5 203.5C320.7 226.5 297.1 245.5 280 280C262.9 314.5 252.3 364.4 225 389.7C197.7 415 153.6 415.6 113.4 423.1C73.1 430.5 36.5 444.8 0 459L0 0Z"
              fill="#ff8733"
            ></path>
          </g>
        </svg>

        <div className="flex h-full justify-center items-center">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
