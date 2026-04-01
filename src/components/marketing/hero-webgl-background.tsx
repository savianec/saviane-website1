"use client";

import dynamic from "next/dynamic";

const GLSLHills = dynamic(
  () => import("@/components/ui/glsl-hills").then((m) => m.GLSLHills),
  { ssr: false }
);

export function HeroWebGLBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <GLSLHills
        width="100%"
        height="100%"
        className="h-full min-h-[88vh] w-full"
        cameraZ={125}
        planeSize={256}
        speed={0.35}
      />
    </div>
  );
}
