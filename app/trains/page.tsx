import { z } from 'zod';

const resultSchema = z.object({
  departures: z.array(
    z.object({
      service: z
        .object({
          formation: z.object({
            avgLoading: z.number(),
            avgLoadingSpecified: z.boolean(),
            coaches: z.array(
              z.object({
                coachClass: z.string(),
                toilet: z.object({ status: z.number(), value: z.string() }),
                loading: z.number(),
                loadingSpecified: z.boolean(),
                number: z.string(),
              }),
            ),
          }),
          origin: z.array(
            z.object({
              locationName: z.string(),
              crs: z.string(),
              via: z.any().nullable(),
              futureChangeTo: z.any().nullable(),
              assocIsCancelled: z.boolean(),
            }),
          ),
          destination: z.array(
            z.object({
              locationName: z.string(),
              crs: z.string(),
              via: z.any().nullable(),
              futureChangeTo: z.any().nullable(),
              assocIsCancelled: z.boolean(),
            }),
          ),
          currentOrigins: z.any().nullable(),
          currentDestinations: z.any().nullable(),
          rsid: z.any().nullable(),
          serviceIdPercentEncoded: z.string(),
          serviceIdGuid: z.string(),
          serviceIdUrlSafe: z.string(),
          sta: z.string().nullable(),
          eta: z.string().nullable(),
          std: z.string(),
          etd: z.string(),
          platform: z.string(),
          operator: z.string(),
          operatorCode: z.string(),
          isCircularRoute: z.boolean(),
          isCancelled: z.boolean(),
          filterLocationCancelled: z.boolean(),
          serviceType: z.number(),
          length: z.number(),
          detachFront: z.boolean(),
          isReverseFormation: z.boolean(),
          cancelReason: z.any().nullable(),
          delayReason: z.any().nullable(),
          serviceID: z.string(),
          adhocAlerts: z.any().nullable(),
        })
        .nullable(),
      crs: z.string(),
    }),
  ),
  generatedAt: z.coerce.date(),
  locationName: z.string(),
  crs: z.string(),
  filterLocationName: z.string().nullable(),
  filtercrs: z.string().nullable(),
  nrccMessages: z.any().nullable(),
  platformAvailable: z.boolean(),
  areServicesAvailable: z.boolean(),
});

export default async function Page() {
  const url = 'https://huxley2.azurewebsites.net/fastest/cannon%20street/to/westcombe%20park,charlton';

  const res = await fetch(url, {
    next: { revalidate: 60 * 3 },
  });

  const nextTrains = await res.json();

  const parsedResult = resultSchema.safeParse(nextTrains);

  return (
    <>
      <h1>Trains</h1>
      {parsedResult.success ? (
        <ul>
          {parsedResult.data.departures.map((d) => (
            <li key={d.crs}>
              {d.crs}: {d.service ? `${d.service.std} (${d.service?.etd})` : 'No services today'}
            </li>
          ))}
        </ul>
      ) : (
        <p>Error loading train info</p>
      )}
    </>
  );
}
export const metadata = {
  title: 'Train Timetable',
  description: 'Commuting times',
};
