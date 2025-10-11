import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SurveyFormComponent } from './pages/survey-form/survey-form.component';
import { SurveysListComponent } from './pages/surveys-list/surveys-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'survey', component: SurveyFormComponent },
  { path: 'surveys', component: SurveysListComponent },
  { path: 'surveys/:id/edit', component: SurveyFormComponent },
  { path: '**', redirectTo: '' }
];
