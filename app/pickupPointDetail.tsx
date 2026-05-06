"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";

export default function PickupPointDetail(isSheetOpen: boolean, setIsSheetOpen: (open: boolean) => void, renderingPickupPoint: PickupPoint | null, choosePickupPoint: (point: PickupPoint) => void = () => { }) {

    var sortedOpeningHours: { [day: string]: PickupPointOpeningHour[] } = {};
    if (renderingPickupPoint) {
        sortedOpeningHours = renderingPickupPoint.openingHours.reduce((acc, oh) => {
            if (!acc[oh.day]) {
                acc[oh.day] = [];
            }
            acc[oh.day].push(oh);
            return acc;
        }, {} as { [day: string]: PickupPointOpeningHour[] });
    }

    var DAYS_MAP: { [key: string]: string } = {
        "MONDAY": "Hétfő",
        "TUESDAY": "Kedd",
        "WEDNESDAY": "Szerda",
        "THURSDAY": "Csütörtök",
        "FRIDAY": "Péntek",
        "SATURDAY": "Szombat",
        "SUNDAY": "Vasárnap"
    };

    var TYPES_MAP: { [key: string]: string } = {
        "LOCKER": "Csomagautomata",
        "SHOP": "Bolt",
        "POST_OFFICE": "Posta",
    };
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent>
                <SheetHeader className="pr-12">
                    <Image src={renderingPickupPoint?.icon || ""} alt="Operator Icon" width={128} height={128} className="inline-block mx-auto rounded-sm border border-gray-200 mb-2" />
                    <SheetTitle>
                        {renderingPickupPoint?.name}
                    </SheetTitle>
                    <SheetTitle className="text-sm text-gray-700">
                        {renderingPickupPoint?.operator.name}
                    </SheetTitle>
                    <SheetDescription>
                        {renderingPickupPoint?.address.addressLine1}, {renderingPickupPoint?.address.city} {renderingPickupPoint?.address.postalCode}
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                    <h3 className="text-lg font-semibold mb-2">Nyitvatartás</h3>
                    <ul className="space-y-1">
                        {Object.entries(sortedOpeningHours).map(([day, hours]) => (
                            <li key={day}>
                                <span className="font-medium">{DAYS_MAP[day]}:</span>{" "}
                                {hours.map((h, index) => (
                                    <span key={index}>
                                        {h.start.hour.toString().padStart(2, "0")}:{h.start.minute.toString().padStart(2, "0")} - {h.end.hour.toString().padStart(2, "0")}:{h.end.minute.toString().padStart(2, "0")}
                                        {index < hours.length - 1 && ", "}
                                    </span>
                                ))}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-lg font-semibold mt-4 mb-2">Típus</h3>
                    <p>{TYPES_MAP[renderingPickupPoint?.type || ""] || renderingPickupPoint?.type}</p>
                    {renderingPickupPoint?.phone && (
                        <>
                            <h3 className="text-lg font-semibold mt-4 mb-2">Telefon</h3>
                            <p>
                                {renderingPickupPoint?.phone}
                            </p>
                        </>
                    )}
                    <Button onClick={
                        () => {
                            if (renderingPickupPoint) {
                                choosePickupPoint(renderingPickupPoint);
                                setIsSheetOpen(false);
                            }
                        }} className="mt-6 w-full">
                        Kiválasztás
                    </Button>
                </div>
            </SheetContent>
        </Sheet >
    );
}