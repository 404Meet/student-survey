import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../core/survey.service';
import { Survey } from '../../core/models/survey';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-surveys-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.scss']
})
export class SurveysListComponent implements OnInit {
  rows: Survey[] = [];
  loading = true;
  errorMsg = '';

  constructor(private svc: SurveyService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.errorMsg = '';
    this.svc.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => this.rows = data ?? [],
        error: (err) => {
          console.error('Survey fetch failed', err);
          this.rows = [];
          this.errorMsg = typeof err?.message === 'string'
            ? err.message
            : 'Could not load surveys.';
        }
      });
  }

  edit(id?: number) {
    if (id) this.router.navigate(['/surveys', id, 'edit']);
  }

  remove(id?: number) {
    if (!id) return;
    if (!confirm('Delete this survey?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }
}
