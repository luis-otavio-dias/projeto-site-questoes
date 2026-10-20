import { useEffect } from 'react';
import { useStudy } from '../../features/questio/context';
import { DashboardPage } from '../../features/questio/StudyPages';
export function Upload() {
  const { setUploadOpen } = useStudy();
  useEffect(() => setUploadOpen(true), [setUploadOpen]);
  return <DashboardPage />;
}
