import React from 'react';
import styles from './admission-requests-workspace.scss';
import AdmissionRequestCard from './admission-request-card.component';
import { useParams } from 'react-router-dom';
import { useDisposition } from '../hooks/useDisposition';
import EmptyBedSkeleton from '../beds/empty-bed-skeleton';
import { useTranslation } from 'react-i18next';
import { closeWorkspace, showNotification } from '@openmrs/esm-framework';


const AdmissionRequestsWorkspace = () => {
  const { locationUuid } = useParams();
  const { t } = useTranslation();
  const { dispositionResults, isLoading, error } = useDisposition(locationUuid);
 
  if (isLoading) {
    return (
      <div className={styles.admissionRequestsWorkspaceContainer}>
        <div className={styles.admissionRequestsWorkspace}>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <EmptyBedSkeleton key={i} />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    closeWorkspace('admission-requests-cards');
    showNotification({
      kind: 'error',
      title: t('errorLoadingPatientAdmissionRequests', 'Error Loading Patient Admission Requests'),
      description: error.message,
    });
  }
  return (
    <div className={styles.admissionRequestsWorkspaceContainer}>
      <div className={styles.admissionRequestsWorkspace}>
        {dispositionResults?.filter((disposition)=>disposition.type==="ADMISSION").map((disposition) => <AdmissionRequestCard patient={disposition.patient} />)}
      </div>
    </div>
  );
};

export default AdmissionRequestsWorkspace;
