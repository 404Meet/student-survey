import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../core/survey.service';
import { Survey } from '../../core/models/survey';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private svc: SurveyService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.getAll().subscribe(data => {
      this.rows = data;
      this.loading = false;
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
