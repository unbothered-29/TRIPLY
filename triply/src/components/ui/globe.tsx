"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface GlobeProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Globe({
  width = 700,
  height = 600,
  className = "",
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const containerWidth = Math.min(
      width,
      window.innerWidth - 40
    );

    const containerHeight = Math.min(height, 600);

    const radius =
      Math.min(containerWidth, containerHeight) / 2.5;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;

    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;

    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([
        containerWidth / 2,
        containerHeight / 2,
      ])
      .clipAngle(90);

    const path = d3
      .geoPath()
      .projection(projection)
      .context(context);

    const pointInPolygon = (
      point: [number, number],
      polygon: number[][]
    ): boolean => {
      const [x, y] = point;
      let inside = false;

      for (
        let i = 0, j = polygon.length - 1;
        i < polygon.length;
        j = i++
      ) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (
          yi > y !== yj > y &&
          x <
            ((xj - xi) * (y - yi)) / (yj - yi) +
              xi
        ) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (
      point: [number, number],
      feature: any
    ): boolean => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;

        if (!pointInPolygon(point, coordinates[0])) {
          return false;
        }

        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false;
          }
        }

        return true;
      }

      if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (!pointInPolygon(point, polygon[0])) {
            continue;
          }

          let inHole = false;

          for (let i = 1; i < polygon.length; i++) {
            if (pointInPolygon(point, polygon[i])) {
              inHole = true;
              break;
            }
          }

          if (!inHole) {
            return true;
          }
        }
      }

      return false;
    };

    const generateDotsInPolygon = (
      feature: any,
      dotSpacing = 16
    ) => {
      const dots: [number, number][] = [];

      const bounds = d3.geoBounds(feature);

      const [
        [minLng, minLat],
        [maxLng, maxLat],
      ] = bounds;

      const stepSize = dotSpacing * 0.08;

      for (
        let lng = minLng;
        lng <= maxLng;
        lng += stepSize
      ) {
        for (
          let lat = minLat;
          lat <= maxLat;
          lat += stepSize
        ) {
          const point: [number, number] = [lng, lat];

          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }

      return dots;
    };

    interface DotData {
      lng: number;
      lat: number;
    }

    const allDots: DotData[] = [];

    let landFeatures: any = null;

    const render = () => {
      context.clearRect(
        0,
        0,
        containerWidth,
        containerHeight
      );

      const currentScale = projection.scale();

      const scaleFactor = currentScale / radius;

      /*
       * Globe background
       */
      context.beginPath();

      context.arc(
        containerWidth / 2,
        containerHeight / 2,
        currentScale,
        0,
        Math.PI * 2
      );

      context.fillStyle = "#000000";
      context.fill();

      /*
       * Globe outline
       */
      context.strokeStyle = "rgba(255,255,255,0.7)";
      context.lineWidth = 1.5 * scaleFactor;
      context.stroke();

      if (!landFeatures) return;

      /*
       * Latitude / longitude grid
       */
      const graticule = d3.geoGraticule();

      context.beginPath();

      path(graticule());

      context.strokeStyle = "rgba(255,255,255,0.18)";
      context.lineWidth = 0.7 * scaleFactor;

      context.stroke();

      /*
       * Country outlines
       */
      context.beginPath();

      landFeatures.features.forEach(
        (feature: any) => {
          path(feature);
        }
      );

      context.strokeStyle = "rgba(255,255,255,0.55)";
      context.lineWidth = 0.8 * scaleFactor;

      context.stroke();

      /*
       * Dotted land
       */
      allDots.forEach((dot) => {
        const projected = projection([
          dot.lng,
          dot.lat,
        ]);

        if (!projected) return;

        if (
          projected[0] < 0 ||
          projected[0] > containerWidth ||
          projected[1] < 0 ||
          projected[1] > containerHeight
        ) {
          return;
        }

        context.beginPath();

        context.arc(
          projected[0],
          projected[1],
          1.15 * scaleFactor,
          0,
          Math.PI * 2
        );

        context.fillStyle = "rgba(255,255,255,0.75)";

        context.fill();
      });
    };

    /*
     * Load Earth data
     */
    const loadWorldData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load Earth map data"
          );
        }

        landFeatures = await response.json();

        landFeatures.features.forEach(
          (feature: any) => {
            const dots = generateDotsInPolygon(
              feature,
              16
            );

            dots.forEach(([lng, lat]) => {
              allDots.push({
                lng,
                lat,
              });
            });
          }
        );

        render();
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load Earth visualization."
        );
      }
    };

    /*
     * Automatic rotation only
     */
    const rotation = [0, 0];

    const rotationSpeed = 0.35;

    const rotate = () => {
      rotation[0] += rotationSpeed;

      projection.rotate(rotation);

      render();
    };

    const rotationTimer = d3.timer(rotate);

    loadWorldData();

    /*
     * Cleanup
     */
    return () => {
      rotationTimer.stop();
    };
  }, [width, height]);

  if (error) {
    return (
      <div
        className={`flex min-h-[400px] items-center justify-center ${className}`}
      >
        <p className="text-sm text-white/40">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full justify-center ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="h-auto max-w-full"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}