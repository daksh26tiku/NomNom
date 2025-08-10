import SignUpForm from "@/components/SignUpForm";

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
              d="M-459 0C-431.8 -34.8 -404.7 -69.5 -394.1 -105.6C-383.5 -141.7 -389.6 -179.1 -384.5 -222C-379.4 -264.9 -363.2 -313.4 -324.6 -324.6C-286 -335.8 -225 -309.7 -190 -329.1C-155 -348.4 -145.9 -413.2 -118.5 -442.4C-91.2 -471.6 -45.6 -465.3 0 -459L0 0Z"
              fill="#ff8733"
            ></path>
          </g>
          <g transform="translate(0, 0)">
            <path
              d="M459 0C439.6 39 420.1 77.9 392.2 105.1C364.2 132.3 327.7 147.6 320.4 185C313.2 222.4 335.1 281.7 324.6 324.6C314 367.4 270.9 393.8 226.5 392.3C182.1 390.8 136.6 361.5 98.6 368C60.7 374.5 30.3 416.7 0 459L0 0Z"
              fill="#ff8733"
            ></path>
          </g>
        </svg>
        <div className="flex h-full justify-center items-center ">
          <SignUpForm />
        </div>
      </div>
    </section>
  );
}
