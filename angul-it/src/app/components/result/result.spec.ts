import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Result } from './result';
import { provideAnimations } from '@angular/platform-browser/animations';


describe('Result', () => {
  let component: Result;
  let fixture: ComponentFixture<Result>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Result],
      providers: [
        { provide: Router, useValue: routerSpy },
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Result);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call goHome on button click', () => {
    spyOn(component, 'goHome');

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();

    expect(component.goHome).toHaveBeenCalled();
  });

  it('should navigate to home in goHome', () => {
    component.goHome();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
