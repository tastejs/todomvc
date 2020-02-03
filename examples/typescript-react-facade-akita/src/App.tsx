import * as React from 'react';
import { IonApp, IonPage, IonIcon, IonLabel, IonItem } from '@ionic/react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { akitaDevtools } from '@datorama/akita';
import { logoBuffer } from 'ionicons/icons';

import './styles.css';
import './theme.css';
import '@ionic/react/css/ionic.bundle.css';

import { TodosPage } from './components';

akitaDevtools();

const readBlog = {
  marginRight: '14px',
  padding: '4px',
  '--min-height': '24px',
  '--border-radius': '5px',
  fontSize: '12px'
} as React.CSSProperties;

export const App: React.FC = () => {
  return (
    <IonApp className="app">
      <IonPage>
        <IonHeader className="header">
          <IonToolbar>
            <IonTitle slot="start">Todo Manager</IonTitle>
            <IonItem href="http://bit.ly/react-facades" target="_blank" slot="end" style={readBlog}>
              <IonIcon icon={logoBuffer} />
              <IonLabel style={{ paddingLeft: '3px' }}>Read Blog</IonLabel>
            </IonItem>
          </IonToolbar>
        </IonHeader>
        <TodosPage />
      </IonPage>
    </IonApp>
  );
};
