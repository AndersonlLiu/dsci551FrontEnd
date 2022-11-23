import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdfsComponent } from './edfs.component';

describe('EdfsComponent', () => {
  let component: EdfsComponent;
  let fixture: ComponentFixture<EdfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdfsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
