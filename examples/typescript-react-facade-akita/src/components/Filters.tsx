import * as React from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

const inlineItem = {
  width: '40vw',
  '--min-height': '20px',
  '--border-radius': '5px',
  padding: '15px',
  marginLeft: '18vw',
  display: 'inline-block'
} as React.CSSProperties;

export type FiltersProps = {
  onChange: (filter: string) => void;
  selectedFilter: string;
};

export const Filters: React.FC<FiltersProps> = ({ onChange, selectedFilter }) => {
  const notifyFilterChange = (e: CustomEvent) => onChange(e.detail.value);
  return (
    <IonItem style={inlineItem}>
      <IonLabel>Show:</IonLabel>
      <IonSelect
        interface="popover"
        style={{ width: '100%', textAlign: 'right' }}
        value={selectedFilter}
        onIonChange={notifyFilterChange}
      >
        <IonSelectOption value="SHOW_ALL">All</IonSelectOption>
        <IonSelectOption value="SHOW_ACTIVE">Active</IonSelectOption>
        <IonSelectOption value="SHOW_COMPLETED">Completed</IonSelectOption>
      </IonSelect>
    </IonItem>
  );
};
