import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Result } from './result';

describe('Result', () => {
  let component: Result;
  let fixture: ComponentFixture<Result>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Result]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Result);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show result message', () => {
  fixture.detectChanges();
  const msg = fixture.nativeElement.querySelector('.result-message');
  expect(msg.textContent).toContain('not a bot');
});

it('should restart on button click', () => {
  spyOn(component, 'restart');
  const btn = fixture.nativeElement.querySelector('button');
  btn.click();
  expect(component.restart).toHaveBeenCalled();
});

});
