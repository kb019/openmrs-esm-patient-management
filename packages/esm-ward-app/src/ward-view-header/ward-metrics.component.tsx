import React from 'react';
import styles from './ward-metrics.scss';
import { useBeds } from '../hooks/useBeds';
import { useParams } from 'react-router-dom';
import { showNotification } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { getBedMetrics } from '../ward-view/ward-view.resource';
import WardMetric from './ward-metric.component';

const bedMetrics = [
  { name: 'Patients', key: 'patients' },
  { name: 'Free beds', key: 'freeBeds' },
  { name: 'Capacity', key: 'capacity' },
];
const WardMetrics = () => {
  const { locationUuid: locationUuidFromUrl } = useParams();
  const { beds, isLoading, error } = useBeds({ locationUuid: locationUuidFromUrl });
  const { t } = useTranslation();
  if (error) {
    showNotification({
      kind: 'error',
      title: t('errorLoadingBedDetails', 'Error Loading Bed Details'),
      description: error.message,
    });
  }
  const bedMetricValues = getBedMetrics(beds);
  return (
    <div className={styles.metricsContainer}>
      {bedMetrics.map((bedMetric) => (
        <WardMetric
          metricName={bedMetric.name}
          metricValue={bedMetricValues[bedMetric.key]}
          isLoading={!!isLoading}
          key={bedMetric.key}
        />
      ))}
      {/* TODO: use real time value when the api is ready */}
      <WardMetric metricName="Pending out" metricValue="10" isLoading={false} />
    </div>
  );
};

export default WardMetrics;
