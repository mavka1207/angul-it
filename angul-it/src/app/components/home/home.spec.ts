import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render welcome and button', () => {
  const h1 = fixture.nativeElement.querySelector('h1');
  const btn = fixture.nativeElement.querySelector('button');
  expect(h1.textContent).toContain('Welcome');
  expect(btn).toBeTruthy();
});

it('should emit start challenge event on click', () => {
  spyOn(component, 'startChallenge');
  const btn = fixture.nativeElement.querySelector('button');
  btn.click();
  expect(component.startChallenge).toHaveBeenCalled();
});
it('should render challenge question', () => {
  component.challenge = mockChallenge;
  fixture.detectChanges();
  const h2 = fixture.nativeElement.querySelector('h2');
  expect(h2.textContent).toContain(mockChallenge.question);
});

it('should select/unselect images on click', () => {
  component.challenge = mockChallenge;
  fixture.detectChanges();
  const imgs = fixture.nativeElement.querySelectorAll('img');
  imgs[0].click();
  expect(component.selected.includes(0)).toBeTrue();
  imgs[0].click();
  expect(component.selected.includes(0)).toBeFalse();
});

it('should not go next with incorrect selection', () => {
  component.challenge = mockChallenge;
  component.selected = []; // Ничего не выбрано
  component.next();
  expect(component.error).toBeTruthy();
});

it('should go next with correct answer', () => {
  component.challenge = mockChallenge;
  component.selected = [0, 1, 2]; // Предположим, правильные индексы
  spyOn(component, 'goToResult');
  component.next();
  expect(component.goToResult).toHaveBeenCalled();
});

});
