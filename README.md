# 1-es próbafeladat
A megoldás itt: [dgw-1.md](./dgw-1.md)


# 2-es próbafeladat

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Futtatás

A .env fájlban állítsd be a `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` környezeti változót a Mapbox API kulcsoddal.
Opcionálisan beállíthatod a `NEXT_PUBLIC_GRAPHQL_ENDPOINT` környezeti változót is, ha egyéni GraphQL végpontot szeretnél használni.
A `.env.example` fájlban megtalálod a szükséges környezeti változókat, másold át ezeket egy `.env` fájlba a gyökerében a projektnek.

Futtasd a következő parancsot:

```bash
npm run dev
```

Nyisd meg a [http://localhost:3000](http://localhost:3000) linket a böngésződben.

## Kód szerkezete
- `components/`: Ez a mappa tartalmazza a Shad CN komponenseket, amelyeket a projektben használok.
- `app/types/`: Ez a mappa tartalmazza a TypeScript típusdefiníciókat, például a `pickupPoint.ts` fájlt, amely a csomagpontok típusát definiálja.
- `app/map.tsx`: Ez a fájl tartalmazza a fő térképes komponenst, amely a Mapbox GL JS könyvtárat használja a térkép megjelenítéséhez és a csomagpontok kezeléséhez.
- `app/query.tsx`: Ez a fájl tartalmazza a GraphQL lekérdezéseket, amelyeket a projektben használok.
- `app/page.tsx`: Ez a fájl tartalmazza a fő oldalt, amely a térképet és a Toaster értesítéseket jeleníti meg.
- `app/pickupPointDetail.tsx`: Ez a fájl tartalmazza a csomagpont részleteit megjelenítő komponenst, amely egy Sheet-ben jelenik meg, amikor egy csomagpontra kattintanak a térképen.

## Technológiák
- Next.js: A React alapú keretrendszer, amelyet a projekt alapja, ezt azért választottam, mert manapság nagyon népszerű, és sok dokumentáció és közösségi támogatást élvez.
- Mapbox GL JS & Mapbox Search JS: Azért választottam a Mapbox csomagokat, mert könnyen integrálhatóak, és a Search és a GL JS csomagok könnyen tudnak együttműködni a térképen történő keresés és megjelenítés érdekében. Illetve a Mapbox GL JS-t használtam már egy hackathonon, és a meglévő tapasztalataim kellemesebbek voltak mint a Google Maps API-val.
- Shad CN: Ez a komponens könyvtár a Tailwind CSS-re épülő UI komponenseket biztosít, a gyorsabb fejlesztés érdekében.