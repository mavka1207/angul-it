import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { Captcha } from './captcha';

describe('Captcha', () => {
  let component: Captcha;
  let fixture: ComponentFixture<Captcha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Captcha],
      providers: [provideAnimations()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Captcha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
