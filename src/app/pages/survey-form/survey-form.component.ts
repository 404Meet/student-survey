import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../core/survey.service';
import { Survey } from '../../core/models/survey';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;

  constructor(
    private fb: FormBuilder,
    private svc: SurveyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      surveyDate: ['', Validators.required],
      recommend: ['', Validators.required],
      liked: new FormArray([
        new FormControl(false, { nonNullable: true }),
        new FormControl(false, { nonNullable: true }),
        new FormControl(false, { nonNullable: true }),
        new FormControl(false, { nonNullable: true }),
        new FormControl(false, { nonNullable: true }),
        new FormControl(false, { nonNullable: true }),
      ]),
      interestSource: ['', Validators.required],
      comments: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.svc.getById(this.editId).subscribe(s => this.patchFromModel(s));
    }
  }

  get likedArray(): FormArray<FormControl<boolean>> {
    return this.form.get('liked') as FormArray<FormControl<boolean>>;
  }

  private patchFromModel(s: Survey) {
    this.form.patchValue({
      firstName: s.firstName,
      lastName: s.lastName,
      street: s.street,
      city: s.city,
      state: s.state,
      zip: s.zip,
      telephone: s.telephone,
      email: s.email,
      surveyDate: s.surveyDate,
      recommend: s.recommend,
      interestSource: s.interestSource,
      comments: s.comments
    });

    const likedKeys = ['campus', 'dorms', 'students', 'location', 'atmosphere', 'sports'];
    likedKeys.forEach((key, i) => {
      this.likedArray.at(i).setValue(s.liked?.includes(key) ?? false);
    });
  }

  submit() {
    if (this.form.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const likedKeys = ['campus', 'dorms', 'students', 'location', 'atmosphere', 'sports'];
    const likedPicked = this.likedArray.value
      .map((v, i) => (v ? likedKeys[i] : null))
      .filter(Boolean) as string[];

    const payload: Survey = { ...this.form.getRawValue(), liked: likedPicked };

    const req$ = this.editId
      ? this.svc.update(this.editId, payload)
      : this.svc.create(payload);

    req$.subscribe({
      next: () => {
        alert('Survey submitted successfully!');
        this.router.navigate(['/surveys']);
      },
      error: (err) => {
        console.error('Save failed:', err);
        alert(`Save failed: ${err?.status || ''} ${err?.statusText || err?.message || ''}`);
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
