import type { AdmissionLocation, Bed, BedLayout, BedMetrics } from '../types';

// the server side has 2 slightly incompatible types for Bed
export function bedLayoutToBed(bedLayout: BedLayout): Bed {
  return {
    id: bedLayout.bedId,
    uuid: bedLayout.bedUuid,
    bedNumber: bedLayout.bedNumber,
    bedType: bedLayout.bedType,
    row: bedLayout.rowNumber,
    column: bedLayout.columnNumber,
    status: bedLayout.status,
  };
}

export function filterBeds(admissionLocation: AdmissionLocation): BedLayout[] {
  // admissionLocation.bedLayouts can contain row+column positions with no bed,
  // filter out layout positions with no real bed
  let collator = new Intl.Collator([], { numeric: true });
  const bedLayouts = admissionLocation.bedLayouts
    .filter((bl) => bl.bedId)
    .sort((bedA, bedB) => collator.compare(bedA.bedNumber, bedB.bedNumber));
  return bedLayouts;
}

export function getBedMetrics(beds: Bed[]): BedMetrics {
  const bedMetrics = {
    patients: '--',
    freeBeds: '--',
    capacity: '--',
  };
  if (!beds) return bedMetrics;
  const total = beds.length;
  const occupiedBeds = beds.filter((bed) => bed.status === 'OCCUPIED');
  const patients = occupiedBeds.length;
  const freeBeds = total - patients;
  const capacity = Math.trunc((patients / total) * 100);
  return { patients: patients.toString(), freeBeds: freeBeds.toString(), capacity: capacity.toString() + '%' };
}
