import { Field } from '@/components/ui/form';
import { KiosSection } from './kios-section';

export interface KiosTimerProps {}

const KiosTimer = (props: KiosTimerProps) => {
  return (
    <KiosSection title='Thời gian'>
      <Field component='datepicker' name='expiryDate' />
    </KiosSection>
  );
};

export default KiosTimer;
