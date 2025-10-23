import { Routes } from '@angular/router';
import { SignalForm } from './signal-form/signal-form';
import { ReactiveForm } from './reactive-form/reactive-form';

export const routes: Routes = [
    { path: 'signal-form', component: SignalForm },
    { path: 'reactive-form', component: ReactiveForm },
    { path: '', redirectTo: 'signal-form', pathMatch: 'full' }
];