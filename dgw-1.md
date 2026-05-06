
# Delivery Gateway 1.-es feladat
## Architektúra
Az implementáció egy Coordinator Laravel Command-ot, és Worker Laravel Job-okat használ a szolgáltató API hivásához, és a pontok tárolásához.
### Coordinator
A Coordinator Command felelős a Worker Job-ok dispatcholásáért, illetve a batch-ek disztibuciójáért.
A Coordinator-ban paraméterként megadható, hogy hány párhuzamos Worker Job fusson, illetve félbeszakadás esetén a kezdő iteráció száma. Ezután a Coordinator dispatchel `t` mennyiségű Worker-t, mint paraméter átadva hányas Worker [`n`)] hány Worker fut összesen [`t`], hányadik iteráció [`i`] (amikor a Coordinator dispatcheli a Worker-t, ez 0 alapból), illetve a per-page item számot. Ezután a Coordinator Command befejeződik, és a munka a Worker Job-okban folytatódik.
### Worker
Mivel a Worker Job-ok párhuzamosan futnak, ezért minden Worker az `n` + (`t`*`i`)-ik oldalt kéri le az API-ból. Ez a séma engedélyezi a párhuzamos futtatást egymástól függetlenül.
Hogyha az API hívás egy Rate Limit hibát dobna vissza, akkor a Worker újra próbálkozik egy exponenciális backoffal (Maximum perc-limitig), így nem terheli túl az API-t, és nem bukik el a Job.
Hogyha az API hívás más miatt elbukik, akkor ezt egy táblában menteném, az oldalszámmal és a hibaüzenettel és terminálnám a Job-ot. Hogyha az API egy üres listát, vagy nem létező oldal hibát dobna vissza, akkor csak terminálnám a Job-ot.
A Worker az API által visszaadott pontok listáját, tömbösen Upserteli, így egyszerre több pontot lehet menteni, kissebb adatbázis terheléssel. Hogy a Worker idempotensen tudjon működni, a szolgáltató azonosítójára, illetve a szolgáltató által adott azonosítóra uniqueness constraintet kell követelni ha az adatbázis migráció során eddig nem volt követelve, így az upsert frissíti a meglévő csomagpontot, és nem elbukik mint egy insert.
Hogyha a tömbös upsert elbukik, for loopban, egyesével upsertelném a pontokat, így első import gyorsabb a tömbös upserttel, és a re-runok se buknak el teljesen, mert átugrik az egyesével upsertelésre a Worker.
Hogyha a második, per-item upsert is elbukik, az oldalszámot, és a pont azonosítóját, a raw API itemet és a hibaüzenetet menteném egy második táblában.
Ezután a Worker Job dispatchelné a következő Worker-t, az `i` paramétert inkrementálva.
## Státusz követés
Hogyha erre is szükség van, akkor a Worker Job-ok státuszát Redis-ben lehetne tárolni, ahol a workerek a saját azonosítójukat és a metric kombinációját használják kulcsként, és a státuszt értékként. Mint például `worker:{n}:unsuccessful_items`, `worker:{n}:last_page`, `worker:{n}:current_iteration`, `worker:{n}:avg_runtime` stb. Így egy  Command-ból lekérdezhető a Worker Job-ok státusza, vagy dashboardon megjeleníthető.
## Kompromisszumok
A láncolt Job dispatchelés sok esetben nem ideális, de mivel sok API nem adja vissza a teljes oldalszámot, ezért ez a láncolt dispatchelés engedélyezi a párhuzamos futtatást egymástól függetlenül. Hogyha egy Job elbukik, akkor egy max-retry policyval automatikusan újra próbálkozik, így nem bukik el a teljes folyamat egy API hiba miatt.
Alternatívaként, hogyha ismert a teljes oldalszám, akkor az összes Worker-t lehet a Coordinátorból dispatchelni, vagy Gallop keressél megtalálni a maximum oldalszámot, de ez $\mathcal{O}(\log t)$ több API hívással járna.
## Feltételezések
- Az API nem adja vissza a teljes oldalszámot, vagy a teljes oldalszám meghatározása sok API hívást igényelne.
- Az adatbázis minden pontot natív módon tud validálni, enum, foreign key, stb. constraintekkel, így a tömbös upsertelés nem okoz adatbázis inkonzisztenciát.