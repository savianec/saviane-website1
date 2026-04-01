"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/** saviane dark theme, matches site tokens */
const THEME = {
  ocean: "#1a1a1a",
  globeStroke: "rgba(184, 168, 130, 0.45)",
  graticule: "rgba(240, 240, 240, 0.14)",
  landStroke: "rgba(240, 240, 240, 0.28)",
  dots: "rgba(58, 140, 110, 0.45)",
} as const;

export interface RotatingEarthProps {
  /** Fallback width when container not measured yet */
  width?: number;
  height?: number;
  className?: string;
}

type DotData = { lng: number; lat: number };

function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]!;
    const [xj, yj] = polygon[j]!;

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInFeature(
  point: [number, number],
  feature: Feature<Polygon | MultiPolygon>
): boolean {
  const geometry = feature.geometry;

  if (geometry.type === "Polygon") {
    const coordinates = geometry.coordinates;
    if (!pointInPolygon(point, coordinates[0]!)) return false;
    for (let i = 1; i < coordinates.length; i++) {
      if (pointInPolygon(point, coordinates[i]!)) return false;
    }
    return true;
  }

  if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      if (pointInPolygon(point, polygon[0]!)) {
        let inHole = false;
        for (let i = 1; i < polygon.length; i++) {
          if (pointInPolygon(point, polygon[i]!)) {
            inHole = true;
            break;
          }
        }
        if (!inHole) return true;
      }
    }
    return false;
  }

  return false;
}

function generateDotsInPolygon(
  feature: Feature<Polygon | MultiPolygon>,
  dotSpacing = 16
): [number, number][] {
  const dots: [number, number][] = [];
  const bounds = d3.geoBounds(feature);
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const stepSize = dotSpacing * 0.08;

  for (let lng = minLng; lng <= maxLng; lng += stepSize) {
    for (let lat = minLat; lat <= maxLat; lat += stepSize) {
      const point: [number, number] = [lng, lat];
      if (pointInFeature(point, feature)) dots.push(point);
    }
  }
  return dots;
}

export default function RotatingEarth({
  width: widthProp = 800,
  height: heightProp = 600,
  className,
}: RotatingEarthProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      const w = Math.floor(cr.width);
      const h = Math.floor(cr.height);
      if (w > 0 && h > 0) setSize({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const containerW = size.w > 0 ? size.w : widthProp;
    const containerH = size.h > 0 ? size.h : heightProp;

    if (!canvas || containerW < 32 || containerH < 32) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let cancelled = false;

    const radius = Math.min(containerW, containerH) / 2.5;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = containerW * dpr;
    canvas.height = containerH * dpr;
    canvas.style.width = `${containerW}px`;
    canvas.style.height = `${containerH}px`;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerW / 2, containerH / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    const allDots: DotData[] = [];
    let landFeatures: FeatureCollection<Polygon | MultiPolygon> | null = null;

    const render = () => {
      context.clearRect(0, 0, containerW, containerH);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      context.beginPath();
      context.arc(
        containerW / 2,
        containerH / 2,
        currentScale,
        0,
        2 * Math.PI
      );
      context.fillStyle = THEME.ocean;
      context.fill();
      context.strokeStyle = THEME.globeStroke;
      context.lineWidth = 2 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = THEME.graticule;
        context.lineWidth = 1 * scaleFactor;
        context.globalAlpha = 0.9;
        context.stroke();
        context.globalAlpha = 1;

        context.beginPath();
        landFeatures.features.forEach((feature) => {
          path(feature);
        });
        context.strokeStyle = THEME.landStroke;
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (
            projected &&
            projected[0]! >= 0 &&
            projected[0]! <= containerW &&
            projected[1]! >= 0 &&
            projected[1]! <= containerH
          ) {
            context.beginPath();
            context.arc(
              projected[0]!,
              projected[1]!,
              1.15 * scaleFactor,
              0,
              2 * Math.PI
            );
            context.fillStyle = THEME.dots;
            context.fill();
          }
        });
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );
        if (!response.ok) throw new Error("Failed to load land data");

        const data = (await response.json()) as FeatureCollection<
          Polygon | MultiPolygon
        >;
        if (cancelled) return;

        landFeatures = data;

        data.features.forEach((feature) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat });
          });
        });

        render();
        setIsLoading(false);
      } catch {
        if (!cancelled) {
          setError("Failed to load land map data");
          setIsLoading(false);
        }
      }
    };

    const rotation: [number, number] = [0, 0];
    let autoRotate = true;
    const rotationSpeed = 0.35;

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
        render();
      }
    };

    const rotationTimer = d3.timer(rotate);

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation: [number, number] = [...rotation];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

        projection.rotate(rotation);
        render();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setTimeout(() => {
          autoRotate = true;
        }, 400);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.92 : 1.08;
      const newScale = Math.max(
        radius * 0.5,
        Math.min(radius * 2.8, projection.scale() * factor)
      );
      projection.scale(newScale);
      render();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    void loadWorldData();

    return () => {
      cancelled = true;
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [size.w, size.h, widthProp, heightProp]);

  if (error) {
    return (
      <div
        className={cn(
          "flex min-h-[200px] items-center justify-center p-6",
          className
        )}
      >
        <div className="text-center">
          <p className="text-destructive mb-2 font-semibold">
            Could not load globe
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("relative h-full w-full min-h-[260px]", className)}
    >
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader2
            className="text-primary size-8 animate-spin opacity-80"
            aria-hidden
          />
          <span className="sr-only">Loading globe</span>
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-grab bg-transparent active:cursor-grabbing"
        style={{ maxWidth: "100%" }}
        aria-label="Interactive dotted globe of Earth"
      />
    </div>
  );
}
