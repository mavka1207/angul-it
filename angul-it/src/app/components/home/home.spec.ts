import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Home } from './home';
import { provideAnimations } from '@angular/platform-browser/animations';


describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: Router, useValue: routerSpy },
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should render title and start button', () => {
  const title: HTMLElement =
    fixture.nativeElement.querySelector('h1') ||
    fixture.nativeElement.querySelector('h2') ||
    fixture.nativeElement.querySelector('mat-card-title');

  const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');

  expect(title).toBeTruthy();
  expect(btn).toBeTruthy();
});

  it('should call startChallenge when button is clicked', () => {
    spyOn(component, 'startChallenge');

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();

    expect(component.startChallenge).toHaveBeenCalled();
  });

  it('should navigate to /captcha in startChallenge', () => {
    component.startChallenge();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/captcha']);
  });
});
