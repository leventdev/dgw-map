"use client";

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"
import dynamic from "next/dynamic";
import { getPickupPoints } from "./query";
import { toast } from "sonner";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const SearchBox = dynamic(
    () => import("@mapbox/search-js-react").then((mod) => mod.SearchBox),
    { ssr: false }
);

export default function Map() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const moveDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [center, setCenter] = useState<{ lng: number; lat: number }>({ lng: 18.296212, lat: 47.240285 });
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [mapSearchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (center.lng && center.lat) {
            const pickupPointsPromise = new Promise((resolve, reject) => {
                getPickupPoints(center.lat, center.lng, "e8c87b49-2afe-4baa-b0a6-74fd07badba0")
                    .then((points) => {
                        console.log("Fetched pickup points:", points);
                        resolve(true);
                    }
                    )
                    .catch((error) => {
                        console.error("Error fetching pickup points:", error);
                        reject({message: error.message || "Unknown error"});
                    });
            });

            toast.promise(pickupPointsPromise, {
                loading: "Csomagpontok keresése...",
                success: "Csomagpontok sikeresen betöltve!",
                error: ({message}: {message: string}) => `Hiba a csomagpontok betöltésekor: ${message}`,
            });

        }
    }, [center]);

    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [18.296212, 47.240285],
                zoom: 15,
                maxZoom: 18,
                minZoom: 10,
            });

            mapRef.current = map;

            const onMoveEnd = () => {
                if (moveDebounceRef.current) {
                    clearTimeout(moveDebounceRef.current);
                }

                moveDebounceRef.current = setTimeout(() => {
                    const center = map.getCenter();

                    setCenter((prevCenter) => {
                        if (Math.abs(prevCenter.lng - center.lng) > 0.001 || Math.abs(prevCenter.lat - center.lat) > 0.001) {
                            return center;
                        }
                        return prevCenter;
                    });
                }, 1250);
            };

            map.on("moveend", onMoveEnd);

            //Unmount cleanup
            return () => {
                map.remove();
            }
        }
    }, []);
    return (
        <div className="relative w-screen h-screen">
            <div ref={mapContainerRef} className="h-screen w-screen p-4">
                <SearchBox accessToken={MAPBOX_ACCESS_TOKEN}
                    map={mapRef.current ?? undefined}
                    mapboxgl={mapboxgl}
                    value={mapSearchInput}
                    onChange={(value) => {
                        setSearchInput(value);
                    }}
                    marker
                />
            </div>
        </div>
    )
}