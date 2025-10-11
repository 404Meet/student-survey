import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray, FormBuilder, FormControl, FormGroup, Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../core/survey.service';
import { Survey } from '../../core/models/survey';

const ALPHA = /^[A-Za-z\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
const ZIP   = /^\d{5}(-\d{4})?$/;

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],  // ← IMPORTANT
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit {
  form!: FormGroup;
  editId?: number;

  likedOptions = [
    { key: 'students',   label: 'Students' },
    { key: 'location',   label: 'Location' },
    { key: 'campus',     label: 'Campus' },
    { key: 'atmosphere', label: 'Atmosphere' },
    { key: 'dorms',      label: 'Dorm Rooms' },
    { key: 'sports',     label: 'Sports' },
  ];

  constructor(
    private fb: FormBuilder,
    private svc: SurveyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName:   ['', [Validators.required, Validators.pattern(ALPHA)]],
      lastName:    ['', [Validators.required, Validators.pattern(ALPHA)]],
      street:      ['', [Validators.required]],
      city:        ['', [Validators.required, Validators.pattern(ALPHA)]],
      state:       ['', [Validators.required, Validators.pattern(ALPHA)]],
      zip:         ['', [Validators.required, Validators.pattern(ZIP)]],
      telephone:   ['', [Validators.required, Validators.pattern(PHONE)]],
      email:       ['', [Validators.required, Validators.pattern(EMAIL)]],
      surveyDate:  ['', [Validators.required]],
      recommend:   ['', [Validators.required]],
      liked: this.buildLikedArray(),
      interestSource: ['', [Validators.required]],
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

  private buildLikedArray(): FormArray<FormControl<boolean>> {
    const controls = this.likedOptions.map(
      () => new FormControl<boolean>(false, { nonNullable: true })
    );
    return new FormArray<FormControl<boolean>>(controls);
  }

  private patchFromModel(s: Survey) {
    this.form.patchValue({
      firstName: s.firstName,
      lastName:  s.lastName,
      street:    s.street,
      city:      s.city,
      state:     s.state,
      zip:       s.zip,
      telephone: s.telephone,
      email:     s.email,
      surveyDate:s.surveyDate,
      recommend: s.recommend,
      interestSource: s.interestSource,
      comments: s.comments ?? ''
    });

    this.likedOptions.forEach((opt, i) => {
      const checked = s.liked?.includes(opt.key) ?? false;
      this.likedArray.at(i).setValue(checked);
    });
  }

  private atLeastTwoLiked(): boolean {
    const picked = (this.likedArray.value as boolean[]).filter(v => v).length;
    return picked >= 2;
  }

  submit() {
    if (!this.atLeastTwoLiked()) {
      this.form.setErrors({ likedMin: true });
      return;
    }
    if (this.form.invalid) return;

    const likedPicked = (this.likedArray.value as boolean[])
      .map((v, i) => (v ? this.likedOptions[i].key : null))
      .filter(Boolean) as string[];

    const payload: Survey = { ...this.form.getRawValue(), liked: likedPicked };

    const req$ = this.editId
      ? this.svc.update(this.editId, payload)
      : this.svc.create(payload);

    req$.subscribe(() => this.router.navigate(['/surveys']));
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
